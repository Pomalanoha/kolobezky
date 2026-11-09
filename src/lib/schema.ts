import { site } from '../config';

// Strukturovaná data (JSON-LD) pro Google.
export const businessId = `${site.url}/#business`;

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': businessId,
    name: site.name,
    description: `Sportsteppen in ${site.city} en omgeving: gratis proefrit, privélessen, workshops en groepstrainingen op de sportstep, en Crussis sportsteps met persoonlijk advies.`,
    url: `${site.url}/`,
    logo: `${site.url}/logo-192.png`,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}${site.ogImage}`,
    founder: { '@type': 'Person', name: site.owner },
    vatID: site.btw,
    priceRange: '€–€€',
    paymentAccepted: 'Overboeking',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postcode,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: 'NL',
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'City', name })),
    knowsAbout: ['sportsteppen', 'sportstep', 'kickbike', 'footbike', 'Crussis'],
    sameAs: Object.values(site.social).filter(Boolean),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
