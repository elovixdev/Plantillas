// ── Reveal on scroll ────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Rail nav: scroll-spy ────────────────────────────────────
const sections = document.querySelectorAll('main section[id], .contacto[id]');
const railLinks = document.querySelectorAll('.rail a');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      railLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.rail a[data-target="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => spyObserver.observe(s));

// ── Mobile menu ──────────────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Acordeón servicios ───────────────────────────────────────
document.querySelectorAll('.acc-head').forEach(head => {
  head.addEventListener('click', () => {
    const item = head.closest('.acc-item');
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// ── Modal cursos ─────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
  document.body.style.overflow = '';
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(overlay.id); });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
  }
});