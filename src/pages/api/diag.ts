// DOČASNÉ: diagnostika přístupu k databázi na náhledu. Po vyřešení smazat.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const GET: APIRoute = async () => {
  const bindings = Object.keys(env as object).filter((k) => !/PASSWORD|KEY|MAIL/i.test(k));
  const out: Record<string, unknown> = { bindings, dbType: typeof (env as { DB?: unknown }).DB };
  try {
    out.select1 = await env.DB.prepare('SELECT 1 AS ok').first();
    out.tables = (await env.DB.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all()).results;
  } catch (err) {
    out.error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  }
  return Response.json(out, { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
};
