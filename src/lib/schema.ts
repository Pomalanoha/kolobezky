import { site } from '../config';

// Strukturovaná data (JSON-LD) pro Google.
export const businessId = `${site.url}/#business`;

export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': businessId,
    name: site.name,
    url: `${site.url}/`,
    email: site.email,
    telephone: site.phone,
    image: `${site.url}${site.ogImage}`,
    founder: { '@type': 'Person', name: site.owner },
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
