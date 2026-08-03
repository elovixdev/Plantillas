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

// ── Nav: mobile drawer ──────────────────────────────────────
const navBurger = document.getElementById('navBurger');
const navDrawer = document.getElementById('navDrawer');
navBurger.addEventListener('click', () => {
  const open = navDrawer.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', open);
});
navDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navDrawer.classList.remove('open');
  navBurger.setAttribute('aria-expanded', 'false');
}));

// ── Nav: scroll-spy (resalta la sección activa) ─────────────
const sections = document.querySelectorAll('main > section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-nav]');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[data-nav="${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => spyObserver.observe(s));

// ── Acordeón: mantener uno abierto a la vez (opcional) ──────
const accItems = document.querySelectorAll('.acc-item');
accItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      accItems.forEach(other => { if (other !== item) other.open = false; });
    }
  });
});

// ── Testimonios (carrusel) ──────────────────────────────────
const voces = [
  { text: 'Llegué agotada y salí de la sesión con una calma que hacía mucho no sentía.', author: '— Nombre Apellido' },
  { text: 'El curso me dio herramientas concretas y mucha contención en cada clase.', author: '— Nombre Apellido' },
  { text: 'La limpieza energética de mi casa cambió por completo el ambiente.', author: '— Nombre Apellido' },
  { text: 'Un espacio de escucha real, sin juicio. Volvería siempre.', author: '— Nombre Apellido' }
];
let voiceIndex = 0;
const voiceText = document.getElementById('voiceText');
const voiceAuthor = document.getElementById('voiceAuthor');
const voiceDots = document.getElementById('voiceDots');

voces.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.setAttribute('aria-label', `Ver testimonio ${i + 1}`);
  dot.addEventListener('click', () => showVoice(i));
  voiceDots.appendChild(dot);
});

function showVoice(i) {
  voiceIndex = (i + voces.length) % voces.length;
  voiceText.style.opacity = '0';
  voiceAuthor.style.opacity = '0';
  setTimeout(() => {
    voiceText.textContent = voces[voiceIndex].text;
    voiceAuthor.textContent = voces[voiceIndex].author;
    voiceText.style.opacity = '1';
    voiceAuthor.style.opacity = '1';
  }, 200);
  [...voiceDots.children].forEach((d, idx) => d.classList.toggle('active', idx === voiceIndex));
}

document.getElementById('voicePrev').addEventListener('click', () => showVoice(voiceIndex - 1));
document.getElementById('voiceNext').addEventListener('click', () => showVoice(voiceIndex + 1));