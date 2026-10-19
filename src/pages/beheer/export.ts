// Export objednávek do CSV (pro účetnictví / Excel). Oddělovač středník kvůli evropskému Excelu.
import type { APIRoute } from 'astro';
import { isLoggedIn } from '../../lib/auth';
import { listOrders, STATUSES } from '../../lib/orders';

export const prerender = false;

const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
const eur = (cents: number | null) => (cents === null ? '' : (cents / 100).toFixed(2).replace('.', ','));

export const GET: APIRoute = async ({ cookies, redirect }) => {
  if (!(await isLoggedIn(cookies))) return redirect('/beheer/', 303);
  const orders = await listOrders();
  const header = ['Číslo', 'Datum', 'Stav', 'Jméno', 'E-mail', 'Telefon', 'Ulice', 'PSČ', 'Město', 'Předání', 'Položky', 'Mezisoučet', 'Doprava', 'Celkem', 'Poznámka zákazníka', 'Interní poznámka'];
  const rows = orders.map((o) => [
    o.number, o.createdAt.slice(0, 10), STATUSES[o.status], o.name, o.email, o.phone, o.street, o.postcode, o.city, o.shippingLabel,
    o.lines.map((l) => `${l.qty}× ${l.title}`).join(' | '), eur(o.subtotalCents), eur(o.shippingCents), eur(o.totalCents), o.note, o.adminNote,
  ]);
  const csv = '﻿' + [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="objednavky-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
