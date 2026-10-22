// Objednávka dárkového poukazu.
import type { APIRoute } from 'astro';
import { parseVoucherForm } from '../../lib/voucher';
import { createOrder } from '../../lib/orders';
import { sendOrderEmails } from '../../lib/mail';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, url }) => {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const form = await request.formData().catch(() => null);
  if (!form) return Response.json({ ok: false, message: 'Ongeldig verzoek.' }, { status: 400 });
  if (String(form.get('website') ?? '').trim()) {
    return wantsJson ? Response.json({ ok: true, redirect: '/' }) : Response.redirect(new URL('/', url), 303);
  }

  const result = parseVoucherForm(form);
  if (result.errors) {
    if (wantsJson) return Response.json({ ok: false, errors: result.errors }, { status: 422 });
    return new Response(`<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><body style="font-family:system-ui;max-width:560px;margin:48px auto;padding:0 16px"><h1>Je bestelling is nog niet compleet</h1><ul>${Object.values(result.errors).map((e) => `<li>${e}</li>`).join('')}</ul><p><a href="javascript:history.back()">← Terug</a></p>`, { status: 422, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const order = await createOrder(result.input, result.priced, result.meta);
    locals.cfContext?.waitUntil(sendOrderEmails(order, url.origin).catch((err) => console.error('Mail failed', err)));
    const redirect = `/bestelling/?nr=${encodeURIComponent(order.number)}&t=${order.token}`;
    return wantsJson ? Response.json({ ok: true, redirect }) : Response.redirect(new URL(redirect, url), 303);
  } catch (err) {
    console.error('Voucher order failed', err);
    const message = 'Je bestelling kon niet worden opgeslagen. Probeer het opnieuw of stuur een WhatsApp-bericht.';
    return wantsJson ? Response.json({ ok: false, message }, { status: 500 }) : new Response(message, { status: 500 });
  }
};
