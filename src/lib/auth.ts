// Přihlášení do administrace: heslo z tajné proměnné ADMIN_PASSWORD, relace v podepsané cookie.
import type { AstroCookies } from 'astro';
import { secret } from './env';

const COOKIE = 'kch_admin';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dní

async function hmac(key: string, data: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const adminConfigured = () => Boolean(secret('ADMIN_PASSWORD'));

export async function isLoggedIn(cookies: AstroCookies): Promise<boolean> {
  const password = secret('ADMIN_PASSWORD');
  const value = cookies.get(COOKIE)?.value;
  if (!password || !value) return false;
  const [exp, sig] = value.split('.');
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, await hmac(password, exp));
}

export async function login(cookies: AstroCookies, attempt: string): Promise<boolean> {
  const password = secret('ADMIN_PASSWORD');
  if (!password) return false;
  // Porovnání přes HMAC, aby délka hesla neovlivnila čas porovnání.
  const ok = safeEqual(await hmac(password, attempt), await hmac(password, password));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800));
    return false;
  }
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  cookies.set(COOKIE, `${exp}.${await hmac(password, exp)}`, {
    path: '/beheer/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: MAX_AGE,
  });
  return true;
}

export function logout(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/beheer/' });
}

/** Přístupový kód pro stránku /podklady/ – odvozený z ADMIN_PASSWORD, takže se nemusí nic dalšího nastavovat.
 *  Změnou hesla do administrace se změní i kód (a starý odkaz přestane fungovat). */
export async function checklistKey(): Promise<string | null> {
  const password = secret('ADMIN_PASSWORD');
  if (!password) return null;
  return (await hmac(password, 'podklady-pro-lindu')).slice(0, 12);
}

export async function checklistKeyValid(key: string | null): Promise<boolean> {
  const expected = await checklistKey();
  return Boolean(expected && key && safeEqual(key, expected));
}
