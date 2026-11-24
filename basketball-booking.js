/* Block Light Media basketball calendar. Do not insert real availability or payments into fake slots.
 * Connect paid Calendly event-type URLs only after payments and cancellation terms have been tested.
 */
(() => {
  'use strict';
  const BOOKING_LINKS = Object.freeze({
    'individual-photo': '', // Paste the approved individual game photo Calendly event type URL
    'team-photo': '',       // Paste the approved team game photo Calendly event type URL
    'individual-video': '', // Paste the approved individual game video Calendly event type URL
    'team-video': ''        // Paste the approved team game video Calendly event type URL
  });
  const PACKAGE_INFO = Object.freeze({
    'individual-photo': { name: 'Player Game Photos', deposit: 100, type: 'basketball-photographer-reading-pa' },
    'team-photo': { name: 'Team Game Photos', deposit: 150, type: 'basketball-photographer-reading-pa' },
    'individual-video': { name: 'Player Highlight Video', deposit: 150, type: 'basketball-videographer-reading-pa' },
    'team-video': { name: 'Team Highlight Video', deposit: 200, type: 'basketball-videographer-reading-pa' }
  });
  const cards = [...document.querySelectorAll('[data-package]')];
  const embed = document.getElementById('booking-calendly');
  const fallback = document.getElementById('booking-unavailable');
  const summary = document.getElementById('booking-selected-summary');
  const contact = document.getElementById('booking-fallback');
  if (!cards.length || !embed || !fallback || !summary || !contact) return;
  let active = '';
  let scriptPromise;
  const isSafeUrl = (value) => {
    try { const u = new URL(value); return u.protocol === 'https:' && (u.hostname === 'calendly.com' || u.hostname.endsWith('.calendly.com')); } catch { return false; }
  };
  const loadCalendly = () => {
    if (window.Calendly?.initInlineWidget) return Promise.resolve();
    if (!scriptPromise) {
      scriptPromise = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://assets.calendly.com/assets/external/widget.js';
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return scriptPromise;
  };
  const show = async (key) => {
    if (!PACKAGE_INFO[key]) return;
    active = key;
    cards.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.package === key)));
    const info = PACKAGE_INFO[key];
    summary.textContent = info.name + ' — $' + info.deposit + ' deposit';
    contact.href = '/contact.html?service=' + encodeURIComponent(info.type) + '#quote';
    const link = BOOKING_LINKS[key];
    embed.replaceChildren();
    if (!isSafeUrl(link)) {
      embed.hidden = true;
      fallback.hidden = false;
      return;
    }
    fallback.hidden = true;
    embed.hidden = false;
    try {
      await loadCalendly();
      if (active !== key) return;
      embed.replaceChildren();
      window.Calendly.initInlineWidget({url: link, parentElement: embed, resize: true});
    } catch (_) {
      embed.hidden = true;
      fallback.hidden = false;
    }
  };
  cards.forEach(c => c.addEventListener('click', () => show(c.dataset.package)));
  const initial = new URLSearchParams(location.search).get('package');
  show(PACKAGE_INFO[initial] ? initial : 'individual-photo');
})();