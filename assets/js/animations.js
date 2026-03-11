// ============================================================
//  animations.js — Scroll reveal, compteurs, barres, FAQ
// ============================================================

(function () {
  'use strict';

  // ── 1. Scroll Reveal ──────────────────────────────────────
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const revealEls = document.querySelectorAll(revealClasses.join(', '));

  const revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      // Déclencher les barres de compétences si dans cet élément
      entry.target.querySelectorAll('.comp-bar__fill[data-width]').forEach(animBar);

      // Déclencher les compteurs si dans cet élément
      entry.target.querySelectorAll('.chiffre__num[data-target]').forEach(animCounter);

      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { revealObs.observe(el); });


  // ── 2. Compteurs animés ───────────────────────────────────
  function animCounter(el) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start    = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Déclencher les compteurs qui seraient déjà visibles
  const counterObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.chiffre__num[data-target]').forEach(function (el) {
    counterObs.observe(el);
  });


  // ── 3. Barres de compétences ──────────────────────────────
  function animBar(fill) {
    if (fill.dataset.animated) return;
    fill.dataset.animated = '1';
    const w = fill.getAttribute('data-width');
    if (w) {
      setTimeout(function () { fill.style.width = w + '%'; }, 180);
    }
  }

  const barObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animBar(e.target);
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.comp-bar__fill[data-width]').forEach(function (el) {
    barObs.observe(el);
  });


  // ── 4. FAQ accordion ──────────────────────────────────────
  document.querySelectorAll('.faq-item__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Fermer tous
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
      });
      // Ouvrir celui cliqué (sauf si déjà ouvert)
      if (!wasOpen) item.classList.add('open');
    });
  });


  // ── 5. Smooth scroll ancres ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = (document.getElementById('nav') || { offsetHeight: 68 }).offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
