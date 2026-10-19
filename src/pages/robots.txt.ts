// robots.txt: ukázková verze zakazuje procházení všem robotům (vyhledávače, AI crawlery).
// Na ostrém webu nastavit PUBLIC_INDEXABLE=true – pak se povolí vše kromě e-shopu a administrace.
import type { APIRoute } from 'astro';

const indexable = import.meta.env.PUBLIC_INDEXABLE === 'true';

const production = `User-agent: *
Allow: /
Disallow: /bedankt/
Disallow: /bestelling/
Disallow: /beheer/
Disallow: /api/
Disallow: /cadeaubon/bekijken/
Disallow: /podklady/

Sitemap: https://www.kickbikeclubhille.nl/sitemap-index.xml
`;

const preview = `# Ukázková verze – neprocházet, neindexovat
User-agent: *
Disallow: /
`;

export const GET: APIRoute = () =>
  new Response(indexable ? production : preview, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
