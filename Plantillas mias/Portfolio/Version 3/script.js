document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------
     MENÚ FULL SCREEN
  ------------------------------------------------------ */
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');

  const openMenu = () => {
    menuOverlay.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    menuOverlay.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  document.querySelectorAll('[data-menu-link]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

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
     GALERÍA: drag to scroll + flechas + progreso
  ------------------------------------------------------ */
  const gallery = document.getElementById('gallery');
  const progressBar = document.getElementById('galleryProgressBar');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  gallery.addEventListener('mousedown', (e) => {
    isDown = true;
    gallery.classList.add('dragging');
    startX = e.pageX;
    scrollLeftStart = gallery.scrollLeft;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    gallery.classList.remove('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.pageX - startX;
    gallery.scrollLeft = scrollLeftStart - dx;
  });

  const updateProgress = () => {
    const max = gallery.scrollWidth - gallery.clientWidth;
    const pct = max > 0 ? (gallery.scrollLeft / max) * 100 : 0;
    progressBar.style.width = Math.max(8, pct) + '%';
  };
  gallery.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const scrollByCard = (dir) => {
    const card = gallery.querySelector('.g-card:not(.is-hidden)');
    const step = card ? card.getBoundingClientRect().width + 24 : 340;
    gallery.scrollBy({ left: dir * step, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };
  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

  /* ------------------------------------------------------
     FILTRO DE PROYECTOS
  ------------------------------------------------------ */
  const filterChips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.g-card');
  const filterEmpty = document.getElementById('filterEmpty');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      let visibleCount = 0;

      cards.forEach(card => {
        const match = filter === 'todos' || card.dataset.cat === filter;
        if (match) {
          visibleCount++;
          card.classList.remove('is-hidden', 'fading-out');
        } else {
          card.classList.add('fading-out');
          setTimeout(() => card.classList.add('is-hidden'), 200);
        }
      });

      gallery.scrollTo({ left: 0, behavior: 'auto' });
      filterEmpty.hidden = visibleCount !== 0;
      setTimeout(updateProgress, 250);
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