// ── Reveal on scroll ────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ── Progress nav: scroll-spy ────────────────────────────────
const chapters = document.querySelectorAll('.cap[id]');
const progressLinks = document.querySelectorAll('.progress a');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      progressLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.progress a[data-target="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });
chapters.forEach(c => spyObserver.observe(c));

// ── Drop menu ────────────────────────────────────────────────
const burger = document.getElementById('burger');
const dropMenu = document.getElementById('dropMenu');
burger.addEventListener('click', () => dropMenu.classList.toggle('open'));
dropMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => dropMenu.classList.remove('open')));

// ── Cursor glow (solo capítulo 1, desktop) ─────────────────
const hero = document.getElementById('cap-01');
const glow = document.getElementById('cursorGlow');
if (window.matchMedia('(hover: hover)').matches) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top = (e.clientY - rect.top) + 'px';
    glow.style.opacity = '1';
  });
  hero.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
} else {
  glow.style.display = 'none';
}

// ── Flip cards (tap en táctil) ──────────────────────────────
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches) {
      card.classList.toggle('is-flipped');
    }
  });
});

// ── Testimonio spotlight ─────────────────────────────────────
const testimonios = [
  { text: '“Llegué agotada y salí de la sesión con una calma que hacía mucho no sentía.”', author: '— Nombre Apellido' },
  { text: '“El curso me dio herramientas concretas y mucha contención en cada clase.”', author: '— Nombre Apellido' },
  { text: '“La limpieza energética de mi casa cambió por completo el ambiente.”', author: '— Nombre Apellido' },
  { text: '“Un espacio de escucha real, sin juicio. Volvería siempre.”', author: '— Nombre Apellido' }
];
let spotIndex = 0;
const spotText = document.getElementById('spotText');
const spotAuthor = document.getElementById('spotAuthor');
const spotDots = document.getElementById('spotDots');

testimonios.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showTestimonio(i));
  spotDots.appendChild(dot);
});

function showTestimonio(i) {
  spotIndex = (i + testimonios.length) % testimonios.length;
  spotText.style.opacity = '0';
  spotAuthor.style.opacity = '0';
  setTimeout(() => {
    spotText.textContent = testimonios[spotIndex].text;
    spotAuthor.textContent = testimonios[spotIndex].author;
    spotText.style.opacity = '1';
    spotAuthor.style.opacity = '1';
  }, 220);
  [...spotDots.children].forEach((d, idx) => d.classList.toggle('active', idx === spotIndex));
}

document.getElementById('spotPrev').addEventListener('click', () => showTestimonio(spotIndex - 1));
document.getElementById('spotNext').addEventListener('click', () => showTestimonio(spotIndex + 1));

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