// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// Indexace: ostrý web (build větve main v Cloudflare Workers Builds) se indexuje, náhledy větví ne.
// Ručně jde přebít proměnnou PUBLIC_INDEXABLE=true / false.
if (process.env.PUBLIC_INDEXABLE === undefined && process.env.WORKERS_CI_BRANCH === 'main') {
  process.env.PUBLIC_INDEXABLE = 'true';
}

export default defineConfig({
  site: 'https://kickbikeclubhille.nl',
  trailingSlash: 'always',
  // Stránky jsou statické; jen e-shop (API, potvrzení objednávky, administrace) běží na serveru (prerender = false).
  adapter: cloudflare({
    imageService: 'compile',
  }),
  // Session (KV) nepotřebujeme – administrace má vlastní podepsanou cookie.
  session: false,
  integrations: [
    sitemap({
      filter: (page) => !['/bedankt/', '/beheer/', '/bestelling/', '/bekijken/', '/podklady/'].some((p) => page.includes(p)),
    }),
  ],
});
