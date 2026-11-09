// /llms.txt – stručný přehled webu pro AI asistenty (ChatGPT, Claude, Perplexity…), formát podle llmstxt.org.
// Vše se skládá z dat webu, takže ceny a nabídka jsou vždy stejné jako na stránkách.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, shop, voucher } from '../config';
import { offers } from '../data/lessons';

const url = (path: string) => new URL(path, site.url).href;
const euro = (n: number) => `€ ${n.toLocaleString('nl-NL', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2 })}`;
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const stock = { 'op-voorraad': 'op voorraad', 'op-bestelling': 'op bestelling', uitverkocht: 'uitverkocht' } as const;

export const GET: APIRoute = async () => {
  const products = (await getCollection('products')).sort((a, b) => a.data.order - b.data.order);
  const faq = await getCollection('faq');
  const locations = (await getCollection('locations')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const delivery = shop.shipping.find((s) => s.id === 'bezorgen');
  const pickup = shop.shipping.find((s) => s.id === 'ophalen');

  const lines = [
    `# ${site.name}`,
    '',
    `> Sportsteppen (kickbike, footbike) in ${site.city} en omgeving. ${site.owner} geeft proefritten, privélessen, workshops en groepstrainingen op de sportstep en verkoopt Crussis sportsteps met persoonlijk advies. Sportsteppen is een training voor je hele lichaam die zacht is voor je gewrichten – geschikt voor beginners, ouderen en na een blessure.`,
    '',
    `- Actief in: ${site.areaServed.join(', ')} (Noord-Holland, Nederland)`,
    `- Adres: ${site.street}, ${site.postcode} ${site.city}`,
    `- Contact: ${site.phone} (ook WhatsApp: ${site.whatsapp}), ${site.email}`,
    `- Talen: Nederlands, Tsjechisch`,
    `- KvK ${site.kvk}`,
    '',
    '## Proefrit en lessen',
    '',
    ...offers.map((o) => `- **${o.title}** (${o.duration}): ${o.price === 0 ? 'gratis' : o.price ? euro(o.price) : 'prijs op aanvraag'}${o.priceNote ? ` – ${o.priceNote}` : ''}. ${capitalize(o.features.join(', '))}.`),
    `- Boeken: via WhatsApp, telefoon of het formulier op ${url('/contact/')}`,
    `- Meer informatie: ${url('/proefrit-en-lessen/')}`,
    '',
    '## Sportsteps (webshop)',
    '',
    ...products.map((p) => `- [${p.data.title}](${url(`/sportsteps/${p.id}/`)}): ${p.data.priceFrom ? 'v.a. ' : ''}${euro(p.data.price)} incl. btw, ${stock[p.data.availability]}. ${p.data.summary}`),
    `- Accessoires (standaards, spatborden, helmen, bidons): ${url('/accessoires/')}`,
    `- Bestellen: ${url('/bestellen/')} – betalen per overboeking, levering ${shop.deliveryTime}${delivery?.price ? `, verzendkosten ${euro(delivery.price)}${delivery.freeFrom ? ` (gratis vanaf ${euro(delivery.freeFrom)})` : ''}` : ''}${pickup ? `, of gratis ophalen in ${site.city} met persoonlijk advies` : ''}.`,
    `- Keuzetest welke step past: ${url('/welke-step/')}`,
    '',
    '## Club, groepen en cadeaubon',
    '',
    `- [Club](${url('/club/')}): wie een step via de webshop koopt, wordt clublid; clubritten en groepstrainingen zijn gratis voor clubleden.`,
    `- [Groepsuitjes](${url('/groepen/')}): bedrijfsuitjes, vrijgezellenfeesten en verjaardagen op de sportstep (met eigen steps), op aanvraag.`,
    `- [Cadeaubon](${url('/cadeaubon/')}): ${voucher.amounts.map(euro).join(', ')} of een eigen bedrag (${euro(voucher.min)}–${euro(voucher.max)}), ${voucher.validityMonths / 12} jaar geldig, per e-mail om te printen.`,
    '',
    '## Routes',
    '',
    ...locations.map((l) => `- [${l.data.title}](${url(`/routes/${l.id}/`)}): ${l.data.description}`),
    '',
    '## Veelgestelde vragen',
    '',
    ...faq.flatMap((f) => [`### ${f.data.question}`, '', f.data.answer, '']),
    '## Meer lezen',
    '',
    `- [Wat is sportsteppen?](${url('/sportsteppen/')})`,
    `- [Over Linda](${url('/over-linda/')})`,
    `- [Ervaringen van klanten](${url('/ervaringen/')})`,
    ...posts.map((p) => `- [${p.data.title}](${url(`/blog/${p.id}/`)}): ${p.data.description}`),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
