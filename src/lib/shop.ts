// Katalog a výpočet ceny objednávky. Cena se vždy počítá na serveru z aktuálního obsahu webu.
import { getCollection } from 'astro:content';
import { shop, site } from '../config';

export interface CatalogItem {
  key: string; // "step:<slug>|<varianta>" nebo "acc:<id>"
  kind: 'step' | 'acc';
  title: string;
  variant?: string;
  price: number;
  available: boolean;
}

export interface OrderLine {
  key: string;
  title: string;
  qty: number;
  unitCents: number;
  totalCents: number;
}

export const toCents = (eur: number) => Math.round(eur * 100);

export async function getCatalog(): Promise<CatalogItem[]> {
  const products = (await getCollection('products')).sort((a, b) => a.data.order - b.data.order);
  const accessories = await getCollection('accessories');
  const steps = products.flatMap((p) => {
    const variants = p.data.variants.length > 0 ? p.data.variants : [''];
    return variants.map((v) => ({
      key: `step:${p.id}|${v}`,
      kind: 'step' as const,
      title: v ? `${p.data.title} – ${v}` : p.data.title,
      variant: v || undefined,
      price: p.data.price,
      available: p.data.availability !== 'uitverkocht',
    }));
  });
  const accs = accessories.map((a) => ({
    key: `acc:${a.id}`,
    kind: 'acc' as const,
    title: a.data.title,
    price: a.data.price,
    available: a.data.available,
  }));
  return [...steps, ...accs];
}

export interface OrderInput {
  step: string;
  qty: number;
  accessories: string[];
  shipping: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  postcode: string;
  city: string;
  note: string;
  terms: boolean;
}

export interface PricedOrder {
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number | null;
  totalCents: number;
  shippingLabel: string;
}

const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? '').trim().slice(0, max);

export function parseOrderForm(form: FormData): OrderInput {
  return {
    step: clean(form.get('step')),
    qty: Math.max(1, Math.min(shop.maxQty, Number.parseInt(clean(form.get('qty')) || '1', 10) || 1)),
    accessories: form.getAll('acc').map((v) => clean(v)).filter(Boolean).slice(0, 30),
    shipping: clean(form.get('shipping')),
    name: clean(form.get('name'), 120),
    email: clean(form.get('email'), 200).toLowerCase(),
    phone: clean(form.get('phone'), 40),
    street: clean(form.get('street'), 160),
    // „2132ab“ → „2132 AB“
    postcode: clean(form.get('postcode'), 12).toUpperCase().replace(/^(\d{4})\s*([A-Z]{2})$/, '$1 $2'),
    city: clean(form.get('city'), 80),
    note: clean(form.get('note'), 1000),
    terms: form.get('terms') === 'on',
  };
}

/** Ověří vstup a spočítá cenu. Vrací chyby (pole → zpráva) nebo naceněnou objednávku. */
export function priceOrder(input: OrderInput, catalog: CatalogItem[]): { errors: Record<string, string> } | { errors: null; order: PricedOrder } {
  const errors: Record<string, string> = {};
  const byKey = new Map(catalog.map((c) => [c.key, c]));
  const lines: OrderLine[] = [];

  if (input.step) {
    const item = byKey.get(input.step);
    if (!item || item.kind !== 'step') errors.step = 'Kies een step uit de lijst.';
    else if (!item.available) errors.step = 'Dit model is momenteel uitverkocht.';
    else lines.push({ key: item.key, title: item.title, qty: input.qty, unitCents: toCents(item.price), totalCents: toCents(item.price) * input.qty });
  }
  for (const key of new Set(input.accessories)) {
    const item = byKey.get(key);
    if (!item || item.kind !== 'acc' || !item.available) {
      errors.acc = 'Een van de accessoires is niet meer beschikbaar.';
      continue;
    }
    lines.push({ key: item.key, title: item.title, qty: 1, unitCents: toCents(item.price), totalCents: toCents(item.price) });
  }
  if (lines.length === 0 && !errors.step) errors.step = 'Kies een step of ten minste één accessoire.';

  const ship = shop.shipping.find((s) => s.id === input.shipping);
  if (!ship) errors.shipping = 'Kies hoe je de bestelling wilt ontvangen.';

  if (input.name.length < 2) errors.name = 'Vul je voor- en achternaam in.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email)) errors.email = 'Vul een geldig e-mailadres in.';
  if (input.phone && !/^[+\d][\d\s()-]{6,}$/.test(input.phone)) errors.phone = 'Vul je telefoonnummer in met cijfers, bijv. 06 12345678.';
  if (ship?.needsAddress) {
    if (input.street.length < 3) errors.street = 'Vul je straat en huisnummer in.';
    if (!/^[1-9]\d{3}\s?[A-Z]{2}$/.test(input.postcode)) errors.postcode = 'Vul een Nederlandse postcode in, bijv. 2132 AB.';
    if (input.city.length < 2) errors.city = 'Vul je woonplaats in.';
  }
  if (!input.terms) errors.terms = 'Om te bestellen moet je akkoord gaan met de algemene voorwaarden.';

  if (Object.keys(errors).length > 0 || !ship) return { errors };

  const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);
  const shippingCents = ship.price === null ? null : toCents(ship.price);
  return {
    errors: null,
    order: { lines, subtotalCents, shippingCents, totalCents: subtotalCents + (shippingCents ?? 0), shippingLabel: ship.label },
  };
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat(site.lang === 'nl' ? 'nl-NL' : 'cs-CZ', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
