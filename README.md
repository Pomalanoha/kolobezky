# Kickbike Club Hille – nový web (Astro)

Nový web pro [kickbikeclubhille.nl](https://www.kickbikeclubhille.nl/). Web je **v holandštině** (`lang: 'nl'` v `src/config.ts`); administrace `/beheer/` a upozornění pro Lindu zůstávají česky.

Analýza současného webu a celý návrh: [docs/ANALYZA-A-NAVRH.md](docs/ANALYZA-A-NAVRH.md)

## Spuštění

```bash
npm install
```

```bash
npm run dev
```

Web běží na http://localhost:4321. Pro test e-shopu a administrace vytvoř soubor `.dev.vars` s řádkem `ADMIN_PASSWORD=nějaké-heslo` (soubor se necommituje). Lokální databáze objednávek je ve složce `.wrangler/`. Ve vývojovém režimu se zobrazují **žluté poznámky „Doplnit / ověřit s Lindou“** a popisky u zástupných fotek – v produkčním buildu (`npm run build`) se nevykreslí.

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
- **Ceny a dostupnost v e-shopu:** u koloběžky `price`, `variants` a `availability` (`op-voorraad` skladem / `op-bestelling` na objednávku / `uitverkocht` vyprodáno – nelze objednat). U doplňků `price` a `available: false` pro dočasné vypnutí.
- **Sociální sítě:** `social` v `src/config.ts` (propíše se i do strukturovaných dat).
- **OG obrázek:** `public/og-default.jpg` (1200×630, zatím výřez fotky z dun). Favicony `public/favicon.png` a `apple-touch-icon.png` jsou vygenerované z loga klubu.

## Překlad do NL (fáze 3)

1. `src/config.ts` → `lang: 'nl'`.
2. Přeložit obsah v `src/content/*`, `src/data/*` (u referencí použít pole `original`) a texty přímo v `src/pages/*.astro`.
3. Title a meta description psát rovnou holandsky s klíčovými slovy (viz analýza, kap. 4.5).
4. Přeložit hodnoty `level`, `place` v lokalitách a štítky kategorií v `ProductCard.astro` / `[slug].astro`.

## E-shop

Jednoduchý objednávkový e-shop bez košíku: zákazník vybere koloběžku a doplňky, vyplní adresu a zaplatí převodem.

| Co | Kde |
|---|---|
| Objednávkový formulář | `/bestellen/` (tlačítko „Objednat“ u koloběžek a doplňků předvybere položku) |
| Potvrzení objednávky | `/bestelling/?nr=…&t=…` (číslo objednávky + tajný token) |
| Administrace | `/beheer/` – seznam objednávek, filtr podle stavu, detail, změna stavu, interní poznámka, export CSV |
| Nastavení (IBAN, doprava, dodací lhůta) | `src/config.ts` → `shop` |
| Logika | `src/lib/shop.ts` (ceny – vždy se počítají na serveru), `src/lib/orders.ts` (databáze), `src/lib/auth.ts`, `src/lib/mail.ts` |

Stavy objednávky: Nová → Zaplacená → Objednáno u Crussisu → Odesláno / předáno (nebo Zrušená).

**Nastavení v Cloudflare (jednou):**

1. **Databáze:** vytvoří se sama při prvním nasazení (D1 `kolobezky-objednavky`, tabulka se založí při první objednávce).
2. **Heslo do administrace:** Workers & Pages → `kolobezky` → Settings → Variables and Secrets → Add → typ *Secret*, název `ADMIN_PASSWORD`, hodnota = silné heslo. Bez něj je administrace vypnutá.
3. **E-maily (volitelné, až bude doména):** účet na [resend.com](https://resend.com), ověřit doménu, pak secrets `RESEND_API_KEY`, `MAIL_FROM` (např. `Kickbike Club Hille <objednavky@kickbikeclubhille.nl>`) a případně `MAIL_ADMIN` (komu chodí upozornění, výchozí je Gmail z `config.ts`). Bez nich se objednávky jen ukládají a jsou vidět v administraci.

**Před ostrým prodejem doplnit:** IBAN, cenu dopravy, úplnou adresu firmy, btw-nummer, právo na odstoupení + vzorový formulář v obchodních podmínkách; v NL verzi musí tlačítko znít „Bestelling plaatsen met betaalverplichting“.

### Další funkce

| Funkce | Stránka | Kde ji Linda spravuje |
|---|---|---|
| Kontaktní formulář | `/contact/` → `/api/contact/` | Administrace → **Zprávy** (stav Nová / Vyřízená, interní poznámka) |
| Poptávka skupin | `/groepen/` (firemní akce, rozlučky, oslavy) | Administrace → **Zprávy** (počet osob, termín, typ akce) |
| Dárkový poukaz | `/cadeaubon/` → `/api/cadeaubon/` | Administrace → **Objednávky**: po označení „Zaplacená“ poslat kupujícímu odkaz na poukaz k tisku (`/cadeaubon/bekijken/…`, kód se ukáže až po zaplacení) |
| Kvíz „Která koloběžka je pro mě?“ | `/welke-step/` | – (výsledky se berou z koloběžek v `src/content/products`) |

Hodnoty a platnost poukazů: `src/config.ts` → `voucher`.

## Nasazení

Astro s adaptérem pro Cloudflare Workers (`npm run build` → `dist/client` statické stránky + `dist/server` pro e-shop), Node 22.22+ (`.node-version` = 24). Po změně `wrangler.jsonc` spusť `npm run types`.

**Ukázková verze (zdarma, bez vlastní domény):**

- **Cloudflare Workers:** Workers & Pages → Create → Import a repository → `kolobezky`; build `npm run build`, deploy `npx wrangler deploy` (nastavení je v `wrangler.jsonc`). Adresa: `kolobezky.<účet>.workers.dev`.

Ukázková verze zakazuje v `robots.txt` procházení všem robotům (vyhledávače i AI crawlery) a každá stránka má `noindex, nofollow`, aby nekonkurovala současnému webu. Řídí to `src/pages/robots.txt.ts`.

**Ostrý provoz (s doménou):**

- proměnná prostředí `PUBLIC_INDEXABLE=true` (zruší `noindex` a povolí roboty v `robots.txt`; v Cloudflare jako *build* proměnná),
- `public/_redirects` zajistí 301 přesměrování starých URL z Webnode (Cloudflare je u statických souborů podporuje),
- po spuštění: Google Search Console → odeslat `sitemap-index.xml`.
