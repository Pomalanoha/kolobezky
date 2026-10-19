// Seznam podkladů a kontrol pro Lindu (stránka /podklady/). Stav odpovědí je v databázi (tabulka checklist).
// Odkazy v kontrolní části vedou na holandský náhled webu.
export const CHECKLIST_PREVIEW = 'https://dev-nl-kolobezky.vesely-naj.workers.dev';

export interface ChecklistItem {
  id: string;
  title: string;
  why: string;
  link?: string;
  must?: boolean;
}
export interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}
export interface ChecklistPart {
  id: string;
  title: string;
  text: string;
  groups: ChecklistGroup[];
}

export const PARTS: ChecklistPart[] = [
  {
    id: 'podklady',
    title: 'Podklady k dodání',
    text: 'Údaje a materiály, které na webu zatím chybí nebo jsou jen odhadem.',
    groups: [
      { title: 'Firma a platby', items: [
        { id: 'adresa', title: 'Úplná adresa firmy (ulice, PSČ, město)', why: 'Nizozemský zákon vyžaduje u e-shopu fyzickou adresu. Stačí adresa sídla z KvK.', must: true },
        { id: 'btw', title: 'BTW-nummer, případně informace, že jsi v režimu KOR', why: 'Patří do patičky a do obchodních podmínek.', must: true },
        { id: 'iban', title: 'IBAN a jméno majitele účtu', why: 'Zákazník ho uvidí hned po objednávce, aby mohl zaplatit převodem.', must: true },
        { id: 'email', title: 'Který e-mail má být hlavní?', why: 'Na webu je kickbikeclubhille@gmail.com, v zásadách ochrany údajů info@kickbikeclubhille.nl. Měl by zůstat jeden.' },
      ]},
      { title: 'Ceny a nabídka', items: [
        { id: 'ceny-lekce', title: 'Ceny lekcí: proefrit, workshop a privéles', why: 'Napiš i délku a co přesně zahrnují. Teď je tam „prijs op aanvraag“.', link: '/proefrit-en-lessen/', must: true },
        { id: 'skupiny', title: 'Skupinové akce: cena, maximální počet lidí, helmy', why: 'Kolik koloběžek a helem můžeš zapůjčit najednou?', link: '/groepen/' },
        { id: 'doprava', title: 'Cena dopravy po Nizozemsku', why: 'Případně od jaké částky je doprava zdarma. Teď se cena zákazníkovi potvrzuje e-mailem.', link: '/bestellen/', must: true },
        { id: 'dodani', title: 'Dodací lhůta: platí „binnen ca. 10 werkdagen“?', why: 'Uvádí se u koloběžek, v objednávce i v e-mailu.' },
        { id: 'poukaz', title: 'Dárkový poukaz: platnost 2 roky, uplatnění i na nákup?', why: 'Chceš poukazy posílat i poštou, nebo stačí e-mailem k vytištění?', link: '/cadeaubon/' },
        { id: 'rezervace', title: 'Online rezervace, nebo stačí formulář a WhatsApp?', why: 'Můžeme přidat kalendář s volnými termíny (Cal.com, zdarma).' },
      ]},
      { title: 'Fotky a video', items: [
        { id: 'foto-linda', title: '5–10 fotek tebe v pohybu na koloběžce', why: 'Ideálně světlé, venku, na výšku i na šířku. Teď je na webu jedna tvoje fotka.' },
        { id: 'foto-mista', title: 'Fotky z míst: Haarlemmermeerse Bos, Spaarnwoude, duny a pláž', why: 'Ke stránkám tras a do mapy na úvodní stránce.', link: '/routes/' },
        { id: 'foto-lekce', title: 'Fotky z lekce nebo workshopu', why: 'Vysvětlování techniky, skupina, pauza na pláži. Jen se souhlasem lidí na fotce.' },
        { id: 'video', title: 'Krátké video 5–10 s (nepovinné)', why: 'Pro úvodní stránku. Stačí z mobilu, bez zvuku.' },
        { id: 'foto-steps', title: 'Vlastní fotky koloběžek (nepovinné)', why: 'Teď jsou na webu produktové fotky od Crussisu.' },
      ]},
      { title: 'Trasy a klub', items: [
        { id: 'sraz', title: 'Kde se s klienty scházíš (místa srazu)', why: 'Na webu je teď jen „domluvíme individuálně“.', link: '/contact/' },
        { id: 'trasy', title: 'Ověřit 3 trasy: délka, povrch, úroveň', why: 'Popisy tras jsou můj odhad. Pokud máš trasy v Komootu nebo Stravě, pošli odkazy.', link: '/routes/' },
        { id: 'klub', title: 'Jak funguje klub: jak často, kdy, kde a jak se přihlásit', why: 'Máš WhatsApp skupinu? Mohou se přidat i lidé, kteří koloběžku koupili jinde?', link: '/club/' },
      ]},
      { title: 'O tobě a sortimentu', items: [
        { id: 'kurz', title: 'Přesný název kurzu sportsteppen a další certifikáty', why: 'Kde a kdy jsi kurz dělala, případně EHBO (první pomoc) a podobně.', link: '/over-linda/' },
        { id: 'sklad', title: 'Které modely máš skladem, na objednávku, nebo jsou vyprodané', why: 'Vyprodaný model se na webu nedá objednat.', link: '/sportsteps/' },
        { id: 'one', title: 'Čím se liší řada ONE od základních modelů (Road, Cobra)', why: 'U modelů ONE teď chybí konkrétní rozdíly a parametry.' },
        { id: 'zapujcka', title: 'Kolik koloběžek a helem máš na zapůjčení', why: 'Web slibuje, že na lekci koloběžku zapůjčíš.' },
        { id: 'doplnky', title: 'Doplňky: barva košíku na láhev, velikosti helem a rukavic', why: 'Košík je v popisu černý, ale na fotce bílý. Helmy jsou jen ve velikosti L.', link: '/accessoires/' },
      ]},
      { title: 'Souhlasy a online', items: [
        { id: 'reference', title: 'Souhlas Kirsten, Robina a Jeroena s jejich referencí', why: 'Stačí křestní jméno, nebo raději iniciály?', link: '/ervaringen/', must: true },
        { id: 'foto-souhlas', title: 'Souhlas lidí na fotkách', why: 'Paní v dunách a lidé na selfie ze společné jízdy jsou na úvodní stránce.', must: true },
        { id: 'crussis', title: 'Smíš používat produktové fotky Crussis?', why: 'Výrobci to prodejcům obvykle dovolují, ale je dobré to vědět jistě.' },
        { id: 'socialni', title: 'Odkazy na Instagram, Facebook, Stravu', why: 'Propojíme je s webem a s profilem na Googlu.' },
        { id: 'domena', title: 'Přístup k doméně kickbikeclubhille.nl (Webnode)', why: 'Kvůli přepojení domény na nový web.', must: true },
        { id: 'google', title: 'Google Bedrijfsprofiel: máš ho?', why: 'Pro hledání v okolí je to nejdůležitější. Když ho nemáš, založíme ho.' },
      ]},
    ],
  },
  {
    id: 'kontrola',
    title: 'Zkontroluj na webu',
    text: 'Projdi holandské texty v náhledu a napiš, co upravit. Odkaz vede vždy na danou stránku.',
    groups: [
      { title: 'Obecně', items: [
        { id: 'k-ton', title: 'Projdi texty: zní to jako ty?', why: 'Píšu „je/jij“ a v první osobě, jako na tvém původním webu.', link: '/' },
        { id: 'k-nadpis', title: 'Hlavní nadpis „Step jezelf fit in de buitenlucht“', why: 'Líbí se ti, nebo chceš jiný?', link: '/' },
      ]},
      { title: 'Stránky', items: [
        { id: 'k-sportsteppen', title: 'Sportsteppen: zdravotní tvrzení', why: 'Šetrnost ke kloubům, revalidace, hubnutí. Jsi s formulacemi v pohodě?', link: '/sportsteppen/' },
        { id: 'k-lessen', title: 'Proefrit & lessen: nabídka a průběh první lekce', why: 'Proefrit cca 60 min, workshop 2–3 h, privéles. Sedí to, co je v seznamech?', link: '/proefrit-en-lessen/' },
        { id: 'k-faq', title: 'Veelgestelde vragen: odpovědi', why: 'Hlavně storno zdarma 1 den předem, přesun při bouřce, helma a zapůjčení koloběžky.', link: '/veelgestelde-vragen/' },
        { id: 'k-linda', title: 'Over Linda: tvůj příběh', why: 'Text vychází z tvého původního webu, jen jsem ho trochu učesal.', link: '/over-linda/' },
        { id: 'k-club', title: 'Club: popis klubu', why: 'Hlavně to, že clubritten jsou pro zákazníky zdarma.', link: '/club/' },
        { id: 'k-steps', title: 'Sportsteps: popisy modelů a ceny', why: 'Road od 329 €, ONE Road, Cobra a ONE Cobra 399 €, Cross 649 €, ONE Cross 869 €.', link: '/sportsteps/' },
        { id: 'k-groepen', title: 'Groepsuitjes: program pro skupiny', why: 'Délka 2–3 h a průběh jsou návrh.', link: '/groepen/' },
        { id: 'k-cadeaubon', title: 'Cadeaubon: hodnoty a texty', why: '25, 50, 75, 100 € nebo vlastní částka 20–500 €.', link: '/cadeaubon/' },
        { id: 'k-blog', title: 'Blog: 3 články', why: 'Steppen vs. hardlopen, výběr koloběžky a první jízda.', link: '/blog/' },
      ]},
      { title: 'Vyzkoušej e-shop a administraci', items: [
        { id: 'k-objednavka', title: 'Udělej testovací objednávku', why: 'Projdi formulář i potvrzení. Pak ji v administraci označ jako „Zrušená“.', link: '/bestellen/' },
        { id: 'k-kontakt', title: 'Pošli testovací zprávu přes kontaktní formulář', why: 'Měla by se objevit v administraci v záložce Zprávy.', link: '/contact/' },
        { id: 'k-beheer', title: 'Přihlas se do administrace na /beheer/', why: 'Heslo ti dá Jan. Administrace je česky, je jen pro tebe.', link: '/beheer/' },
      ]},
      { title: 'Právní texty', items: [
        { id: 'k-privacy', title: 'Privacybeleid: opravit chyby', why: 'Datum „11.13.2025“ neexistuje, je tam e-mail info@, který jinde nepoužíváš, a zmínka o Google Analytics, který nový web nepoužívá.', link: '/privacybeleid/', must: true },
        { id: 'k-voorwaarden', title: 'Algemene voorwaarden: dokončit a doplnit', why: 'Nedokončené formulace („exclusief (of inclusief) BTW“, „binnen 24 of 48 uur“, „gebruikers land“). Chybí vzorový formulář pro odstoupení od smlouvy (herroepingsformulier).', link: '/algemene-voorwaarden/', must: true },
      ]},
    ],
  },
];

export const CHECKLIST_ITEMS = PARTS.flatMap((p) => p.groups.flatMap((g) => g.items));
export const CHECKLIST_IDS = new Set(CHECKLIST_ITEMS.map((i) => i.id));
