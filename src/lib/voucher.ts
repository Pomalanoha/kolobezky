// Dárkový poukaz: ověření formuláře a sestavení objednávky (platba převodem jako u e-shopu).
import { voucher } from '../config';
import { toCents, type OrderInput, type PricedOrder } from './shop';

const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? '').trim().slice(0, max);

// Kód bez zaměnitelných znaků (0/O, 1/I)
function voucherCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const raw = [...bytes].map((b) => chars[b % chars.length]).join('');
  return `CB-${raw.slice(0, 4)}-${raw.slice(4)}`;
}

export function validUntil(from: Date) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + voucher.validityMonths);
  return d.toISOString().slice(0, 10);
}

export function parseVoucherForm(form: FormData):
  | { errors: Record<string, string> }
  | { errors: null; input: OrderInput; priced: PricedOrder; meta: Record<string, string> } {
  const errors: Record<string, string> = {};
  const choice = clean(form.get('bedrag'), 10);
  const amount = choice === 'jine' ? Number.parseInt(clean(form.get('bedrag_vrij'), 6), 10) : Number.parseInt(choice, 10);
  if (!Number.isFinite(amount)) errors.bedrag = 'Kies de waarde van de cadeaubon.';
  else if (choice === 'jine' && (amount < voucher.min || amount > voucher.max)) errors.bedrag_vrij = `Vul een bedrag in tussen € ${voucher.min} en € ${voucher.max}.`;
  else if (choice !== 'jine' && !voucher.amounts.includes(amount)) errors.bedrag = 'Kies de waarde van de cadeaubon.';

  const recipient = clean(form.get('ontvanger'), 60);
  const message = clean(form.get('boodschap'), 200);
  const input: OrderInput = {
    step: '',
    qty: 1,
    accessories: [],
    shipping: 'email',
    name: clean(form.get('naam'), 120),
    email: clean(form.get('email')).toLowerCase(),
    phone: clean(form.get('telefoon'), 40),
    street: '',
    postcode: '',
    city: '',
    note: '',
    terms: form.get('terms') === 'on',
  };
  if (input.name.length < 2) errors.naam = 'Vul je voor- en achternaam in.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email)) errors.email = 'Vul een geldig e-mailadres in – daar sturen we de cadeaubon naartoe.';
  if (input.phone && !/^[+\d][\d\s()-]{6,}$/.test(input.phone)) errors.telefoon = 'Vul je telefoonnummer in met cijfers.';
  if (!input.terms) errors.terms = 'Om te bestellen moet je akkoord gaan met de algemene voorwaarden.';
  if (Object.keys(errors).length) return { errors };

  const cents = toCents(amount);
  return {
    errors: null,
    input,
    priced: {
      lines: [{ key: `voucher:${amount}`, title: `Cadeaubon € ${amount}`, qty: 1, unitCents: cents, totalCents: cents }],
      subtotalCents: cents,
      shippingCents: 0,
      totalCents: cents,
      shippingLabel: 'Cadeaubon per e-mail (om te printen)',
    },
    meta: {
      type: 'voucher',
      code: voucherCode(),
      amount: String(amount),
      recipient,
      message,
      validUntil: validUntil(new Date()),
    },
  };
}
