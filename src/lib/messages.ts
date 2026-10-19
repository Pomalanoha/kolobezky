// Zprávy z kontaktního formuláře a poptávky skupin (Cloudflare D1). Tabulka se vytvoří automaticky.
import { db } from './env';

import { SUBJECTS, isSubject, type Subject } from './subjects';
export { SUBJECTS, isSubject, type Subject };

export const MESSAGE_STATUSES = { nova: 'Nová', vyrizena: 'Vyřízená' } as const;
export type MessageStatus = keyof typeof MESSAGE_STATUSES;

export interface Message {
  id: number;
  createdAt: string;
  status: MessageStatus;
  subject: Subject;
  name: string;
  email: string;
  phone: string;
  message: string;
  meta: Record<string, string>;
  adminNote: string;
}

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  await db()
    .prepare(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'nova',
        subject TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL DEFAULT '',
        message TEXT NOT NULL DEFAULT '',
        meta_json TEXT NOT NULL DEFAULT '{}',
        admin_note TEXT NOT NULL DEFAULT ''
      )`,
    )
    .run();
  schemaReady = true;
}

type Row = Record<string, unknown>;
const fromRow = (r: Row): Message => ({
  id: Number(r.id),
  createdAt: String(r.created_at),
  status: r.status === 'vyrizena' ? 'vyrizena' : 'nova',
  subject: isSubject(String(r.subject)) ? (String(r.subject) as Subject) : 'anders',
  name: String(r.name),
  email: String(r.email),
  phone: String(r.phone),
  message: String(r.message),
  meta: JSON.parse(String(r.meta_json || '{}')) as Record<string, string>,
  adminNote: String(r.admin_note),
});

export async function createMessage(m: Omit<Message, 'id' | 'createdAt' | 'status' | 'adminNote'>): Promise<Message> {
  await ensureSchema();
  const now = new Date().toISOString();
  const row = await db()
    .prepare(
      `INSERT INTO messages (created_at, updated_at, subject, name, email, phone, message, meta_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    )
    .bind(now, now, m.subject, m.name, m.email, m.phone, m.message, JSON.stringify(m.meta))
    .first<Row>();
  if (!row) throw new Error('Zprávu se nepodařilo uložit.');
  return fromRow(row);
}

export async function listMessages(status?: MessageStatus): Promise<Message[]> {
  await ensureSchema();
  const stmt = status
    ? db().prepare('SELECT * FROM messages WHERE status = ? ORDER BY id DESC').bind(status)
    : db().prepare('SELECT * FROM messages ORDER BY id DESC');
  const { results } = await stmt.all<Row>();
  return results.map(fromRow);
}

export async function countNewMessages(): Promise<number> {
  await ensureSchema();
  const row = await db().prepare("SELECT COUNT(*) AS n FROM messages WHERE status = 'nova'").first<{ n: number }>();
  return Number(row?.n ?? 0);
}

export async function updateMessage(id: number, changes: { status?: MessageStatus; adminNote?: string }) {
  await ensureSchema();
  const row = await db().prepare('SELECT * FROM messages WHERE id = ?').bind(id).first<Row>();
  if (!row) return null;
  const current = fromRow(row);
  await db()
    .prepare('UPDATE messages SET status = ?, admin_note = ?, updated_at = ? WHERE id = ?')
    .bind(changes.status ?? current.status, changes.adminNote ?? current.adminNote, new Date().toISOString(), id)
    .run();
  return true;
}
