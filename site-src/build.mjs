// Static page generator for Block Light Media.
// Run from the repo root:  node site-src/build.mjs
//
// What it does
//  1. Writes every service page, the Photography / Videography landing pages,
//     the services overview and sitemap.xml from services.mjs.
//  2. Refreshes ONLY the shared header, footer, canonical tag and the contact
//     form's service <option> list inside hand-written pages (index, about,
//     work, contact, thanks). Everything else in those pages is left alone.
//
// The generated HTML is committed, so Netlify just publishes static files.
// No build step or dependency is required at deploy time.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { services, categories } from './services.mjs';
import { site, integrations } from './config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (path) => site.origin + path;
const pagePath = (slug) => `/${slug}.html`;
export const quoteHref = (slug) => `${site.contactPath}.html?service=${slug}#quote`;
const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// ───────────────────────────── shared chrome ─────────────────────────────
const NAV = [
  ['home', '/index.html', 'Home'],
  ['photography', '/photography.html', 'Photography'],
  ['videography', '/videography.html', 'Videography'],
  ['work', '/work.html', 'Work'],
  ['about', '/about.html', 'About'],
];

export function header(active = '') {
  const links = NAV.map(
    ([key, href, label]) =>
      `<a href="${href}"${key === active ? ' aria-current="page"' : ''}${key === 'photography' || key === 'videography' ? ' class="nav-cat"' : ''}>${label}</a>`
  ).join('');
  return `<header class="site-header"><a class="wordmark" href="/" aria-label="Block Light Media home"><span class="mark">BL<span class="mark-dot">.</span></span><span class="wordmark-text">BLOCK LIGHT<br><small>MEDIA / CREATIVE PRODUCTION</small></span></a><button id="menuToggle" class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="mainNav" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button><nav id="mainNav" class="main-nav" aria-label="Main navigation">${links}<a class="nav-cta" href="/contact.html#quote"${active === 'contact' ? ' aria-current="page"' : ''}>Get a Quote <span aria-hidden="true">↗</span></a></nav></header>`;
}

export function footer() {
  const social = Object.entries(integrations.social)
    .filter(([, href]) => href)
    .map(([name, href]) => `<a href="${esc(href)}" rel="noopener" target="_blank">${name[0].toUpperCase() + name.slice(1)}</a>`)
    .join('');
  return `<footer class="footer"><div><span class="footer-logo">BLOCK LIGHT<span class="accent">.</span></span><p>Creative production built for brands, teams and stories worth seeing.</p></div><div class="footer-links"><a href="/photography.html">Photography</a><a href="/videography.html">Videography</a><a href="/services.html">All services</a><a href="/work.html">Work</a><a href="/about.html">About</a><a href="/contact.html#quote">Get a Quote</a>${social}</div><div><span class="eyebrow">BASED IN</span><p>Reading, Pennsylvania<br>Available for travel</p><span class="small-muted">© ${site.year} Block Light Media. Working brand name.</span></div></footer>`;
}

function head({ title, description, path, extra = '' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0d1011"><meta name="description" content="${esc(description)}"><title>${esc(title)}</title><link rel="canonical" href="${url(path)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${site.name}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url(path)}"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script defer src="/script.js"></script>${extra}</head><body><a class="skip" href="#main">Skip to content</a>`;
}
const end = () => `${footer()}</body></html>`;

const business = {
  '@type': 'LocalBusiness',
  '@id': `${site.origin}/#business`,
  name: site.name,
  url: site.origin + '/',
  address: { '@type': 'PostalAddress', addressLocality: site.locality, addressRegion: site.region, addressCountry: 'US' },
  areaServed: { '@type': 'City', name: `${site.locality}, ${site.regionName}` },
};

function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url(path) })),
  };
}
const crumbs = (items) =>
  `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items
    .map(([name, path], i) => (i === items.length - 1 ? `<li aria-current="page">${esc(name)}</li>` : `<li><a href="${path}">${esc(name)}</a></li>`))
    .join('')}</ol></nav>`;

// ───────────────────────────── cards ─────────────────────────────
function serviceCard(s, i, { large = false } = {}) {
  const kind = s.category === 'photography' ? 'PHOTO' : 'FILM';
  return `<a class="service-card reveal${large ? ' service-card-lg' : ''}" data-category="${s.category}" href="${pagePath(s.slug)}"><div class="service-no">${String(i + 1).padStart(2, '0')} / ${kind}</div><div><h3>${esc(s.name)}</h3><p class="card-copy">${esc(s.card)}</p></div><div class="card-bottom"><span>Explore service</span><span aria-hidden="true">↗</span></div></a>`;
}

// ───────────────────────────── service page ─────────────────────────────
function servicePage(s) {
  const cat = categories[s.category];
  const path = pagePath(s.slug);
  const trail = [['Home', '/index.html'], [cat.name, `/${cat.slug}.html`], [s.name, path]];
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.h1,
      serviceType: s.name,
      description: s.description,
      url: url(path),
      areaServed: business.areaServed,
      provider: business,
    },
    breadcrumbLd(trail),
  ];
  if (s.faqs?.length) {
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: s.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  const list = (items) => `<ul class="check-list">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const related = s.related.map((r) => bySlug[r]).filter(Boolean);
  const other = s.category === 'photography' ? categories.videography : categories.photography;

  return `${head({ title: s.title, description: s.description, path, extra: ld.map(jsonld).join('') })}${header(s.category)}<main id="main">
<section class="page-hero service-hero service-hero-${s.category}">${crumbs(trail)}<p class="eyebrow">${s.category === 'photography' ? 'PHOTOGRAPHY' : 'VIDEOGRAPHY'} · READING, PENNSYLVANIA</p><h1>${esc(s.h1)}</h1><p>${esc(s.tagline)}</p><div class="hero-buttons"><a class="button primary" href="${quoteHref(s.slug)}" data-service-cta="${s.slug}">Get a Quote <span aria-hidden="true">↗</span></a><a class="text-link light" href="${quoteHref(s.slug)}" data-service-cta="${s.slug}">Request Availability ↗</a></div></section>
<section class="section service-detail"><div class="detail-grid"><div><p class="eyebrow">THE SERVICE</p><h2>Every detail,<br><em>considered.</em></h2></div><div><p class="lead">${esc(s.lead)}</p>${s.body.map((p) => `<p class="body-copy">${esc(p)}</p>`).join('')}<div class="detail-list"><div><h3>What this covers</h3>${list(s.covers)}</div><div><h3>What you receive</h3>${list(s.receive)}</div><div><h3>A good fit for</h3>${list(s.idealFor)}</div><div><h3>Pricing &amp; booking</h3><p>Every project is quoted individually based on scope, date and location. Request your date; availability and any deposit terms are confirmed in writing before anything is booked.</p></div></div></div></div></section>
<section class="section next-steps"><p class="eyebrow">THE PROCESS</p><h2>Simple from the first message.</h2><div class="steps"><div><span>01</span><h3>Tell us about it</h3><p>Share your date, location, goals, and estimated budget.</p></div><div><span>02</span><h3>Get a plan &amp; quote</h3><p>We confirm availability, scope, deliverables and pricing.</p></div><div><span>03</span><h3>Make it official</h3><p>After agreement, we confirm the booking and any required deposit.</p></div></div></section>
${s.faqs?.length ? `<section class="section faq-section"><div class="detail-grid"><div><p class="eyebrow">QUESTIONS</p><h2>Good to<br><em>know.</em></h2></div><div class="faq-list">${s.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></div></section>` : ''}
<section class="section dark-section related-section"><div class="section-heading"><div><p class="eyebrow">RELATED SERVICES</p><h2>Often booked<br><em>together.</em></h2></div><a class="text-link" href="/${cat.slug}.html">All ${cat.name.toLowerCase()} services ↗</a></div><div class="service-grid">${related.map((r, i) => serviceCard(r, i)).join('')}</div><p class="cross-link">Looking for ${other.name.toLowerCase()} instead? <a href="/${other.slug}.html">Explore ${other.name} ↗</a></p></section>
<section class="section cta-section"><p class="eyebrow eyebrow-light">LET'S TALK</p><h2>Ready when<br><em>you are.</em></h2><p>Tell us what you're planning. No automatic charge or unconfirmed reservation.</p><a class="button primary" href="${quoteHref(s.slug)}" data-service-cta="${s.slug}">Get a Quote for ${esc(s.name)} <span aria-hidden="true">↗</span></a></section>
</main>${end()}`;
}

// ───────────────────────────── category landing page ─────────────────────────────
function categoryPage(cat) {
  const list = services.filter((s) => s.category === cat.slug);
  const featured = list.filter((s) => s.featured);
  const path = `/${cat.slug}.html`;
  const other = cat.slug === 'photography' ? categories.videography : categories.photography;
  const trail = [['Home', '/index.html'], [cat.name, path]];
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cat.h1,
      description: cat.description,
      url: url(path),
      about: business,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: list.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: url(pagePath(s.slug)) })),
      },
    },
    breadcrumbLd(trail),
  ];
  let n = 0;
  const groups = cat.groups
    .map((g) => {
      const items = list.filter((s) => s.group === g);
      if (!items.length) return '';
      return `<div class="directory-group"><h3 class="directory-title">${esc(g)}</h3><ul class="directory-list">${items
        .map((s) => `<li><a href="${pagePath(s.slug)}"><span class="dir-no">${String(++n).padStart(2, '0')}</span><span class="dir-name">${esc(s.name)}${s.featured ? '<span class="dir-tag">Priority</span>' : ''}</span><span class="dir-copy">${esc(s.card)}</span><span class="dir-arrow" aria-hidden="true">↗</span></a></li>`)
        .join('')}</ul></div>`;
    })
    .join('');

  return `${head({ title: cat.title, description: cat.description, path, extra: ld.map(jsonld).join('') })}${header(cat.slug)}<main id="main">
<section class="page-hero category-hero category-hero-${cat.slug}">${crumbs(trail)}<p class="eyebrow">${cat.eyebrow}</p><h1>${esc(cat.h1)}</h1><p class="hero-display" aria-hidden="true">${cat.heroLine}</p><p>${esc(cat.intro)}</p><div class="hero-buttons"><a class="button primary" href="/contact.html#quote">Get a Quote <span aria-hidden="true">↗</span></a><a class="text-link light" href="#directory">Browse all ${list.length} services ↓</a></div></section>
<section class="section dark-section"><div class="section-heading"><div><p class="eyebrow">FEATURED / 001</p><h2>${cat.featuredHeading}</h2></div></div><div class="featured-grid">${featured.map((s, i) => serviceCard(s, i, { large: true })).join('')}</div></section>
<section class="section directory-section" id="directory"><div class="section-heading"><div><p class="eyebrow">ALL ${cat.name.toUpperCase()} SERVICES / 002</p><h2>Find the right<br><em>service.</em></h2></div></div><div class="directory">${groups}</div></section>
<section class="section split-banner"><div><p class="eyebrow">ALSO AVAILABLE</p><h2>Need ${other.name.toLowerCase()} too?</h2></div><div><p>Many projects combine photo and video in a single production. Explore our ${other.name.toLowerCase()} services or mention both in your inquiry.</p><a class="text-link" href="/${other.slug}.html">Explore ${other.name} ↗</a></div></section>
<section class="section cta-section"><p class="eyebrow eyebrow-light">HAVE SOMETHING IN MIND?</p><h2>Let's make something<br><em>people remember.</em></h2><p>Tell us your vision, timeline, and budget. We'll confirm availability and send a custom quote.</p><a class="button primary" href="/contact.html#quote">Get a Quote <span aria-hidden="true">↗</span></a></section>
</main>${end()}`;
}

// ───────────────────────────── services overview (existing URL) ─────────────────────────────
function servicesPage() {
  const path = '/services.html';
  const block = (cat) => {
    const list = services.filter((s) => s.category === cat.slug);
    return `<div class="overview-block"><div class="section-heading"><div><p class="eyebrow">${cat.name.toUpperCase()}</p><h2>${esc(cat.name)}</h2></div><a href="/${cat.slug}.html" class="text-link">${cat.name} overview ↗</a></div><div class="service-grid">${list.map((s, i) => serviceCard(s, i)).join('')}</div></div>`;
  };
  return `${head({
    title: 'Photography & Video Production Services | Block Light Media',
    description:
      'Explore Block Light Media services including commercial video, corporate films, basketball video and photography, headshots and brand photography in Reading, PA.',
    path,
  })}${header('services')}<main id="main"><section class="page-hero"><p class="eyebrow">SERVICES / EXPLORE</p><h1>One vision.<br><em>Multiple ways to tell it.</em></h1><p>Pick the specific service you need. Every project starts with a clear conversation about your goals, timeline and deliverables.</p><div class="hero-buttons"><a class="button primary" href="/photography.html">Explore Photography <span aria-hidden="true">↗</span></a><a class="button primary" href="/videography.html">Explore Videography <span aria-hidden="true">↗</span></a></div></section><section class="section dark-section">${block(categories.photography)}${block(categories.videography)}<div class="inline-cta"><p>Not seeing the exact type of project you have in mind?</p><a class="button primary" href="/contact.html#quote">Get a Quote <span aria-hidden="true">↗</span></a></div></section></main>${end()}`;
}

// ───────────────────────────── contact form options ─────────────────────────────
function serviceOptions() {
  const group = (cat) =>
    `<optgroup label="${categories[cat].name}">${services
      .filter((s) => s.category === cat)
      .map((s) => `<option value="${esc(s.formValue)}" data-slug="${s.slug}">${esc(s.formLabel || s.formValue)}</option>`)
      .join('')}</optgroup>`;
  return `<option value="" disabled selected>Select a service</option>${group('photography')}${group('videography')}<option value="Photo + video package" data-slug="photo-video">Photo + video package</option><option>Other / not sure yet</option>`;
}

// ───────────────────────────── patch hand-written pages ─────────────────────────────
const handWritten = [
  ['index.html', 'home', '/'],
  ['about.html', 'about', '/about.html'],
  ['work.html', 'work', '/work.html'],
  ['contact.html', 'contact', '/contact.html'],
  ['thanks.html', '', null], // noindex, no canonical
];

function patch(file, active, canonicalPath) {
  const p = join(ROOT, file);
  let html = readFileSync(p, 'utf8');
  html = html.replace(/<header class="site-header">[\s\S]*?<\/header>/, header(active));
  html = html.replace(/<footer class="footer">[\s\S]*?<\/footer>/, footer());
  if (canonicalPath) {
    const tag = `<link rel="canonical" href="${url(canonicalPath)}">`;
    html = /<link rel="canonical"[^>]*>/.test(html)
      ? html.replace(/<link rel="canonical"[^>]*>/, tag)
      : html.replace('<link rel="icon"', `${tag}<link rel="icon"`);
  }
  if (file === 'contact.html') {
    html = html.replace(/(<select name="service"[^>]*>)[\s\S]*?(<\/select>)/, `$1${serviceOptions()}$2`);
  }
  writeFileSync(p, html);
}

// ───────────────────────────── sitemap ─────────────────────────────
function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const paths = [
    ['/', '1.0'],
    ['/photography.html', '0.9'],
    ['/videography.html', '0.9'],
    ['/services.html', '0.7'],
    ['/work.html', '0.7'],
    ['/about.html', '0.6'],
    ['/contact.html', '0.8'],
    ...services.map((s) => [pagePath(s.slug), s.featured ? '0.8' : '0.7']),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map(([p, pr]) => `  <url><loc>${url(p)}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
}

// ───────────────────────────── run ─────────────────────────────
const out = (f, c) => writeFileSync(join(ROOT, f), c);
for (const s of services) out(`${s.slug}.html`, servicePage(s));
for (const c of Object.values(categories)) out(`${c.slug}.html`, categoryPage(c));
out('services.html', servicesPage());
for (const args of handWritten) patch(...args);
out('sitemap.xml', sitemap());
out('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${url('/sitemap.xml')}\n`);

// Sanity checks: unique slugs, titles, descriptions, H1s
for (const key of ['slug', 'title', 'description', 'h1', 'formValue']) {
  const seen = new Set();
  for (const s of services) {
    if (seen.has(s[key])) throw new Error(`Duplicate ${key}: ${s[key]}`);
    seen.add(s[key]);
  }
}
console.log(`Built ${services.length} service pages, 2 category pages, services overview, sitemap.`);
