// Centrální údaje o webu. Při překladu do NL stačí přepnout `lang` na 'nl'.
export const site = {
  lang: 'cs' as 'cs' | 'nl',
  name: 'Kickbike Club Hille',
  url: 'https://www.kickbikeclubhille.nl',
  owner: 'Linda Pokorná',
  email: 'kickbikeclubhille@gmail.com',
  phone: '+31 6 47737673',
  phoneHref: 'tel:+31647737673',
  whatsapp: 'https://wa.me/31647737673',
  kvk: '98484419',
  city: 'Hoofddorp',
  region: 'Noord-Holland',
  // Oblast, kde Linda působí – použito v textech i v JSON-LD (areaServed).
  areaServed: ['Hoofddorp', 'Haarlemmermeer', 'Haarlem', 'Nieuw-Vennep', 'Badhoevedorp', 'Heemstede', 'Zandvoort'],
  // Odkaz na rezervační systém (Cal.com / Calendly). Prázdné = tlačítka vedou na kontaktní formulář.
  bookingUrl: '',
  social: {
    instagram: '',
    facebook: '',
    strava: '',
  },
  // Výchozí obrázek pro sdílení na sociálních sítích (1200×630, vložit do /public).
  ogImage: '/og-default.jpg',
};

export const nav = [
  { href: '/sportsteppen/', key: 'nav.sportsteppen' },
  { href: '/proefrit-en-lessen/', key: 'nav.proefrit' },
  { href: '/sportsteps/', key: 'nav.sportsteps' },
  { href: '/club/', key: 'nav.club' },
  { href: '/over-linda/', key: 'nav.over' },
  { href: '/contact/', key: 'nav.contact' },
] as const;

export const bookingHref = site.bookingUrl || '/contact/?onderwerp=proefrit';

// Nastavení e-shopu (objednávka s platbou převodem).
export const shop = {
  orderPrefix: 'KCH',
  deliveryTime: 'cca do 10 pracovních dnů',
  // Splatnost převodu ve dnech
  paymentDays: 7,
  maxQty: 5,
  // Bankovní spojení pro platbu převodem. Prázdný IBAN = v potvrzení se zobrazí „pošleme e-mailem“.
  bank: {
    accountName: 'Kickbike Club Hille',
    iban: '',
    bic: '',
  },
  // Způsoby předání. price: null = cena zatím není stanovená (upřesní se e-mailem).
  shipping: [
    { id: 'bezorgen', label: 'Doručení na adresu v Nizozemsku', price: null as number | null, needsAddress: true },
    { id: 'ophalen', label: 'Vyzvednutí v Hoofddorpu + nastavení koloběžky na míru', price: 0 as number | null, needsAddress: false },
  ],
};

export type ShippingId = (typeof shop.shipping)[number]['id'];
