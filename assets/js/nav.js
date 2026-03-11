// ============================================================
//  nav.js — Navigation one-page : burger, scroll spy, ancres
// ============================================================

(function () {
  'use strict';

  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobile = document.getElementById('navMobile');

  // ── Scroll : ombre sur la nav ───────────────────────────
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Burger menu ─────────────────────────────────────────
  if (burger && mobile) {
    burger.addEventListener('click', function () {
      const isOpen = mobile.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer sur clic d'un lien
    mobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobile.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Fermer sur clic en dehors
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && mobile.classList.contains('open')) {
        mobile.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Smooth scroll sur les ancres ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Scroll Spy : lien actif selon section visible ────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"], .nav__mobile a[href^="#"]');

  const spyObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(function (link) {
        const match = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', match);
      });
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(function (s) { spyObs.observe(s); });

})();
