import { site } from '../data/site.js';
import { reviews } from '../data/reviews.js';

const BUSINESS_ID = `${site.url}/#business`;
const WEBSITE_ID = `${site.url}/#website`;

function postalAddress() {
  const a = site.address;
  const out = {
    '@type': 'PostalAddress',
    addressLocality: a.locality,
    addressRegion: a.region,
    addressCountry: a.country,
  };
  if (a.streetAddress) out.streetAddress = a.streetAddress;
  if (a.postalCode) out.postalCode = a.postalCode;
  return out;
}

function aggregateRating() {
  if (!site.rating || !site.rating.count) return null;
  return {
    '@type': 'AggregateRating',
    ratingValue: site.rating.value,
    reviewCount: String(site.rating.count),
    bestRating: '5',
  };
}

// Sitewide RealEstateAgent. One canonical @id; every other node references it.
export function businessSchema() {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': BUSINESS_ID,
    name: site.name,
    description:
      'Local cash home buyer serving Fremont and the Bay Area. We buy houses as-is for cash with no fees, no commissions, and a closing date you choose.',
    url: `${site.url}/`,
    telephone: site.telephoneSchema,
    email: site.email,
    image: `${site.url}/og.jpg`,
    priceRange: '$$',
    address: postalAddress(),
    areaServed: site.areaServed,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    sameAs: site.social,
  };
  if (site.geo.latitude && site.geo.longitude) {
    node.geo = {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    };
  }
  const rating = aggregateRating();
  if (rating) node.aggregateRating = rating;
  return node;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    publisher: { '@id': BUSINESS_ID },
  };
}

// items: [{ name, path }] — path relative to site root, e.g. '/areas-we-serve'.
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}

export function serviceSchema({ name, description, serviceType = 'Cash home buying', areaServedName = 'Bay Area, CA', areaServedType = 'AdministrativeArea' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: { '@id': BUSINESS_ID },
    areaServed: { '@type': areaServedType, name: areaServedName },
    name,
    description,
  };
}

// faqs: [{ q, a }]
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// Review[] graph + the page-level AggregateRating, reflecting displayed reviews.
export function reviewsSchema(list = reviews) {
  const graph = list.map((r) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': BUSINESS_ID },
    author: { '@type': 'Person', name: r.author },
    reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
    reviewBody: r.body,
  }));
  const rating = aggregateRating();
  if (rating) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': BUSINESS_ID,
      aggregateRating: rating,
    });
  }
  return graph;
}

export function aboutSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${site.url}/about-us`,
    mainEntity: { '@id': BUSINESS_ID },
  };
}

export function contactSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: `${site.url}/contact`,
    mainEntity: { '@id': BUSINESS_ID },
  };
}

// City-scoped RealEstateAgent that references the parent business.
export function cityBusinessSchema(city) {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: `${site.name} — ${city.name}`,
    parentOrganization: { '@id': BUSINESS_ID },
    telephone: site.telephoneSchema,
    areaServed: { '@type': 'City', name: `${city.name}, CA` },
    url: `${site.url}/areas-we-serve/${city.slug}`,
  };
  const rating = aggregateRating();
  if (rating) node.aggregateRating = rating;
  return node;
}

// ItemList of city pages for the Areas We Serve hub.
export function cityItemListSchema(cityList) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: cityList.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${site.url}/areas-we-serve/${c.slug}`,
    })),
  };
}
