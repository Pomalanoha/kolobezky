import { env } from 'cloudflare:workers';

/** Volitelné tajné proměnné (Cloudflare → Worker → Settings → Variables and Secrets, lokálně .dev.vars). */
export function secret(name: 'ADMIN_PASSWORD' | 'RESEND_API_KEY' | 'MAIL_FROM' | 'MAIL_ADMIN'): string | undefined {
  const value = (env as unknown as Record<string, unknown>)[name];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const db = () => env.DB;
