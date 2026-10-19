import { site } from '../config';

// Texty rozhraní (menu, tlačítka, patička). Obsah stránek je přímo v souborech stránek a v src/content.
const ui = {
  cs: {
    'nav.sportsteppen': 'Sportsteppen',
    'nav.proefrit': 'Zkušební jízda & lekce',
    'nav.sportsteps': 'Koloběžky',
    'nav.club': 'Klub',
    'nav.over': 'O Lindě',
    'nav.contact': 'Kontakt',
    'nav.menu': 'Menu',
    'nav.close': 'Zavřít',
    'cta.book': 'Rezervovat zkušební jízdu',
    'cta.bookShort': 'Rezervovat',
    'cta.whatsapp': 'Napsat na WhatsApp',
    'cta.more': 'Více informací',
    'footer.tagline': 'Sportsteppen v Hoofddorpu a okolí. Vyzkoušej to, zažij to a pak jezdi dál sám – nebo s námi.',
    'footer.explore': 'Prozkoumat',
    'footer.contact': 'Kontakt',
    'footer.area': 'Působíme v oblasti',
    'footer.legal': 'Obchodní podmínky',
    'footer.privacy': 'Ochrana osobních údajů',
    'footer.faq': 'Časté dotazy',
    'footer.blog': 'Tipy & články',
    'footer.routes': 'Kde jezdíme',
    'footer.reviews': 'Reference',
    'footer.accessories': 'Doplňky',
    'footer.groups': 'Pro skupiny',
    'footer.voucher': 'Dárkový poukaz',
    'footer.quiz': 'Která koloběžka je pro mě?',
    'product.from': 'od',
    'product.inclVat': 'vč. DPH',
    'product.inStock': 'Skladem',
    'product.onOrder': 'Na objednávku',
    'product.order': 'Objednat',
    'product.soldOut': 'Vyprodáno',
    'breadcrumb.home': 'Úvod',
    'todo': 'Doplnit / ověřit s Lindou',
  },
  nl: {
    'nav.sportsteppen': 'Sportsteppen',
    'nav.proefrit': 'Proefrit & lessen',
    'nav.sportsteps': 'Sportsteps',
    'nav.club': 'Club',
    'nav.over': 'Over Linda',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.close': 'Sluiten',
    'cta.book': 'Boek een proefrit',
    'cta.bookShort': 'Boek nu',
    'cta.whatsapp': 'App via WhatsApp',
    'cta.more': 'Meer informatie',
    'footer.tagline': 'Sportsteppen in Hoofddorp en omgeving. Probeer het, ervaar het en step daarna zelf verder – of samen met ons.',
    'footer.explore': 'Ontdek',
    'footer.contact': 'Contact',
    'footer.area': 'Actief in',
    'footer.legal': 'Algemene voorwaarden',
    'footer.privacy': 'Privacybeleid',
    'footer.faq': 'Veelgestelde vragen',
    'footer.blog': 'Tips & blog',
    'footer.routes': 'Waar we steppen',
    'footer.reviews': 'Ervaringen',
    'footer.accessories': 'Accessoires',
    'footer.groups': 'Groepsuitjes',
    'footer.voucher': 'Cadeaubon',
    'footer.quiz': 'Welke step past bij mij?',
    'product.from': 'v.a.',
    'product.inclVat': 'incl. btw',
    'product.inStock': 'Op voorraad',
    'product.onOrder': 'Op bestelling',
    'product.order': 'Bestellen',
    'product.soldOut': 'Uitverkocht',
    'breadcrumb.home': 'Home',
    'todo': 'Aanvullen / controleren',
  },
} as const;

export type UiKey = keyof (typeof ui)['cs'];

export function t(key: UiKey): string {
  return ui[site.lang][key] ?? ui.cs[key];
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(site.lang === 'nl' ? 'nl-NL' : 'cs-CZ', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
