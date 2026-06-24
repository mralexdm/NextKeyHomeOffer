# NextKey Home Offer — nextkeyhomeoffer.com

Static, multi-page **Astro** site for NextKey Home Offer (Fremont / Bay Area cash home buyer).
Built from the landing-page design system; deployed to Vercel.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output -> dist/
```

## Stack & structure

- **Astro** static output (`build.format: 'file'`), `@astrojs/sitemap`.
- `src/layouts/Base.astro` — `<head>`, header (nav + mobile drawer), footer, mobile bar, global `RealEstateAgent` + `WebSite` schema, live Google Ads tag, shared form/carousel/click-tracking script.
- `src/components/` — Header, Footer, MobileBar, LeadForm, OfferBand, Reviews, MapEmbed, NAP, Breadcrumbs, Schema.
- `src/data/` — `site.js` (NAP, nav, cities, conversion IDs), `reviews.js` (9 real reviews), `faqs.js`.
- `src/lib/schema.js` — JSON-LD builders.
- `src/pages/` — 18 pages incl. the `/areas-we-serve/{city}` templates.
- `api/nextkey-lead.js` — Vercel serverless function: lead → GoHighLevel (contact + opportunity + note). Honeypot, validation, per-surface `source` attribution.
- `vercel.json` — `cleanUrls`, `trailingSlash:false`, 301s from old Wix paths.

## Required environment variable (Vercel → Settings → Environment Variables)

| Name | Notes |
|---|---|
| `GHL_PRIVATE_TOKEN` | GoHighLevel private integration token. **Required** for the forms to create leads. Never commit it. |

## Launch punch-list (TODO before go-live)

Values to fill in `src/data/site.js`:
- [ ] `address.streetAddress` / `address.postalCode` — confirm the exact NAP shown on the Google Business Profile.
- [ ] `geo.latitude` / `geo.longitude` — business coordinates.
- [ ] `gbpEmbedSrc` — Google Business Profile → Share → Embed a map → iframe `src` (powers all map embeds).
- [ ] `rating.count` — true Google review total (currently set to the 9 reviews displayed).
- [ ] `email` — confirm canonical contact email.

Other:
- [ ] Add `public/og.jpg` (1200×630 social/OG image; referenced by schema + `og:image`).
- [ ] Set `GHL_PRIVATE_TOKEN` on the Vercel project.
- [ ] Confirm the canonical host (currently `https://www.nextkeyhomeoffer.com` in `astro.config.mjs`).
- [ ] Verify/extend the Wix 301 list in `vercel.json` against the real old URL inventory.
