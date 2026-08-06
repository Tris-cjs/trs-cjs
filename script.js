const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');
const themeToggle = document.querySelector('#theme-toggle');

let pageEnterTransition = 'zoom-in';
try {
  pageEnterTransition = sessionStorage.getItem('tristan-page-transition') || 'zoom-in';
  sessionStorage.removeItem('tristan-page-transition');
} catch (error) {
  pageEnterTransition = 'zoom-in';
}
document.body.classList.add(`page-enter-${pageEnterTransition}`);

document.querySelectorAll('a[data-transition]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || link.target === '_blank') return;

    const target = new URL(href, window.location.href);
    if (target.origin !== window.location.origin || target.pathname === window.location.pathname) return;

    event.preventDefault();
    const transition = link.dataset.transition || 'zoom-in';
    try { sessionStorage.setItem('tristan-page-transition', transition); } catch (error) { /* Continue without saved transition state. */ }
    document.body.classList.add(`page-exit-${transition}`);
    window.setTimeout(() => { window.location.assign(target.href); }, 520);
  });
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const storedTheme = localStorage.getItem('tristan-theme');
if (storedTheme === 'dark') document.body.classList.add('dark');
const initialDark = document.body.classList.contains('dark');
themeToggle?.setAttribute('aria-checked', String(initialDark));
themeToggle?.setAttribute('aria-label', initialDark ? 'Switch to light mode' : 'Switch to dark mode');

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('tristan-theme', isDark ? 'dark' : 'light');
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  themeToggle.setAttribute('aria-checked', String(isDark));
});

const particleCanvas = document.querySelector('#particle-field');
const particleContext = particleCanvas?.getContext('2d');
const heroReel = document.querySelector('.hero-reel');
const particleField = {
  width: 0,
  height: 0,
  points: [],
  pointer: { x: 0, y: 0, active: false },
};

function createParticlePoints() {
  if (!particleCanvas) return;
  const centerX = particleField.width / 2;
  const centerY = particleField.height / 2;
  const spread = Math.min(particleField.width, particleField.height) * 0.25;
  const count = Math.min(360, Math.max(180, Math.round((particleField.width * particleField.height) / 720)));

  particleField.points = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.pow(Math.random(), 0.58) * spread;
    return {
      baseX: centerX + Math.cos(angle) * distance,
      baseY: centerY + Math.sin(angle) * distance * 0.78,
      drift: 1 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      size: 0.7 + Math.random() * 1.4,
      opacity: 0.42 + Math.random() * 0.5,
    };
  });
}

function resizeParticleField() {
  if (!particleCanvas || !particleContext) return;
  const bounds = particleCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  particleField.width = bounds.width;
  particleField.height = bounds.height;
  particleCanvas.width = Math.round(bounds.width * pixelRatio);
  particleCanvas.height = Math.round(bounds.height * pixelRatio);
  particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticlePoints();
}

function drawParticles(time) {
  if (!particleCanvas || !particleContext) return;
  particleContext.clearRect(0, 0, particleField.width, particleField.height);
  const isDarkMode = document.body.classList.contains('dark');

  particleField.points.forEach((point) => {
    let x = point.baseX + Math.sin(time * 0.0007 + point.phase) * point.drift;
    let y = point.baseY + Math.cos(time * 0.00055 + point.phase) * point.drift;
    const deltaX = particleField.pointer.x - x;
    const deltaY = particleField.pointer.y - y;
    const distance = Math.hypot(deltaX, deltaY);
    const influence = particleField.pointer.active ? Math.max(0, 1 - distance / 78) : 0;

    if (influence > 0) {
      const push = influence * 13;
      x -= (deltaX / Math.max(distance, 1)) * push;
      y -= (deltaY / Math.max(distance, 1)) * push;
    }

    particleContext.beginPath();
    particleContext.arc(x, y, point.size + influence * 1.1, 0, Math.PI * 2);
    particleContext.fillStyle = influence > 0.12
      ? `rgba(217, 255, 66, ${0.42 + influence * 0.58})`
      : isDarkMode
        ? `rgba(184, 184, 178, ${point.opacity})`
        : `rgba(17, 17, 17, ${point.opacity})`;
    particleContext.fill();
  });

  requestAnimationFrame(drawParticles);
}

if (particleCanvas && particleContext) {
  resizeParticleField();
  window.addEventListener('resize', resizeParticleField, { passive: true });
  const updateParticlePointer = (event) => {
    const bounds = particleCanvas.getBoundingClientRect();
    particleField.pointer.x = event.clientX - bounds.left;
    particleField.pointer.y = event.clientY - bounds.top;
    particleField.pointer.active = true;
  };
  (heroReel || particleCanvas).addEventListener('pointerenter', updateParticlePointer);
  (heroReel || particleCanvas).addEventListener('pointermove', updateParticlePointer);
  (heroReel || particleCanvas).addEventListener('pointerleave', () => { particleField.pointer.active = false; });
  requestAnimationFrame(drawParticles);
}

const orbitStates = [...document.querySelectorAll('.orbit-path')].map((path) => ({
  path,
  logo: path.querySelector('.orbit-logo'),
  radius: parseFloat(getComputedStyle(path).getPropertyValue('--radius')) || 180,
  scale: parseFloat(getComputedStyle(path).getPropertyValue('--orbit-scale')) || 1,
  angle: Math.random() * Math.PI * 2,
  travel: Math.random() * Math.PI * 2,
  velocity: 0,
  direction: 1,
  radiusY: 0.72,
  offsetX: 0,
  offsetY: 0,
  velocityX: 0,
  velocityY: 0,
  lastTime: 0,
}));

function randomizeOrbitVelocity(orbit) {
  orbit.direction = Math.random() < 0.5 ? -1 : 1;
  orbit.velocity = orbit.direction * (0.00028 + Math.random() * 0.00042);
  orbit.radiusY = 0.66 + Math.random() * 0.2;
}

function getOrbitBasePosition(orbit) {
  return {
    x: Math.cos(orbit.angle) * orbit.radius * orbit.scale,
    y: Math.sin(orbit.angle) * orbit.radius * orbit.radiusY * orbit.scale,
  };
}

function renderOrbit(orbit, x, y) {
  const depth = Math.sin(orbit.angle);
  const scale = 0.8 + ((depth + 1) / 2) * 0.24;
  const opacity = 0.76 + ((depth + 1) / 2) * 0.24;

  orbit.path.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${(depth * 40 * orbit.scale).toFixed(2)}px)`;
  orbit.path.style.zIndex = depth > 0 ? '3' : '1';
  orbit.logo.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
  orbit.logo.style.opacity = opacity.toFixed(3);
}

function updateOrbitInteractions(step) {
  const positions = orbitStates.map((orbit) => {
    const base = getOrbitBasePosition(orbit);
    return { orbit, x: base.x + orbit.offsetX, y: base.y + orbit.offsetY };
  });
  const pointerX = particleField.pointer.x - particleField.width / 2;
  const pointerY = particleField.pointer.y - particleField.height / 2;

  positions.forEach(({ orbit, x, y }) => {
    if (particleField.pointer.active) {
      const deltaX = x - pointerX;
      const deltaY = y - pointerY;
      const distance = Math.hypot(deltaX, deltaY);
      const repelRadius = 132;

      if (distance < repelRadius) {
        const falloff = (repelRadius - distance) / repelRadius;
        const strength = falloff * 2.8 * step;
        orbit.velocityX += (deltaX / Math.max(distance, 1)) * strength;
        orbit.velocityY += (deltaY / Math.max(distance, 1)) * strength;
      }
    }
  });

  for (let first = 0; first < positions.length; first += 1) {
    for (let second = first + 1; second < positions.length; second += 1) {
      const a = positions[first];
      const b = positions[second];
      const deltaX = a.x - b.x;
      const deltaY = a.y - b.y;
      const distance = Math.hypot(deltaX, deltaY);
      const minimumDistance = 76 * ((a.orbit.logo.offsetWidth / 76) + (b.orbit.logo.offsetWidth / 76)) / 2;

      if (distance < minimumDistance) {
        const overlap = minimumDistance - distance;
        const normalX = deltaX / Math.max(distance, 1);
        const normalY = deltaY / Math.max(distance, 1);
        const impulse = overlap * 0.085 * step;
        a.orbit.velocityX += normalX * impulse;
        a.orbit.velocityY += normalY * impulse;
        b.orbit.velocityX -= normalX * impulse;
        b.orbit.velocityY -= normalY * impulse;
      }
    }
  }

  orbitStates.forEach((orbit) => {
    orbit.velocityX += -orbit.offsetX * 0.018 * step;
    orbit.velocityY += -orbit.offsetY * 0.018 * step;
    orbit.velocityX *= Math.pow(0.84, step);
    orbit.velocityY *= Math.pow(0.84, step);
    orbit.offsetX = Math.max(-78, Math.min(78, orbit.offsetX + orbit.velocityX * step));
    orbit.offsetY = Math.max(-78, Math.min(78, orbit.offsetY + orbit.velocityY * step));
  });
}

if (orbitStates.length) {
  orbitStates.forEach((orbit) => {
    randomizeOrbitVelocity(orbit);
    const base = getOrbitBasePosition(orbit);
    renderOrbit(orbit, base.x, base.y);
  });

  function animateToolOrbits(time) {
    let frameDelta = 16.67;
    orbitStates.forEach((orbit, index) => {
      if (!orbit.lastTime) orbit.lastTime = time;
      const delta = Math.min(time - orbit.lastTime, 34);
      if (index === 0) frameDelta = delta || 16.67;
      orbit.lastTime = time;
      const travelDelta = Math.abs(orbit.velocity * delta);
      orbit.angle += orbit.velocity * delta;
      orbit.travel += travelDelta;

      if (orbit.travel >= Math.PI * 2) {
        orbit.travel -= Math.PI * 2;
        randomizeOrbitVelocity(orbit);
      }

    });

    updateOrbitInteractions(frameDelta / 16.67);
    orbitStates.forEach((orbit) => {
      const base = getOrbitBasePosition(orbit);
      renderOrbit(orbit, base.x + orbit.offsetX, base.y + orbit.offsetY);
    });

    requestAnimationFrame(animateToolOrbits);
  }

  requestAnimationFrame(animateToolOrbits);
}

document.querySelector('#year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${y * -2.5}deg) rotateY(${x * 2.5}deg) translateY(-7px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

window.addEventListener('scroll', () => {
  document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });
