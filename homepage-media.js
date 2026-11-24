/* Lightweight homepage motion preview. YouTube loads only on desktop hover/focus. */
(() => {
  'use strict';
  const card = document.querySelector('[data-home-video-card]');
  const slot = card?.querySelector('[data-home-video-slot]');
  if (!card || !slot || !window.matchMedia) return;

  // Mobile/touch and reduced-motion visitors get a static poster with a normal link.
  const capable = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!capable) return;

  const previewId = 'ECPoGkHQarI'; // Client-provided music-video production
  let active = false;

  const start = () => {
    if (active) return;
    active = true;
    const frame = document.createElement('iframe');
    frame.title = 'Muted music video preview';
    frame.tabIndex = -1;
    frame.setAttribute('aria-hidden', 'true');
    frame.allow = 'autoplay; encrypted-media; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.src = 'https://www.youtube-nocookie.com/embed/' + previewId
      + '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + previewId
      + '&playsinline=1&rel=0&disablekb=1';
    frame.addEventListener('load', () => {
      if (active) slot.classList.add('is-playing');
    }, { once: true });
    slot.replaceChildren(frame);
  };

  const stop = () => {
    active = false;
    slot.classList.remove('is-playing');
    slot.replaceChildren();
  };

  card.addEventListener('mouseenter', start);
  card.addEventListener('mouseleave', stop);
  card.addEventListener('focusin', start);
  card.addEventListener('focusout', (event) => {
    if (!card.contains(event.relatedTarget)) stop();
  });
})();
