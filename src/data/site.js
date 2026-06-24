// Single source of truth for NAP, navigation, attribution, and SEO config.
// Items marked TODO need real values from the GBP listing before launch.

export const site = {
  name: 'NextKey Home Offer',
  url: 'https://www.nextkeyhomeoffer.com',
  // Contact (NAP) — must match the Google Business Profile exactly.
  phone: '(408) 314-4420',
  phoneHref: 'tel:+14083144420',
  smsHref: 'sms:+14083144420',
  telephoneSchema: '+1-408-314-4420',
  email: 'jay@nextkeycap.com', // TODO confirm canonical contact email
  founder: 'Edward Olivares', // referenced in reviews + LinkedIn sameAs; TODO confirm public-facing name
  address: {
    // The spec lists "200 Brown Rd, Suite 306B, Fremont, CA 94539" but the live
    // LP shows only "Fremont, CA". TODO confirm whether the street address is
    // public on GBP (or if it's a service-area business with the address hidden).
    streetAddress: '', // TODO
    locality: 'Fremont',
    region: 'CA',
    postalCode: '', // TODO
    country: 'US',
  },
  // TODO fill from GBP before launch (drives RealEstateAgent `geo`).
  geo: { latitude: '', longitude: '' },
  // 5.0 average is shown on the LP. reviewCount is set to the number of real
  // reviews we actually display (see reviews.js); raise to the true Google
  // total once confirmed. Never inflate beyond what's displayed.
  rating: { value: '5.0', count: 9 }, // TODO confirm true Google review count
  // Google Business Profile share-embed URL (GBP → Share → Embed a map).
  gbpEmbedSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.5566605539084!2d-121.92551209999999!3d37.494787099999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x44bbfa0c32fd2361%3A0xc7fce67a76f129ca!2sNextKey%20Home%20Offer%20%7C%20Sell%20My%20House%20Fast!5e0!3m2!1sen!2sus!4v1782341578560!5m2!1sen!2sus',
  ads: {
    id: 'AW-18257642937',
    conversions: {
      lead: 'AW-18257642937/-ixTCJ3MtsQcELmL9oFE',
      call: 'AW-18257642937/69Z1CNfNtsQcELmL9oFE',
      text: 'AW-18257642937/YQFXCNrNtsQcELmL9oFE',
    },
  },
  social: [
    'https://www.facebook.com/NextKeyHomeOffer/',
    'https://www.instagram.com/nextkeyhomeoffer',
    'https://www.linkedin.com/in/edward-olivares-62584b341/',
  ],
  hours: 'Open every day, 24 hours',
  // Used in the global RealEstateAgent schema `areaServed`.
  areaServed: [
    'Fremont', 'Newark', 'Union City', 'Hayward', 'Milpitas',
    'San Leandro', 'Castro Valley', 'San Jose', 'Oakland',
    'Alameda County', 'Bay Area',
  ],
};

// Primary nav (Home is the logo link). Order matches the spec.
export const nav = [
  { label: 'Sell My House Fast', href: '/sell-my-house-fast' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'About', href: '/about-us' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Areas We Serve', href: '/areas-we-serve' },
];

// Launch cities (day-one set). Full per-city content lives in each city page.
export const cities = [
  { slug: 'fremont', name: 'Fremont' },
  { slug: 'newark', name: 'Newark' },
  { slug: 'union-city', name: 'Union City' },
  { slug: 'hayward', name: 'Hayward' },
];

// Situation / problem-solver pages (footer + internal links; not in main nav).
export const situations = [
  { slug: 'sell-house-as-is', label: 'Sell My House As-Is', href: '/sell-house-as-is' },
  { slug: 'stop-foreclosure', label: 'Stop Foreclosure', href: '/stop-foreclosure' },
  { slug: 'sell-inherited-house', label: 'Sell an Inherited House', href: '/sell-inherited-house' },
  { slug: 'why-sell', label: 'Why Sell to NextKey', href: '/why-sell' },
];
