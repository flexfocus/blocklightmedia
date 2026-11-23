# Site structure & future integrations

## How the site is organized

| Path | What it is | Edited by |
| --- | --- | --- |
| `site-src/services.mjs` | Copy, SEO titles, descriptions, FAQs and form values for all 24 services | Hand |
| `site-src/config.mjs` | Site origin (canonical URLs), integration switches (all off) | Hand |
| `site-src/build.mjs` | Generates service pages, `photography.html`, `videography.html`, `services.html`, `sitemap.xml`, `robots.txt`; refreshes the shared header/footer, canonical tag and contact-form service options in the hand-written pages | Hand |
| `*-reading-pa.html`, `photography.html`, `videography.html`, `services.html`, `sitemap.xml` | **Generated** – do not hand-edit, run the generator | Generated |
| `index.html`, `about.html`, `work.html`, `contact.html`, `thanks.html` | Hand-written pages (only header/footer/canonical/service options are refreshed) | Hand |
| `script.js` | Menu, form preselect, portfolio filters, scroll reveal, integration hook | Hand |

After changing anything in `site-src/`, run:

```
node site-src/build.mjs
```

and commit the resulting HTML. Netlify publishes the static files as-is.

### Adding a service
Add an object to `services` in `services.mjs` (unique `slug`, `title`, `description`, `h1`, `formValue`). The generator creates the page, adds it to the right landing page group, the sitemap and the contact form dropdown.

### Contact form rules (Netlify Forms)
- The form name `project-inquiry`, `action="/thanks"`, honeypot `bot-field` and the existing field names must not change. Notifications and stored submissions depend on them.
- Service buttons link to `/contact.html?service=<slug>#quote`. `script.js` selects the `<option data-slug="<slug>">` and records the slug in the hidden `referring-service` field.
- The six original services keep their original stored values (for example `Brand photography`) so existing filters and notifications keep matching.

### Adding portfolio work
See the comment at the top of the portfolio grid in `work.html`. Each project is an `<article class="portfolio-item" data-categories="...">`. Available filter tags: `photography videography sports commercial events portraits creative`. Use `youtube-nocookie.com` embeds with `loading="lazy"`. Never delete existing entries.

## Future integrations (none are active)

Nothing below is enabled, loaded or billed. Each has a switch in `config.mjs` and a hook in `script.js` (`window.BLM_INTEGRATIONS`).

1. **Real-time scheduling** (e.g. Cal.com or Calendly). Set `integrations.scheduling` and add a "Book a time" button next to "Request Availability" on service pages (`servicePage()` in `build.mjs`). Keep the Netlify form as the fallback.
2. **Stripe deposits and payments.** Start with Stripe Payment Links (no server code), stored per service slug in `integrations.payments.depositLinks`, shown only after a quote is agreed. For custom checkout and webhooks, add a Netlify Function and keep secret keys in Netlify environment variables, never in this repo.
3. **Client contracts** (e.g. a document e-signature provider). Send contracts from the provider after a quote is accepted, and link to them from the thank-you or follow-up emails rather than the public site.
4. **Instagram, TikTok and YouTube.** Put profile URLs in `integrations.social` and they appear in the footer on the next build. Add YouTube videos to `work.html` as embeds. Live feeds need API tokens and a Netlify Function or scheduled function to cache results.
5. **Printful storefront.** Link to a hosted storefront through `integrations.storefront.url` first. A custom shop would use the Printful API from a Netlify Function.
6. **Interactive scroll animations.** `.reveal` elements already fade in on scroll (respecting reduced-motion). Replace the scroll-reveal block in `script.js` with a richer library later without changing page markup.
