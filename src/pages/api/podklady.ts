// Uložení zaškrtnutí / odpovědi k seznamu podkladů. Chráněno přístupovým kódem z odkazu.
import type { APIRoute } from 'astro';
import { checklistKeyValid } from '../../lib/auth';
import { saveChecklistItem } from '../../lib/checklist';
import { CHECKLIST_IDS } from '../../data/podklady';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: { k?: unknown; id?: unknown; done?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: 'Neplatný požadavek.' }, { status: 400 });
  }
  if (!(await checklistKeyValid(typeof body.k === 'string' ? body.k : null))) {
    return Response.json({ ok: false, message: 'Neplatný odkaz – požádej Jana o nový.' }, { status: 403 });
  }
  const id = typeof body.id === 'string' ? body.id : '';
  if (!CHECKLIST_IDS.has(id)) return Response.json({ ok: false, message: 'Neznámá položka.' }, { status: 400 });
  const change: { done?: boolean; note?: string } = {};
  if (typeof body.done === 'boolean') change.done = body.done;
  if (typeof body.note === 'string') change.note = body.note.slice(0, 4000);
  try {
    await saveChecklistItem(id, change);
  } catch (err) {
    console.error('Checklist save failed', err);
    return Response.json({ ok: false, message: 'Uložení se nepovedlo, zkus to znovu.' }, { status: 500 });
  }
  return Response.json({ ok: true, savedAt: new Date().toISOString() });
};
