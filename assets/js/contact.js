// ============================================================
//  contact.js — Formulaire de contact (fetch API)
// ============================================================

(function () {
  'use strict';

  const form     = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const feedback  = document.getElementById('formFeedback');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearFeedback();

    // Collecte des données
    const data = {
      name:    form.elements['name'].value.trim(),
      email:   form.elements['email'].value.trim(),
      project: form.elements['project'] ? form.elements['project'].value : '',
      budget:  form.elements['budget']  ? form.elements['budget'].value  : '',
      message: form.elements['message'].value.trim(),
    };

    // ── Validation côté client ───────────────────────────
    if (!data.name) {
      return showFeedback('err', 'Merci d\'indiquer votre nom.');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return showFeedback('err', 'L\'adresse email ne semble pas valide.');
    }
    if (!data.message || data.message.length < 20) {
      return showFeedback('err', 'Merci de décrire votre projet (min. 20 caractères).');
    }

    // ── Envoi ─────────────────────────────────────────────
    setLoading(true);

    try {
      const res = await fetch('https://formspree.io/f/xjgaweeb', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok) {
        showFeedback('ok', '✓ Message envoyé ! Je vous réponds sous 72 heures.');
        form.reset();
        form.querySelectorAll('select').forEach(function (s) { s.selectedIndex = 0; });
      } else {
        showFeedback('err', json.errors ? json.errors.map(e => e.message).join(', ') : 'Une erreur est survenue. Veuillez réessayer.');
      }
    } catch (err) {
      showFeedback('err', 'Impossible d\'envoyer le message. Vérifiez votre connexion et réessayez.');
      console.error('Formspree error:', err.message);
    } finally {
      setLoading(false);
    }
  });

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle('loading', on);
  }

  function showFeedback(type, msg) {
    feedback.textContent  = msg;
    feedback.className    = 'form__feedback show form__feedback--' + type;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearFeedback() {
    feedback.className   = 'form__feedback';
    feedback.textContent = '';
  }

  // Compteur de caractères pour le textarea message
  const textarea = form.elements['message'];
  const hint     = form.querySelector('.form-group__hint');
  if (textarea && hint) {
    textarea.addEventListener('input', function () {
      hint.textContent = textarea.value.length + ' / 1000 caractères';
    });
  }

})();
