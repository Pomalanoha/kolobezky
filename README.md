# Kickbike Club Hille – nový web (Astro)

Nový web pro [kickbikeclubhille.nl](https://www.kickbikeclubhille.nl/). Zatím **v češtině** (pracovní verze), finálně bude v **holandštině**.

Analýza současného webu a celý návrh: [docs/ANALYZA-A-NAVRH.md](docs/ANALYZA-A-NAVRH.md)

## Spuštění

```bash
npm install
```

```bash
npm run dev
```

Web běží na http://localhost:4321. Ve vývojovém režimu se zobrazují **žluté poznámky „Doplnit / ověřit s Lindou“** a popisky u zástupných fotek – v produkčním buildu (`npm run build`) se nevykreslí.

## Struktura

```
src/
  config.ts              Kontakty, oblast působení, jazyk (lang), odkaz na rezervace
  i18n/ui.ts             Texty rozhraní (menu, tlačítka) – cs + nl
  content.config.ts      Schémata obsahu
  content/
    products/            Koloběžky (1 soubor = 1 model, cena, varianty, text)
    blog/                Články
    locations/           Lokální stránky „Kde jezdíme“
    legal/               Obchodní podmínky a GDPR (NL originál)
  data/
    testimonials.json    Reference (text CZ + původní NL)
    faq.json             Časté dotazy
    accessories.json     Doplňky
  pages/                 Stránky (URL jsou rovnou holandské)
  components/            Komponenty (Header, Footer, Photo, ProductCard…)
public/
  _redirects             301 přesměrování ze starého webu (Netlify / Cloudflare Pages)
  robots.txt
```

## Jak doplnit obsah

- **Fotky:** současné fotky (převzaté ze starého webu) jsou v `src/assets/` – `brand/` (logo), `photos/` (Linda, duny, klubová jízda, detail koloběžky), `products/` a `accessories/` (produktové fotky Crussis). Nové fotky vložit do `src/assets/…` a v příslušném souboru obsahu přidat `image: ../../assets/nazev.jpg`. U stránek předat `src={…}` komponentě `<Photo>`. Dokud fotka chybí, zobrazí se barevný zástupný blok.
- **Ceny lekcí:** `src/pages/proefrit-en-lessen.astro` → pole `offers` (`price`).
- **Rezervační systém (Cal.com / Calendly):** vyplnit `bookingUrl` v `src/config.ts` – všechna tlačítka „Rezervovat“ se přepnou automaticky.
- **Online platba (iDEAL):** u koloběžky vyplnit `paymentLink` (Stripe Payment Link / Mollie). Bez něj se zobrazí tlačítko „Poptat tento model“.
- **Sociální sítě:** `social` v `src/config.ts` (propíše se i do strukturovaných dat).
- **OG obrázek:** `public/og-default.jpg` (1200×630, zatím výřez fotky z dun). Favicony `public/favicon.png` a `apple-touch-icon.png` jsou vygenerované z loga klubu.

## Překlad do NL (fáze 3)

1. `src/config.ts` → `lang: 'nl'`.
2. Přeložit obsah v `src/content/*`, `src/data/*` (u referencí použít pole `original`) a texty přímo v `src/pages/*.astro`.
3. Title a meta description psát rovnou holandsky s klíčovými slovy (viz analýza, kap. 4.5).
4. Přeložit hodnoty `level`, `place` v lokalitách a štítky kategorií v `ProductCard.astro` / `[slug].astro`.

## Nasazení

Statický web (`npm run build` → `dist/`), Node 22.22+ (`.node-version` = 24).

**Ukázková verze (zdarma, bez vlastní domény):**

- **Vercel:** Add New → Project → importovat repozitář `kolobezky` → framework Astro se rozpozná sám → Deploy. Adresa: `kolobezky.vercel.app` (nebo podobná).
- **Cloudflare Workers:** Workers & Pages → Create → Import a repository → `kolobezky`; build `npm run build`, deploy `npx wrangler deploy` (nastavení je v `wrangler.jsonc`). Adresa: `kolobezky.<účet>.workers.dev`.

Ukázková verze má `noindex`, aby ji Google neindexoval (nekonkurovala současnému webu). Kontaktní formulář je připravený pro Netlify Forms – na Vercelu/Cloudflare zatím neodešle (pro ostrý provoz přepnout např. na Web3Forms).

**Ostrý provoz (s doménou):**

- proměnná prostředí `PUBLIC_INDEXABLE=true` (zruší `noindex`),
- `public/_redirects` zajistí 301 přesměrování starých URL z Webnode (funguje na Netlify a Cloudflare Pages; na Vercelu je potřeba `vercel.json`),
- po spuštění: Google Search Console → odeslat `sitemap-index.xml`.
