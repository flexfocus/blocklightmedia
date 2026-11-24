/* Block Light Media — site script (no dependencies).
   Each feature is a small self-contained block that only runs when its
   markup exists on the page. Add new features as new blocks. */
(() => {
  'use strict';

  /* ── Mobile navigation (original behaviour) ── */
  const menu = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (menu && nav) {
    const close = () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    };
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  /* ── Contact form: no past dates (original behaviour) ── */
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    const t = new Date();
    dateInput.min = [t.getFullYear(), String(t.getMonth() + 1).padStart(2, '0'), String(t.getDate()).padStart(2, '0')].join('-');
  }

  /* ── Contact form: preselect service from ?service=<page-slug> ──
     Service pages link to /contact.html?service=<slug>#quote. The <option>
     carries data-slug; its value is what Netlify stores. */
  const select = document.getElementById('serviceSelect');
  if (select) {
    const slug = new URLSearchParams(location.search).get('service');
    const opt = slug && [...select.options].find((o) => o.dataset.slug === slug);
    if (opt) {
      opt.selected = true;
      const ref = select.form.querySelector('input[name="referring-service"]');
      if (ref) ref.value = slug;
      const note = document.getElementById('servicePreselect');
      if (note) {
        note.textContent = `Service selected: ${opt.textContent}. You can change it below.`;
        note.hidden = false;
      }
    }
  }

  /* ── Portfolio filters ──
     Buttons stay hidden without JS so every project remains visible. */
  const filterBar = document.querySelector('.portfolio-filters');
  if (filterBar) {
    const items = [...document.querySelectorAll('.portfolio-item')];
    const empty = document.querySelector('.filter-empty');
    filterBar.hidden = false;
    const apply = (f) => {
      let shown = 0;
      items.forEach((el) => {
        const match = f === 'all' || el.dataset.categories.split(/\s+/).includes(f);
        el.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      filterBar.querySelectorAll('.filter-btn').forEach((b) => {
        const on = b.dataset.filter === f;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    };
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (btn) apply(btn.dataset.filter);
    });
    const initial = new URLSearchParams(location.search).get('filter');
    if (initial && filterBar.querySelector(`[data-filter="${CSS.escape(initial)}"]`)) apply(initial);
  }

  /* ── Scroll reveal (respects reduced motion) ──
     Elements with .reveal fade up as they enter the viewport. Swap this block
     for a richer animation library later without touching page markup. */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }


  /* Portfolio video gallery: load YouTube only after visitor presses play. */
  const videoDialog = document.getElementById('showcaseVideoDialog');
  const videoPlayer = document.getElementById('showcaseDialogPlayer');
  const videoLink = document.getElementById('showcaseDialogLink');
  if (videoDialog && videoPlayer && videoLink && typeof videoDialog.showModal === 'function') {
    const allowedIds = new Set(["oDHfoNzikMs","y_e1PIe9Qqs","ly8tHvCf37g","edYa5RIaICA","erreYvxjd5o","piOQQNpDo6w","YJ_BChpk0Ms"]);
    document.querySelectorAll('[data-youtube-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.getAttribute('data-youtube-id');
        if (!allowedIds.has(id)) return;
        const frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1';
        frame.title = button.getAttribute('aria-label') || 'Portfolio video';
        frame.allow = 'autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        videoPlayer.replaceChildren(frame);
        videoLink.href = 'https://www.youtube.com/watch?v=' + id;
        videoDialog.showModal();
      });
    });
    const closeVideo = () => { if (videoDialog.open) videoDialog.close(); };
    videoDialog.querySelector('[data-close-video]').addEventListener('click', closeVideo);
    videoDialog.addEventListener('close', () => videoPlayer.replaceChildren());
    videoDialog.addEventListener('click', (event) => { if (event.target === videoDialog) closeVideo(); });
  }

  /* ── Future integrations ──
     window.BLM_INTEGRATIONS is intentionally empty. When a scheduling,
     payment, contract, social or storefront provider is connected, register a
     module here (see site-src/INTEGRATIONS.md). Nothing loads until then. */
  window.BLM_INTEGRATIONS = window.BLM_INTEGRATIONS || {};
  Object.values(window.BLM_INTEGRATIONS).forEach((mod) => {
    try { if (mod && typeof mod.init === 'function') mod.init(); } catch (err) { console.error(err); }
  });
})();
