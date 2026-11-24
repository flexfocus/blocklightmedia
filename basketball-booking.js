/* TidyCal Free booking embeds. No booking type is enabled unless its real URL is configured.
 * Paid TidyCal booking types should charge the deposit amount (not the package total).
 * Remaining balance is collected later separately through a confirmed invoice.
 */
(() => {
  'use strict';

  const BOOKING_LINKS = Object.freeze({
    'individual-photo': '', // https://tidycal.com/YOURNAME/player-game-photos
    'team-photo': '',       // https://tidycal.com/YOURNAME/team-game-photos
    'individual-video': '', // https://tidycal.com/YOURNAME/player-highlight-video
    'team-video': ''        // https://tidycal.com/YOURNAME/team-highlight-video
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

  const getPath = (raw) => {
    try {
      const url = new URL(raw);
      if (url.protocol !== 'https:' || url.hostname !== 'tidycal.com' || url.search || url.hash) return '';
      const path = url.pathname.replace(/^\/+|\/+$/g, '');
      return /^[a-z0-9_-]+\/[a-z0-9_-]+$/i.test(path) ? path : '';
    } catch { return ''; }
  };

  // Insert every approved booking type before the TidyCal embed loader runs.
  // TidyCal initializes existing .tidycal-embed nodes when its script loads.
  const available = {};
  for (const key of Object.keys(PACKAGE_INFO)) {
    const path = getPath(BOOKING_LINKS[key]);
    if (!path) continue;
    const wrapper = document.createElement('div');
    wrapper.dataset.bookType = key;
    wrapper.hidden = true;
    const node = document.createElement('div');
    node.className = 'tidycal-embed';
    node.dataset.path = path;
    node.dataset.showavatar = 'false';
    wrapper.appendChild(node);
    embed.appendChild(wrapper);
    available[key] = wrapper;
  }
  if (Object.keys(available).length) {
    const script = document.createElement('script');
    script.src = 'https://asset-tidycal.b-cdn.net/js/embed.js';
    script.async = true;
    script.onerror = () => {
      for (const wrapper of Object.values(available)) wrapper.hidden = true;
      embed.hidden = true;
      fallback.hidden = false;
    };
    document.head.appendChild(script);
  }

  function select(key) {
    if (!PACKAGE_INFO[key]) return;
    cards.forEach(card => card.setAttribute('aria-pressed', String(card.dataset.package === key)));
    const info = PACKAGE_INFO[key];
    summary.textContent = info.name + ' — $' + info.deposit + ' deposit';
    contact.href = '/contact.html?service=' + encodeURIComponent(info.type) + '#quote';
    for (const wrapper of Object.values(available)) wrapper.hidden = true;
    if (available[key]) {
      available[key].hidden = false;
      embed.hidden = false;
      fallback.hidden = true;
    } else {
      embed.hidden = true;
      fallback.hidden = false;
    }
  }

  cards.forEach(card => card.addEventListener('click', () => select(card.dataset.package)));
  const selected = new URLSearchParams(window.location.search).get('package');
  select(PACKAGE_INFO[selected] ? selected : 'individual-photo');
})();