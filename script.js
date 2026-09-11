/* BeeHouse public shell: fast first paint + bounded API loading. */
(function () {
  'use strict';

  function setupScrollSpy() {
    const update = () => {
      const links = document.querySelectorAll('.nav-item:not([target="_blank"])');
      const y = window.scrollY + 180;
      document.querySelectorAll('section[id]').forEach(section => {
        if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) {
          links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + section.id));
        }
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function finishLoading() {
    const loading = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    if (app) app.style.display = 'block';
    if (!loading) return;
    loading.classList.add('is-ready');
    window.setTimeout(() => loading.remove(), 260);
  }

  function setupPreloader() {
    const bar = document.getElementById('progress-bar');
    const txt = document.getElementById('progress-text');
    if (bar) bar.style.width = '100%';
    if (txt) txt.textContent = 'พร้อมใช้งาน';

    // Never wait for a remote API forever. The CMS itself falls back to the
    // bundled default data when the backend is unavailable.
    const started = performance.now();
    const hardLimit = window.setTimeout(finishLoading, 1200);
    window.addEventListener('beehouse:ready', () => {
      const elapsed = performance.now() - started;
      window.clearTimeout(hardLimit);
      window.setTimeout(finishLoading, Math.max(120, Math.min(500, 420 - elapsed)));
    }, { once: true });

    window.addEventListener('beehouse:api-unavailable', () => {
      window.clearTimeout(hardLimit);
      window.setTimeout(finishLoading, 80);
    }, { once: true });
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupScrollSpy();
    setupPreloader();
  }, { once: true });
})();
