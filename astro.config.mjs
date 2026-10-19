// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://www.kickbikeclubhille.nl',
  trailingSlash: 'always',
  // Stránky jsou statické; jen e-shop (API, potvrzení objednávky, administrace) běží na serveru (prerender = false).
  adapter: cloudflare({
    imageService: 'compile',
  }),
  // Session (KV) nepotřebujeme – administrace má vlastní podepsanou cookie.
  session: false,
  integrations: [
    sitemap({
      filter: (page) => !['/bedankt/', '/beheer/', '/bestelling/', '/bekijken/'].some((p) => page.includes(p)),
    }),
  ],
});
