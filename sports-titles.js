/* Replace sports portfolio fallback labels with official titles from YouTube. */
(() => {
  'use strict';
  const items = [...document.querySelectorAll('[data-sports-youtube-title]')];
  if (!items.length) return;
  fetch('/.netlify/functions/sports-video-titles', { credentials: 'same-origin' })
    .then((response) => { if (!response.ok) throw new Error('Metadata unavailable'); return response.json(); })
    .then(({ titles }) => {
      if (!titles || typeof titles !== 'object') return;
      items.forEach((heading) => {
        const id = heading.dataset.sportsYoutubeTitle;
        const title = titles[id];
        if (typeof title !== 'string' || !title.trim()) return;
        heading.textContent = title.trim();
        const player = heading.closest('.hub-video')?.querySelector('iframe');
        if (player) player.title = title.trim();
      });
    })
    .catch(() => {
      // The embedded YouTube player still exposes the video's title and
      // the fallback link opens the official watch page. Never invent titles.
    });
})();
