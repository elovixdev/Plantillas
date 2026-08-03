document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------
     NAV: menú mobile + botón volver arriba
  ------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const toTopBtn = document.getElementById('toTop');
  toTopBtn.hidden = false;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });

  window.addEventListener('scroll', () => {
    toTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  /* ------------------------------------------------------
     NAV: link activo según la sección visible
  ------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ------------------------------------------------------
     SCROLL REVEAL
  ------------------------------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.closest('.cards-grid') ? (i % 6) * 60 : 0;
          setTimeout(() => el.classList.add('is-visible'), delay);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------
     FILTRO DE PROYECTOS
  ------------------------------------------------------ */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.card');
  const filterEmpty = document.getElementById('filterEmpty');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      let visibleCount = 0;

      cards.forEach(card => {
        const match = filter === 'todos' || card.dataset.cat === filter;
        if (match) {
          visibleCount++;
          card.classList.remove('is-hidden', 'fading-out');
        } else {
          card.classList.add('fading-out');
          setTimeout(() => card.classList.add('is-hidden'), 250);
        }
      });

      filterEmpty.hidden = visibleCount !== 0;
    });
  });

});