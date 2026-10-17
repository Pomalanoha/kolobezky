import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // recreatief = rekreační, sport = sportovní, cross = terénní
      category: z.enum(['recreatief', 'sport', 'cross']),
      price: z.number(),
      priceFrom: z.boolean().default(false),
      summary: z.string(),
      idealFor: z.array(z.string()).default([]),
      variants: z.array(z.string()).default([]),
      specs: z.record(z.string(), z.string()).default({}),
      image: image().optional(),
      imageHint: z.string().optional(),
      // Další fotky (např. barevné varianty)
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      availability: z.enum(['op-voorraad', 'op-bestelling']).default('op-bestelling'),
      // Stripe/Mollie payment link (iDEAL). Prázdné = jen poptávka.
      paymentLink: z.string().optional(),
      order: z.number().default(99),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      image: image().optional(),
      imageHint: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const locations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locations' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Krátký název na kartičky
      name: z.string(),
      place: z.string(),
      description: z.string(),
      distance: z.string().optional(),
      surface: z.string().optional(),
      level: z.string(),
      image: image().optional(),
      imageHint: z.string().optional(),
      verify: z.boolean().default(false),
      order: z.number().default(99),
    }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({ title: z.string() }),
});

const testimonials = defineCollection({
  loader: file('./src/data/testimonials.json'),
  schema: z.object({
    name: z.string(),
    context: z.string().optional(),
    text: z.string(),
    // Původní holandský text – ve finální verzi se použije ten.
    original: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const faq = defineCollection({
  loader: file('./src/data/faq.json'),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    topic: z.enum(['start', 'zdravi', 'steps', 'lekce']),
  }),
});

const accessories = defineCollection({
  loader: file('./src/data/accessories.json'),
  schema: ({ image }) => z.object({
    title: z.string(),
    image: image().optional(),
    price: z.number(),
    fits: z.string().optional(),
    note: z.string().optional(),
  }),
});

export const collections = { products, blog, locations, legal, testimonials, faq, accessories };
