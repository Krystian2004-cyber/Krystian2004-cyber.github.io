(() => {
  'use strict';

  /* ---- Mobile menu ---- */
  const menu = document.getElementById('mobile-menu');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeEls = document.querySelectorAll('[data-menu-close]');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  openBtn.addEventListener('click', () => setMenu(true));
  closeEls.forEach((el) => el.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ---- Active section highlight in the nav ---- */
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = ['start', 'wspolpraca', 'skala', 'grupa', 'model', 'zarzad', 'faq', 'kontakt']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  }

  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((el) => sectionObserver.observe(el));
  }

  /* ---- Reveal on scroll ---- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion) {
    revealEls.forEach((el) => el.setAttribute('data-reveal', 'in'));
  } else if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---- Contact form ---- */
  const form = document.querySelector('[data-contact-form]');
  const successPanel = document.querySelector('[data-contact-success]');
  const resetBtn = document.querySelector('[data-contact-reset]');
  const modelSelect = document.querySelector('[data-model-select]');
  const messageField = document.querySelector('[data-message-field]');

  const placeholders = {
    A: 'Jaką skalę zaangażowania i horyzont rozważasz?',
    B: 'Jaka skala projektu i jaki typ nieruchomości Cię interesują?',
    C: 'Opisz swoje doświadczenie transakcyjne i obszar, na którym działasz.',
    X: 'Opisz krótko, czego dotyczy Twoje zapytanie.'
  };

  if (modelSelect && messageField) {
    modelSelect.addEventListener('change', () => {
      messageField.placeholder = placeholders[modelSelect.value] || placeholders.X;
    });
  }

  function setFieldError(name, message) {
    const field = form.querySelector('[data-field="' + name + '"]');
    if (!field) return;
    const errorEl = field.querySelector('[data-error]');
    if (message) {
      field.setAttribute('data-invalid', 'true');
      if (errorEl) errorEl.textContent = message;
    } else {
      field.removeAttribute('data-invalid');
      if (errorEl) errorEl.textContent = '';
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.target;
      const v = (n) => (f.elements[n] ? String(f.elements[n].value || '').trim() : '');
      let hasError = false;

      const checks = [
        ['name', v('name').length < 3, 'Podaj imię i nazwisko.'],
        ['email', !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v('email')), 'Podaj poprawny adres e-mail.'],
        ['phone', v('phone').replace(/[^0-9]/g, '').length < 9, 'Podaj numer telefonu (min. 9 cyfr).'],
        ['message', v('message').length < 20, 'Opisz sprawę — minimum 20 znaków.'],
        ['rodo', !f.elements['rodo'] || !f.elements['rodo'].checked, 'Zgoda na przetwarzanie danych jest wymagana.']
      ];

      checks.forEach(([name, invalid, message]) => {
        if (invalid) hasError = true;
        setFieldError(name, invalid ? message : '');
      });

      if (hasError) return;

      // TODO backend: wyślij dane formularza na własny endpoint (np. fetch POST /api/kontakt)
      form.hidden = true;
      successPanel.classList.add('is-visible');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.hidden = false;
      successPanel.classList.remove('is-visible');
      ['name', 'email', 'phone', 'message', 'rodo'].forEach((name) => setFieldError(name, ''));
      if (messageField) messageField.placeholder = placeholders.A;
    });
  }
})();
