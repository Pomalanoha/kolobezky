// Odpovědi k seznamu podkladů (/podklady/) v Cloudflare D1. Tabulka se vytvoří automaticky,
// smaže se tlačítkem v administraci (clearChecklist).
import { db } from './env';

export interface ChecklistEntry {
  done: boolean;
  note: string;
  updatedAt: string;
}

let schemaReady = false;
async function ensureSchema() {
  if (schemaReady) return;
  await db()
    .prepare(
      `CREATE TABLE IF NOT EXISTS checklist (
        id TEXT PRIMARY KEY,
        done INTEGER NOT NULL DEFAULT 0,
        note TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL
      )`,
    )
    .run();
  schemaReady = true;
}

export async function getChecklist(): Promise<Record<string, ChecklistEntry>> {
  await ensureSchema();
  const { results } = await db().prepare('SELECT * FROM checklist').all<Record<string, unknown>>();
  return Object.fromEntries(
    results.map((r) => [String(r.id), { done: Number(r.done) === 1, note: String(r.note ?? ''), updatedAt: String(r.updated_at) }]),
  );
}

export async function saveChecklistItem(id: string, change: { done?: boolean; note?: string }) {
  await ensureSchema();
  const now = new Date().toISOString();
  // Vloží nový řádek, nebo změní jen pole, která přišla
  await db()
    .prepare(
      `INSERT INTO checklist (id, done, note, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         done = COALESCE(?, done),
         note = COALESCE(?, note),
         updated_at = excluded.updated_at`,
    )
    .bind(
      id,
      change.done ? 1 : 0,
      change.note ?? '',
      now,
      change.done === undefined ? null : change.done ? 1 : 0,
      change.note === undefined ? null : change.note,
    )
    .run();
}

export async function clearChecklist() {
  await ensureSchema();
  await db().prepare('DROP TABLE IF EXISTS checklist').run();
  schemaReady = false;
}
