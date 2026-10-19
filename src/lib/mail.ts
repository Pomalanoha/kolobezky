// E-maily přes Resend (https://resend.com). Funguje až po nastavení RESEND_API_KEY a MAIL_FROM
// (odesílací adresa na ověřené doméně). Bez nich se objednávka jen uloží a je vidět v administraci.
import { site, shop } from '../config';
import { secret } from './env';
import { formatCents } from './shop';
import type { Order } from './orders';
import { SUBJECTS, type Message } from './messages';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const mailConfigured = () => Boolean(secret('RESEND_API_KEY') && secret('MAIL_FROM'));

async function send(to: string, subject: string, html: string, replyTo?: string) {
  const key = secret('RESEND_API_KEY');
  const from = secret('MAIL_FROM');
  if (!key || !from) return;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) console.error('Resend error', res.status, await res.text());
}

function linesTable(order: Order) {
  const rows = order.lines
    .map((l) => `<tr><td style="padding:6px 0">${l.qty}× ${esc(l.title)}</td><td style="padding:6px 0;text-align:right">${formatCents(l.totalCents)}</td></tr>`)
    .join('');
  const shipping = order.shippingCents === null ? 'volgt per e-mail' : order.shippingCents === 0 ? 'gratis' : formatCents(order.shippingCents);
  return `<table style="width:100%;border-collapse:collapse;font-size:15px">${rows}
    <tr><td style="padding:6px 0;border-top:1px solid #ddd">${esc(order.shippingLabel)}</td><td style="padding:6px 0;border-top:1px solid #ddd;text-align:right">${shipping}</td></tr>
    <tr><td style="padding:8px 0;font-weight:700">Totaal incl. btw</td><td style="padding:8px 0;text-align:right;font-weight:700">${formatCents(order.totalCents)}</td></tr></table>`;
}

function address(order: Order) {
  return [order.name, order.street, `${order.postcode} ${order.city}`.trim(), order.phone, order.email].filter(Boolean).map(esc).join('<br>');
}

export async function sendOrderEmails(order: Order, origin: string) {
  if (!mailConfigured()) return;
  const payment = shop.bank.iban
    ? `<p>Wil je <strong>${formatCents(order.totalCents)}</strong> binnen ${shop.paymentDays} dagen overmaken naar <strong>${esc(shop.bank.iban)}</strong> t.n.v. ${esc(shop.bank.accountName)}, onder vermelding van <strong>${order.number}</strong>?</p>`
    : `<p>De betaalgegevens sturen we je in een aparte e-mail.</p>`;
  const customer = `<div style="font-family:Arial,sans-serif;max-width:560px;color:#17221e">
    <h1 style="font-size:22px">Bedankt voor je bestelling ${order.number}</h1>
    <p>Hoi ${esc(order.name)}, je bestelling is binnen. Hier is het overzicht:</p>
    ${linesTable(order)}
    <h2 style="font-size:17px">Betalen per overboeking</h2>${payment}
    ${order.meta.type === 'voucher'
      ? `<h2 style="font-size:17px">Cadeaubon</h2><p>Na ontvangst van de betaling sturen we je een link naar de cadeaubon om te printen. Voorbeeld: <a href="${origin}/cadeaubon/bekijken/?nr=${order.number}&t=${order.token}">${origin}/cadeaubon/bekijken/</a></p>`
      : `<h2 style="font-size:17px">Levering</h2><p>Levering ${esc(shop.deliveryTime)} na ontvangst van de betaling. We laten je weten wanneer.</p>`}
    <p><strong>Adres:</strong><br>${address(order)}</p>
    <p>Je bestelling vind je ook hier: <a href="${origin}/bestelling/?nr=${order.number}&t=${order.token}">${origin}/bestelling/</a></p>
    <p style="font-size:13px;color:#555">Je hebt het recht om de overeenkomst binnen 14 dagen na ontvangst zonder opgave van redenen te herroepen. Meer in de <a href="${origin}/algemene-voorwaarden/">algemene voorwaarden</a>.</p>
    <p>${esc(site.owner)} · ${esc(site.name)} · ${esc(site.phone)}</p></div>`;
  const admin = `<div style="font-family:Arial,sans-serif;max-width:560px">
    <h1 style="font-size:20px">Nová objednávka ${order.number}</h1>
    ${linesTable(order)}<p>${address(order)}</p>
    ${order.note ? `<p><strong>Poznámka:</strong> ${esc(order.note)}</p>` : ''}
    <p><a href="${origin}/beheer/bestelling/${order.number}/">Otevřít v administraci</a></p></div>`;
  await Promise.allSettled([
    send(order.email, `Bestelling ${order.number} – ${site.name}`, customer, secret('MAIL_ADMIN') ?? site.email),
    send(secret('MAIL_ADMIN') ?? site.email, `Nová objednávka ${order.number} (${formatCents(order.totalCents)})`, admin, order.email),
  ]);
}

const META_LABELS: Record<string, string> = { groep_grootte: 'Počet osob', datum: 'Termín', soort: 'Typ akce' };

export async function sendContactEmail(msg: Message, origin: string) {
  if (!mailConfigured()) return;
  const meta = Object.entries(msg.meta)
    .map(([k, v]) => `<li><strong>${esc(META_LABELS[k] ?? k)}:</strong> ${esc(v)}</li>`)
    .join('');
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px">
    <h1 style="font-size:20px">Nová zpráva: ${esc(SUBJECTS[msg.subject])}</h1>
    <p><strong>${esc(msg.name)}</strong><br>${esc(msg.email)}${msg.phone ? `<br>${esc(msg.phone)}` : ''}</p>
    ${meta ? `<ul>${meta}</ul>` : ''}
    ${msg.message ? `<p style="white-space:pre-wrap">${esc(msg.message)}</p>` : ''}
    <p><a href="${origin}/beheer/zpravy/">Otevřít v administraci</a></p></div>`;
  await send(secret('MAIL_ADMIN') ?? site.email, `Nová zpráva: ${SUBJECTS[msg.subject]} – ${msg.name}`, html, msg.email);
}
