# Kickbike Club Hille – analýza současného webu a návrh nového

*Stav ke dni 17. 10. 2026 · analyzovaný web: https://www.kickbikeclubhille.nl/*

---

## 1. Shrnutí v kostce

Současný web je postavený na **Webnode** (šablona s e-shopem). Obsahově má dobrý základ – osobní příběh Lindy, jasné cílové skupiny (začátečníci, revalidace, lidé, kterým nesedí posilovna ani běh) a pěkné reference. **Hlavní problémy jsou tři:**

1. **Google neví, kde klub působí.** Město Hoofddorp je zmíněné jen v obchodních podmínkách a GDPR. Na žádné „viditelné“ stránce není lokalita, okolí, trasy ani mapa → web nemá šanci se zobrazit na dotazy typu *„steppen Hoofddorp“*, *„sportstep proefrit Haarlem“*.
2. **Návštěvník neví, co si může objednat a za kolik.** Neexistuje ceník lekcí/zkušební jízdy, žádný rezervační systém, kontakt je jen obecný formulář (bez telefonu/WhatsApp tlačítka u formuláře).
3. **Technicky slabé SEO a důvěryhodnost e-shopu.** Prázdné meta popisy produktů, prázdné `alt` u všech obrázků, duplicitní produkty, zbytky šablony v URL (`/p/diepe-doos/`, `/p/bewegende-boek/` …), překlepy v nadpisech a kategorii, většina zboží „není skladem“.

Konkurence je přitom **velmi malá** – vyhledávání „sportsteppen Hoofddorp / Haarlemmermeer“ nevrací žádného místního poskytovatele. To je obrovská příležitost: s dobře postaveným lokálním SEO + Google profilem firmy může být Kickbike Club Hille v regionu číslo 1 prakticky bez konkurence.

---

## 2. Co na webu je (inventura)

| URL | Název v menu | Obsah | Hodnocení |
|---|---|---|---|
| `/` | Startpagina | Hero „SPORTSTEPPEN met Kickbickeclub Hille!“, „Herken je dit?“ (5 bolestí), 1 CTA | Dobrý text, ale krátký; překlep v H1 (*Kickbick**e**club*), žádná lokalita, žádné reference, žádné ceny |
| `/diensten/` | Sportsteppen | Co je sportsteppen, výhody, pro koho | Dobrý obsah, ale velmi stručný; URL „diensten“ (služby) neodpovídá obsahu |
| `/try-buy/` | Try,Buy&Join | Koncept „vyzkoušej → kup → jezdi s klubem“, 2 kategorie koloběžek s cenou od 329/399 € | **Nejsilnější stránka** (unikátní koncept), ale chybí cena zkušební jízdy a rezervace |
| `/online-winkel/` | Online winkel | 22 produktů (koloběžky + doplňky) | Duplicity (ONE ROAD 4.2-1 ×3), „Helm“ ×3 bez rozlišení, kategorie „Ascessoirres“ (překlep), 3 ze 4 testovaných položek „Niet in voorraad“ |
| `/over-ons/` | Over ons | Míchá info o značce Crussis + příběh Lindy | Příběh je skvělý a autentický – zaslouží si vlastní stránku; info o Crussis patří ke koloběžkám |
| `/getuigenissen/` | **De club** | Reference (R., J., Robin & Jeroen, Kirsten) | Menu říká „klub“, ale obsahem jsou reference → mate uživatele. Klubové jízdy nejsou nikde popsané |
| `/contact/` | Contact | Formulář jméno/e-mail/zpráva | Žádná mapa, oblast, telefon u formuláře, WhatsApp ani výběr „co mě zajímá“ |
| `/algemene-voorwaarden/`, `/privacybeleid/` | patička | Obchodní podmínky, GDPR | OK, obsahově převezmeme |
| `/p/...` | – | 22 produktových detailů | Prázdný `meta description`, žádný popis produktu, jen obrázek + cena |

**Kontaktní údaje:** Linda Pokorná, kickbikeclubhille@gmail.com, 06 47737673, KvK 98484419, sídlo Hoofddorp.

---

## 3. Detailní nálezy

### 3.1 Lokální SEO (nejdůležitější)

| Problém | Dopad |
|---|---|
| Lokalita (Hoofddorp, Haarlemmermeer, duny, Zandvoort…) chybí v nadpisech, title i textech | Google nemůže web spárovat s lokálními dotazy |
| Žádná strukturovaná data (`LocalBusiness`, `SportsActivityLocation`, `Product`, `FAQPage`) | Google hůř chápe, co a kde firma nabízí; produkty bez rozšířených výsledků (cena, dostupnost). Pozn.: FAQ výsledky dnes Google ukazuje jen omezeně, schéma ale pomáhá porozumění obsahu |
| Pravděpodobně neexistuje / není propojený **Google Bedrijfsprofiel** | Firma se neukáže v mapách („steppen bij mij in de buurt“) |
| Žádné vstupní stránky pro místa/trasy | Chybí obsah, který lidé reálně hledají („steppen in de duinen“, „route Haarlemmermeerse Bos“) |
| Recenze jen na webu, ne na Googlu | Lokální ranking silně závisí na Google recenzích |

### 3.2 On-page SEO

- **Title** všech stránek je ve tvaru `Název :: Kickbike club Hille` – bez klíčových slov a lokality.
- **Meta description**: homepage má jen „SPORTSTEPPEN met Kickbickeclub Hille!“ (s překlepem), produkty mají prázdný popis.
- **Nadpisy**: jen 1 H1 na homepage, sekce jsou slabě strukturované, na produktech H2 prázdné.
- **Obrázky**: všech ~40 obrázků má `alt=""` → nulová viditelnost v Google Obrázcích + horší přístupnost.
- **OG obrázek** pro sdílení je fotka z fotobanky Pexels, ne vlastní foto.
- **URL**: `/diensten/` pro „Sportsteppen“, `/getuigenissen/` pro „De club“, šablonové slugy produktů (`/p/diepe-doos/`, `/p/fijne-folder/`, `/p/liter-van-langdurigheid/`, `/p/eenvoudige-encyclopedie/`, `/p/bewegende-boek/`, `/p/helm1/`, `/p/helm2/`).
- **Nejednotný název značky**: „Kickbike club Hille“, „Kickbikeclub Hille“, „Kickbike Club Hille“, „Kickbickeclub“. Pro Google (a entitu firmy) je potřeba jedna forma.
- **Žádný blog / obsah** – web má cca 600 slov unikátního textu. Na témata, která lidé v NL hledají (steppen vs. hardlopen, steppen en knieën, afvallen met steppen, sportstep kiezen), nemá co nabídnout.

### 3.3 UX a konverze

- **Chybí jasná „další akce“**: CTA vede na stránku Try,Buy&Join, ta vede na obecný kontakt. Uživatel neví, co dostane, kolik to stojí a kdy to může být.
- **Žádný ceník služeb** (zkušební jízda, workshop, soukromá lekce, skupinová lekce).
- **Klub není vysvětlený** – kdy se jezdí, kde, pro koho, zda je to zdarma.
- **Menu**: 7 položek + „Meer pagina’s“ a ikona košíku s „0,00 €“ – na mobilu zbytečně složité.
- **E-shop působí neaktivně** (většina „niet in voorraad“, duplicity) → snižuje důvěru.
- **Chybí FAQ** (Musím být fit? Jaký je rozdíl oproti koloběžce pro děti? Půjčíte mi koloběžku? Co si vzít s sebou? Co když prší?).
- **Reference** jsou schované a nejsou použité tam, kde se rozhoduje (homepage, Try,Buy&Join).

### 3.4 Technika a výkon

- Webnode: ~55 kB HTML na stránku + jQuery, 10 stylesheetů, Google Tag Manager, cookie lišta s 4 kategoriemi.
- Nelze ovlivnit HTML, strukturovaná data, rychlost ani přesměrování.
- Fonty a obrázky z CDN Webnode; sitemap obsahuje i šablonové produkty.
- **Cookie lišta**: s analytikou bez cookies (Plausible / Umami / Cloudflare Web Analytics) můžeme lištu úplně vypustit → lepší UX i GDPR (AVG).

### 3.5 Právní stránky (k revizi)

Texty jsou do nového webu převzaté 1:1, ale před spuštěním je doporučuji projít:

- **Privacybeleid** – datum „Laatst bijgewerkt: 11.13.2025“ je neplatné (13. měsíc); pro žádosti uvádí e-mail `info@kickbikeclubhille.nl`, jinde všude `kickbikeclubhille@gmail.com`; zmiňuje Google Analytics – po přechodu na analytiku bez cookies upravit.
- **Algemene voorwaarden** – nedokončené formulace ze šablony: „exclusief (of inclusief) BTW“, „binnen 24 of 48 uur“, „binnen Nederland, gebruikers land“; chybí samostatná stránka o právu na odstoupení (herroepingsrecht) a vzorový formulář, na které se podmínky odkazují.
- Nejednotný název (Kickbike Club Hille vs. Kickbikeclub Hille).

---

## 4. Návrh nového webu

### 4.1 Cíle

1. **Být nalezen** na lokální dotazy v okolí Hoofddorpu / Haarlemmermeer / Haarlemu / pobřeží.
2. **Převést návštěvníka na rezervaci** zkušební jízdy (hlavní konverze) – max. 2 kliknutí z jakékoli stránky.
3. **Budovat důvěru**: Linda jako tvář, reference, jasné ceny, jasný proces.
4. **Prodávat koloběžky přes poradenství** (Try → Buy → Join), ne jako anonymní e-shop.

### 4.2 Technologie

| Oblast | Návrh | Proč |
|---|---|---|
| Framework | **Astro 7** (statický web) | Extrémně rychlé, 0 kB JS tam, kde není potřeba, plná kontrola nad SEO |
| Obsah | Astro **content collections** (Markdown/JSON): produkty, blog, lokality, reference, FAQ | Linda/správce upravuje texty v souborech, žádná databáze |
| Hosting | Netlify / Cloudflare Pages / Vercel (zdarma) | HTTPS, CDN, formuláře, přesměrování |
| Formuláře | Netlify Forms nebo Web3Forms | Bez serveru, notifikace na Gmail |
| Rezervace | **Cal.com** (zdarma, EU) nebo Calendly – vložené na stránku | Uživatel si sám vybere termín zkušební jízdy |
| Platby | **Stripe Payment Links s iDEAL** (příp. Mollie) | iDEAL je v NL nutnost; žádný košík není potřeba, prodej jde přes poradenství |
| Analytika | Plausible / Umami / Cloudflare Web Analytics | Bez cookies → bez cookie lišty |
| Fonty | Self-hosted (@fontsource) | Žádné volání Google Fonts (GDPR) |
| SEO | `@astrojs/sitemap`, JSON-LD, canonical, OG obrázky, `robots.txt`, 301 přesměrování | Kompletní technické SEO |

### 4.3 Nová struktura (sitemap)

Slugy jsou **rovnou holandské** (finální URL), obsah je zatím česky.

```
/                              Úvod (Home)
/sportsteppen/                 Co je sportsteppen – výhody, pro koho, srovnání s během/kolem
/proefrit-en-lessen/           Zkušební jízda & lekce – nabídka, ceny, rezervace  ← hlavní konverze
/sportsteps/                   Koloběžky – přehled modelů Crussis + „který je pro mě?“
/sportsteps/[model]/           Detail modelu (popis, pro koho, parametry, cena, CTA)
/accessoires/                  Doplňky
/club/                         Klub – klubové jízdy, pro koho, jak se přidat
/ervaringen/                   Reference
/routes/                       Kde jezdíme – přehled lokalit
/routes/[lokalita]/            Lokální vstupní stránky (Hoofddorp, Spaarnwoude, Kennemerduinen…)
/blog/  /blog/[článek]/        Tipy & články (SEO obsah)
/over-linda/                   O mně – příběh Lindy, kvalifikace
/veelgestelde-vragen/          Časté dotazy (FAQPage schema)
/contact/                      Kontakt – formulář s výběrem zájmu, WhatsApp, telefon, oblast
/algemene-voorwaarden/  /privacybeleid/
```

**Hlavní menu (6 položek):** Sportsteppen · Proefrit & lessen · Sportsteps · Club · Over Linda · Contact + výrazné tlačítko **„Boek een proefrit“**.

### 4.4 Uživatelská cesta

```
Google („steppen Hoofddorp“, „sportstep proberen“)
   → Úvod / lokální stránka / blog
      → „Boek een proefrit“ (sticky tlačítko + WhatsApp)
         → /proefrit-en-lessen/ (ceny, co čekat, rezervace)
            → zkušební jízda s Lindou
               → nákup koloběžky s poradenstvím → klubové jízdy zdarma
                  → Google recenze → lepší pozice na Googlu
```

### 4.5 Klíčová slova (NL) – návrh

> Objemy hledání je potřeba ověřit v Google Keyword Planneru / Search Console po spuštění. Jde o odborný odhad podle toho, jak Holanďané o tématu mluví.

| Záměr | Klíčová slova (NL) | Cílová stránka |
|---|---|---|
| Lokální | steppen Hoofddorp, sportsteppen Haarlemmermeer, steppen Haarlem, steppen in de duinen, step workshop Noord-Holland | Úvod, `/routes/*` |
| Vyzkoušet | sportstep proberen, proefrit sportstep, steppen les, step clinic, steppen leren | `/proefrit-en-lessen/` |
| Koupit | sportstep kopen, Crussis step, kickbike kopen, step voor volwassenen, sportstep met grote wielen | `/sportsteps/*` |
| Zdraví | steppen voor knieën, steppen na blessure, revalidatie steppen, steppen afvallen, gewrichtsvriendelijk sporten | `/sportsteppen/`, blog |
| Info | wat is sportsteppen, steppen vs hardlopen, steppen als training, footbike | `/sportsteppen/`, blog |

Pozor: **„Kickbike“ je ochranná známka** finského výrobce (koloběžky Kickbike). Klub prodává Crussis. V textech proto používat hlavně obecné výrazy **„sportstep“ / „sportsteppen“**, „kickbike“ jen jako doplňkový výraz (lidé ho hledají) – a název klubu ponechat.

### 4.6 Lokální SEO – mimo web (stejně důležité jako web)

1. **Google Bedrijfsprofiel** – kategorie „Sportschool“/„Personal trainer“ + „Sportwinkel“, servisní oblast (Hoofddorp, Haarlem, Nieuw-Vennep, Badhoevedorp, Zandvoort, Heemstede), fotky, odkaz na `/proefrit-en-lessen/`.
2. **Požádat každého klienta o Google recenzi** (QR kód / odkaz po jízdě).
3. **Jednotné NAP** (název, adresa/oblast, telefon) na webu, Googlu, Facebooku, Instagramu, Strava klubu.
4. Zápisy v lokálních katalozích: Haarlemmermeer sportplatformy (Sportservice Haarlemmermeer), *fijnuit.nl*, *dagjeweg.nl*, *uitinhaarlemmermeer*, Nederlandse Stepbond / stepvereniging.
5. **Spolupráce s fyzioterapeuty** v okolí (revalidace je silné téma) – zpětné odkazy + doporučení.
6. Instagram/Facebook: krátká videa z jízd v dunách – sdílet na web (blog/trasy).

### 4.7 Design

- **Pocit:** venku, čerstvý vzduch, energie, ale přístupné pro začátečníky a starší (žádný „hardcore sport“ look).
- **Barvy:** tmavě lesní zelená (důvěra, příroda) · písková (duny) · energická oranžová (CTA).
- **Typografie:** Bricolage Grotesque (nadpisy, charakter) + Inter (čitelný text), velké písmo, vysoký kontrast.
- **Fotky:** vlastní fotky z jízd (Linda + klienti, duny, les) – **žádné fotobanky**. Do web stránek jsou připravené pozice s popiskem, jaká fotka tam patří.
- **Mobil první:** sticky lišta „Boek een proefrit“ + WhatsApp na mobilu.
- **Přístupnost:** kontrast WCAG AA, `alt` texty, ovladatelné klávesnicí.

### 4.8 Přesměrování starých URL (301)

| Stará URL | Nová URL |
|---|---|
| `/diensten/` | `/sportsteppen/` |
| `/try-buy/` | `/proefrit-en-lessen/` |
| `/online-winkel/` | `/sportsteps/` |
| `/over-ons/` | `/over-linda/` |
| `/getuigenissen/` | `/ervaringen/` |
| `/cart/` | `/sportsteps/` |
| `/p/road-4-2-1/`, `/p/road-4-2-2/` | `/sportsteps/crussis-road-4-2/` |
| `/p/cobra-sport-4-2-3/`, `/p/cobra-sport-4-2-31/` | `/sportsteps/crussis-cobra-sport-4-2/` |
| `/p/cobra-one-4-2-4/`, `/p/eenvoudige-encyclopedie/` | `/sportsteps/crussis-one-cobra-4-2/` |
| `/p/one-road-4-2-1/`, `/p/liter-van-langdurigheid/`, `/p/diepe-doos/` | `/sportsteps/crussis-one-road-4-2/` |
| `/p/one-cross-9-2-1/` | `/sportsteps/crussis-one-cross-9-2/` |
| `/p/bewegende-boek/`, `/p/fijne-folder/` | `/sportsteps/crussis-cross-6-2/` |
| ostatní `/p/*` (doplňky) | `/accessoires/` |

Soubor s přesměrováním je v projektu připraven (`public/_redirects`).

---

## 5. Co je potřeba od Lindy (podklady)

- [ ] **Fotky**: ze současného webu je převzato logo, 1 portrét Lindy, 2 fotky z jízd, 1 detail koloběžky a produktové fotky Crussis. Chybí: Linda na koloběžce, skupinová jízda, detail techniky, lokality (duny, les, park), každá koloběžka z boku. Ideálně 15–25 fotek.
- [ ] **Ceny služeb**: zkušební jízda, workshop, soukromá lekce, skupinová lekce, balíčky.
- [ ] **Kde se jezdí**: konkrétní místa srazu a trasy (v návrhu jsou odhady – Haarlemmermeerse Bos, Spaarnwoude, Kennemerduinen/Zandvoort – **ověřit**).
- [ ] **Klubové jízdy**: jak často, kdy, pro koho, jak se přihlásit.
- [ ] **Kvalifikace**: přesný název kurzu sportsteppen (kde, kdy), holistický lifestyle & výživa.
- [ ] **Sklad**: které modely jsou reálně k dispozici / na objednávku, dodací lhůta, zapůjčení koloběžek na zkušební jízdu.
- [ ] **Sociální sítě**: Instagram, Facebook, Strava?
- [ ] Souhlas klientů s použitím referencí (celé jméno / iniciály / foto) – včetně osob na fotkách z dun a z klubové jízdy, které jsou teď na úvodní stránce a stránce Klub.
- [ ] Ověřit práva k produktovým fotkám Crussis (běžně je výrobce dovoluje prodejcům).
- [ ] Rozhodnutí: rezervace přes Cal.com, nebo jen formulář? Platby přes Stripe (iDEAL), nebo jen poptávka?

---

## 6. Postup (fáze)

1. **Fáze 1 – Návrh v češtině** (hotovo v tomto projektu): struktura, design, komponenty, texty CZ, SEO základ.
2. **Fáze 2 – Podklady**: fotky, ceny, lokality, doladění textů s Lindou.
3. **Fáze 3 – Překlad do NL**: přeložit obsah (`src/content/*`, stránky, `src/i18n/ui.ts`), přepnout `lang` na `nl` v `src/config.ts`, finální SEO texty (title/description) psát přímo holandsky s klíčovými slovy.
4. **Fáze 4 – Spuštění**: hosting, přepojení domény z Webnode (DNS), přesměrování, Google Search Console + odeslání sitemap, Google Bedrijfsprofiel.
5. **Fáze 5 – Růst**: 1–2 blogové články měsíčně, sběr Google recenzí, sledování Search Console.
