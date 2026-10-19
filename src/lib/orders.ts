// Objednávky v databázi Cloudflare D1. Tabulka se vytvoří automaticky při prvním použití.
import { db } from './env';
import { shop } from '../config';
import type { OrderInput, OrderLine, PricedOrder } from './shop';

export const STATUSES = {
  nieuw: 'Nová',
  betaald: 'Zaplacená',
  besteld: 'Objednáno u Crussisu',
  verzonden: 'Odesláno / předáno',
  geannuleerd: 'Zrušená',
} as const;
export type Status = keyof typeof STATUSES;
export const isStatus = (s: string): s is Status => s in STATUSES;

export interface Order {
  id: number;
  number: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  name: string;
  email: string;
  phone: string;
  street: string;
  postcode: string;
  city: string;
  shipping: string;
  shippingLabel: string;
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number | null;
  totalCents: number;
  note: string;
  adminNote: string;
}

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  await db()
    .prepare(
      `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number TEXT UNIQUE,
        token TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'nieuw',
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        street TEXT NOT NULL DEFAULT '',
        postcode TEXT NOT NULL DEFAULT '',
        city TEXT NOT NULL DEFAULT '',
        shipping TEXT NOT NULL,
        shipping_label TEXT NOT NULL,
        lines_json TEXT NOT NULL,
        subtotal_cents INTEGER NOT NULL,
        shipping_cents INTEGER,
        total_cents INTEGER NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        admin_note TEXT NOT NULL DEFAULT ''
      )`,
    )
    .run();
  schemaReady = true;
}

type Row = Record<string, unknown>;
function fromRow(r: Row): Order {
  return {
    id: Number(r.id),
    number: String(r.number),
    token: String(r.token),
    createdAt: String(r.created_at),
    updatedAt: String(r.updated_at),
    status: (isStatus(String(r.status)) ? r.status : 'nieuw') as Status,
    name: String(r.name),
    email: String(r.email),
    phone: String(r.phone),
    street: String(r.street),
    postcode: String(r.postcode),
    city: String(r.city),
    shipping: String(r.shipping),
    shippingLabel: String(r.shipping_label),
    lines: JSON.parse(String(r.lines_json)) as OrderLine[],
    subtotalCents: Number(r.subtotal_cents),
    shippingCents: r.shipping_cents === null ? null : Number(r.shipping_cents),
    totalCents: Number(r.total_cents),
    note: String(r.note),
    adminNote: String(r.admin_note),
  };
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function createOrder(input: OrderInput, priced: PricedOrder): Promise<Order> {
  await ensureSchema();
  const now = new Date().toISOString();
  const token = randomToken();
  const inserted = await db()
    .prepare(
      `INSERT INTO orders (token, created_at, updated_at, name, email, phone, street, postcode, city, shipping, shipping_label, lines_json, subtotal_cents, shipping_cents, total_cents, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
    .bind(
      token, now, now, input.name, input.email, input.phone, input.street, input.postcode, input.city,
      input.shipping, priced.shippingLabel, JSON.stringify(priced.lines), priced.subtotalCents, priced.shippingCents, priced.totalCents, input.note,
    )
    .first<{ id: number }>();
  if (!inserted) throw new Error('Objednávku se nepodařilo uložit.');
  const number = `${shop.orderPrefix}-${now.slice(0, 4)}-${String(inserted.id).padStart(4, '0')}`;
  await db().prepare('UPDATE orders SET number = ? WHERE id = ?').bind(number, inserted.id).run();
  return (await getOrder(number))!;
}

export async function getOrder(number: string): Promise<Order | null> {
  await ensureSchema();
  const row = await db().prepare('SELECT * FROM orders WHERE number = ?').bind(number).first<Row>();
  return row ? fromRow(row) : null;
}

export async function listOrders(status?: Status): Promise<Order[]> {
  await ensureSchema();
  const stmt = status
    ? db().prepare('SELECT * FROM orders WHERE status = ? ORDER BY id DESC').bind(status)
    : db().prepare('SELECT * FROM orders ORDER BY id DESC');
  const { results } = await stmt.all<Row>();
  return results.map(fromRow);
}

export async function updateOrder(number: string, changes: { status?: Status; adminNote?: string }) {
  await ensureSchema();
  const order = await getOrder(number);
  if (!order) return null;
  await db()
    .prepare('UPDATE orders SET status = ?, admin_note = ?, updated_at = ? WHERE number = ?')
    .bind(changes.status ?? order.status, changes.adminNote ?? order.adminNote, new Date().toISOString(), number)
    .run();
  return getOrder(number);
}
