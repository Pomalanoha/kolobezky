// robots.txt: roboti smí procházet jen ostrý web na vlastní doméně (a jen když je zapnutá indexace).
// Náhledy větví a adresa *.workers.dev zakazují procházení všem robotům.
// Neveřejné stránky (administrace, objednávky, API, podklady) jsou zakázané vždy.
import type { APIRoute } from 'astro';
import { site } from '../config';

export const prerender = false;

const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';
const domain = new URL(site.url).hostname;

const production = `User-agent: *
Allow: /
Disallow: /bedankt/
Disallow: /bestelling/
Disallow: /beheer/
Disallow: /api/
Disallow: /cadeaubon/bekijken/
Disallow: /podklady/

Sitemap: ${site.url}/sitemap-index.xml
`;

const preview = `# Ukázková verze – neprocházet, neindexovat
User-agent: *
Disallow: /
`;

export const GET: APIRoute = ({ url }) => {
  const live = indexable && url.hostname.replace(/^www\./, '') === domain;
  return new Response(live ? production : preview, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
