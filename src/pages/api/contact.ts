// Kontaktní formulář a poptávka skupin: ověření, uložení do D1, upozornění e-mailem (pokud je Resend nastavený).
import type { APIRoute } from 'astro';
import { createMessage, isSubject } from '../../lib/messages';
import { sendContactEmail } from '../../lib/mail';

export const prerender = false;

const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? '').trim().slice(0, max);

export const POST: APIRoute = async ({ request, locals, url }) => {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const form = await request.formData().catch(() => null);
  if (!form) return wantsJson ? Response.json({ ok: false, message: 'Ongeldig verzoek.' }, { status: 400 }) : new Response('Ongeldig verzoek', { status: 400 });

  // Past na roboty
  if (clean(form.get('website'))) {
    return wantsJson ? Response.json({ ok: true, redirect: '/bedankt/' }) : Response.redirect(new URL('/bedankt/', url), 303);
  }

  const subjectRaw = clean(form.get('onderwerp'), 40);
  const data = {
    subject: isSubject(subjectRaw) ? subjectRaw : ('anders' as const),
    name: clean(form.get('naam'), 120),
    email: clean(form.get('email')).toLowerCase(),
    phone: clean(form.get('telefoon'), 40),
    message: clean(form.get('bericht'), 3000),
    meta: Object.fromEntries(
      (['groep_grootte', 'datum', 'soort'] as const)
        .map((k) => [k, clean(form.get(k), 120)] as const)
        .filter(([, v]) => v),
    ),
  };

  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.naam = 'Vul je voor- en achternaam in.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = 'Vul een geldig e-mailadres in.';
  if (data.phone && !/^[+\d][\d\s()-]{6,}$/.test(data.phone)) errors.telefoon = 'Vul je telefoonnummer in met cijfers.';
  if (form.get('toestemming') !== 'on') errors.toestemming = 'We hebben je toestemming nodig om je gegevens te verwerken.';

  if (Object.keys(errors).length) {
    if (wantsJson) return Response.json({ ok: false, errors }, { status: 422 });
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><body style="font-family:system-ui;max-width:560px;margin:48px auto;padding:0 16px"><h1>Het formulier is nog niet compleet</h1><ul>${Object.values(errors).map((e) => `<li>${e}</li>`).join('')}</ul><p><a href="javascript:history.back()">← Terug</a></p>`, { status: 422, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const saved = await createMessage(data);
    locals.cfContext?.waitUntil(sendContactEmail(saved, url.origin).catch((err) => console.error('Mail failed', err)));
  } catch (err) {
    console.error('Message save failed', err);
    const message = 'Je bericht kon niet worden verzonden. Probeer het opnieuw of stuur een WhatsApp-bericht.';
    return wantsJson ? Response.json({ ok: false, message }, { status: 500 }) : new Response(message, { status: 500 });
  }

  return wantsJson ? Response.json({ ok: true, redirect: '/bedankt/' }) : Response.redirect(new URL('/bedankt/', url), 303);
};
