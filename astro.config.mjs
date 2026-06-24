import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical host for the production site. Drives <link rel="canonical">,
// schema @id/url, and the generated sitemap. If you prefer the apex
// (nextkeyhomeoffer.com) over www, change this one value.
const SITE = 'https://www.nextkeyhomeoffer.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: {
    // Emit /sell-my-house-fast.html etc. Vercel `cleanUrls` serves these
    // without the .html extension and 301s the extensioned form.
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/privacy') && !page.includes('/terms'),
    }),
  ],
});
