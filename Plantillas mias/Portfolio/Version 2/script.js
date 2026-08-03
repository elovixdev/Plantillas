document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------
     MENÚ MOBILE (overlay de la sidebar)
  ------------------------------------------------------ */
  const sidebar = document.getElementById('sidebar');
  const navToggle = document.getElementById('navToggle');

  navToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  document.querySelectorAll('.side-link').forEach(link => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menú');
    });
  });

  /* ------------------------------------------------------
     LINK ACTIVO SEGÚN SECCIÓN VISIBLE
  ------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const sideLinks = document.querySelectorAll('.side-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sideLinks.forEach(link => {
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
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------
     ACORDEÓN DE PROYECTOS
  ------------------------------------------------------ */
  document.querySelectorAll('.index-head').forEach(head => {
    head.addEventListener('click', () => {
      const row = head.closest('.index-row');
      const isOpen = row.classList.toggle('is-open');
      head.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* ------------------------------------------------------
     FILTRO DE PROYECTOS
  ------------------------------------------------------ */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const rows = document.querySelectorAll('.index-row');
  const filterEmpty = document.getElementById('filterEmpty');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      let visibleCount = 0;

      rows.forEach(row => {
        const match = filter === 'todos' || row.dataset.cat === filter;

        if (match) {
          visibleCount++;
          row.classList.remove('is-hidden', 'fading-out');
        } else {
          row.classList.remove('is-open');
          row.querySelector('.index-head').setAttribute('aria-expanded', 'false');
          row.classList.add('fading-out');
          setTimeout(() => row.classList.add('is-hidden'), 200);
        }
      });

      filterEmpty.hidden = visibleCount !== 0;
    });
  });

  /* ------------------------------------------------------
     BOTÓN VOLVER ARRIBA
  ------------------------------------------------------ */
  const toTopBtn = document.getElementById('toTop');
  toTopBtn.hidden = false;

  window.addEventListener('scroll', () => {
    toTopBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

});