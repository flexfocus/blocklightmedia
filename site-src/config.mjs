// Global site settings used by build.mjs.
// When a custom domain is connected, change `origin` and rebuild so canonical
// tags, Open Graph URLs and sitemap.xml all update together.

export const site = {
  name: 'Block Light Media',
  origin: 'https://blocklightmedia.netlify.app',
  locality: 'Reading',
  region: 'PA',
  regionName: 'Pennsylvania',
  contactPath: '/contact',
  year: 2026,
};

// Future integrations. Everything is OFF. Nothing here loads a third-party
// script, creates an account or starts a subscription. Turning one on means
// filling in its settings AND adding the matching module in /js/integrations/.
// See site-src/INTEGRATIONS.md for the plan for each.
export const integrations = {
  scheduling: { enabled: false, provider: null, bookingUrl: null }, // e.g. Cal.com / Calendly
  payments: { enabled: false, provider: null, depositLinks: {} }, // e.g. Stripe Payment Links per service slug
  contracts: { enabled: false, provider: null },
  social: { instagram: null, tiktok: null, youtube: null }, // profile URLs only, shown in footer when set
  storefront: { enabled: false, provider: null, url: null }, // e.g. Printful-backed shop
  scrollAnimations: { enabled: true }, // lightweight, built in, respects reduced motion
};
