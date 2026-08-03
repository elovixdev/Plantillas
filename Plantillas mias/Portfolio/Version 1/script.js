document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------
     NAV: fondo al hacer scroll + botón volver arriba
  ------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const toTopBtn = document.getElementById('toTop');
  toTopBtn.hidden = false;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    toTopBtn.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------
     NAV: menú mobile
  ------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

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
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');
  const filterEmpty = document.getElementById('filterEmpty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
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

  /* ------------------------------------------------------
     HERO: parallax suave del mockup con el mouse
  ------------------------------------------------------ */
  const heroVisual = document.getElementById('heroVisual');
  const browserChrome = heroVisual ? heroVisual.querySelector('.browser-chrome') : null;

  if (heroVisual && browserChrome && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      browserChrome.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      browserChrome.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ------------------------------------------------------
     BOTÓN VOLVER ARRIBA
  ------------------------------------------------------ */
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

});