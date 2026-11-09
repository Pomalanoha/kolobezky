// Nabídka lekcí – používá ji stránka /proefrit-en-lessen/ i /llms.txt.
// price: 0 = zdarma, null = zobrazí se „op aanvraag“; priceNote = doplňující řádek pod cenou.
export const offers = [
  {
    id: 'proefrit',
    title: 'Proefrit',
    tagline: 'Try – kennismaken met steppen',
    duration: '± 45 min',
    price: 0 as number | null,
    priceNote: 'step en helm te leen',
    highlight: true,
    features: ['uitleg over de step en de juiste houding', 'rustig oefenen in het park', 'verschillende steps uitproberen', 'persoonlijk advies over de modelkeuze'],
  },
  {
    id: 'prive',
    title: 'Privéles of training',
    tagline: 'Individueel, afgestemd op jouw doelen',
    duration: '± 75 min',
    price: 45,
    priceNote: 'incl. step en helm · € 30 met je eigen step',
    highlight: false,
    features: ['de juiste houding en techniek', 'warming-up en cooling-down', 'conditietraining in de natuur', 'aanmoediging, coaching en advies over voeding'],
  },
  {
    id: 'workshop',
    title: 'Workshop sportsteppen',
    tagline: 'Een tocht vol bewegen, natuur en tips',
    duration: '± 2–3 uur',
    price: 65,
    priceNote: 'met je eigen step',
    highlight: false,
    features: ['houding en techniek onderweg', 'een tocht, bijv. door de duinen naar zee', 'mindfulness en een gezonde leefstijl', 'picknick met voedingstips en materiaal om mee te nemen'],
  },
  {
    id: 'groepstraining',
    title: 'Groepstraining',
    tagline: 'Samen trainen met de club',
    duration: '± 75 min',
    price: 0,
    priceNote: 'voor clubleden · € 25 voor anderen, met je eigen step',
    highlight: false,
    features: ['training in een kleine groep', 'techniek en conditie', 'routes rond Haarlem en in de duinen', 'gezellig samen buiten bewegen'],
  },
];
