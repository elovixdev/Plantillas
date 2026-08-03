// ── Nav: fondo al hacer scroll ─────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Menú móvil ──────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ── Reveal on scroll (con pequeño stagger entre hermanos) ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children].filter(el =>
        el.classList.contains('reveal') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')
      );
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('revealed'), idx * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Círculo de respiración (elemento signature del hero) ───
// El anillo late con una animación CSS de 12s (4s inhalar / 4s sostener / 4s exhalar).
// Este script solo sincroniza el texto con esas mismas proporciones.
const breathLabel = document.getElementById('breathLabel');
if (breathLabel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const phases = [
    { text: 'Inhalá',  duration: 4000 },
    { text: 'Sostené', duration: 4000 },
    { text: 'Exhalá',  duration: 4000 },
  ];
  let phaseIndex = 0;
  function nextPhase() {
    breathLabel.style.opacity = '0';
    setTimeout(() => {
      breathLabel.textContent = phases[phaseIndex].text;
      breathLabel.style.opacity = '1';
    }, 200);
    setTimeout(nextPhase, phases[phaseIndex].duration);
    phaseIndex = (phaseIndex + 1) % phases.length;
  }
  breathLabel.style.transition = 'opacity 0.3s ease';
  nextPhase();
}

// ── Testimonios: puntos de navegación sincronizados al scroll ─
const testTrack = document.getElementById('testTrack');
const testDotsWrap = document.getElementById('testDots');
if (testTrack && testDotsWrap) {
  const cards = [...testTrack.children];
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
    testDotsWrap.appendChild(dot);
  });
  const dots = [...testDotsWrap.children];

  const dotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = cards.indexOf(entry.target);
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
    });
  }, { root: testTrack, threshold: 0.6 });
  cards.forEach(c => dotObserver.observe(c));
}

// ── Modal de curso ───────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
  }
});