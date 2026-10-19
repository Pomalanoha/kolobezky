// Přijetí objednávky: ověření, výpočet ceny na serveru, uložení do D1, e-maily.
import type { APIRoute } from 'astro';
import { getCatalog, parseOrderForm, priceOrder } from '../../lib/shop';
import { createOrder } from '../../lib/orders';
import { sendOrderEmails } from '../../lib/mail';

export const prerender = false;

const html = (title: string, body: string, status = 400) =>
  new Response(
    `<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title><body style="font-family:system-ui;max-width:560px;margin:48px auto;padding:0 16px;line-height:1.6"><h1>${title}</h1>${body}<p><a href="javascript:history.back()">← Zpět k objednávce</a></p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

export const POST: APIRoute = async ({ request, locals, url }) => {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return wantsJson ? Response.json({ ok: false, message: 'Neplatný požadavek.' }, { status: 400 }) : html('Neplatný požadavek', '');
  }

  // Past na roboty: skryté pole vyplní jen spam.
  if (String(form.get('website') ?? '').trim()) {
    return wantsJson ? Response.json({ ok: true, redirect: '/' }) : Response.redirect(new URL('/', url), 303);
  }

  const input = parseOrderForm(form);
  const result = priceOrder(input, await getCatalog());
  if (result.errors) {
    if (wantsJson) return Response.json({ ok: false, errors: result.errors }, { status: 422 });
    return html('Objednávku je potřeba doplnit', `<ul>${Object.values(result.errors).map((e) => `<li>${e}</li>`).join('')}</ul>`, 422);
  }

  let order;
  try {
    order = await createOrder(input, result.order);
  } catch (err) {
    console.error('Order save failed', err);
    const message = 'Objednávku se nepodařilo uložit. Zkus to prosím za chvíli znovu, nebo napiš Lindě.';
    return wantsJson ? Response.json({ ok: false, message }, { status: 500 }) : html('Chyba', `<p>${message}</p>`, 500);
  }

  // E-maily se odešlou na pozadí, zákazník nečeká.
  const mails = sendOrderEmails(order, url.origin).catch((err) => console.error('Mail failed', err));
  locals.cfContext?.waitUntil(mails);

  const redirect = `/bestelling/?nr=${encodeURIComponent(order.number)}&t=${order.token}`;
  return wantsJson ? Response.json({ ok: true, redirect }) : Response.redirect(new URL(redirect, url), 303);
};
