const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelector('#nav-links');
const siteHeader = document.querySelector('#site-header');

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuToggle.classList.toggle('is-open', open);
  navLinks?.classList.toggle('is-open', open);
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.querySelectorAll('a').forEach((item) => item.classList.toggle('is-active', item === link));
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
    menuToggle?.classList.remove('is-open');
    navLinks.classList.remove('is-open');
  });
});

const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
  revealObserver.observe(item);
});

const sections = [...document.querySelectorAll('.section-anchor')];
const navAnchors = [...document.querySelectorAll('.nav-links a')];
function updateActiveSection() {
  const marker = window.scrollY + (siteHeader?.offsetHeight || 0) + window.innerHeight * 0.24;
  let visible = sections[0];
  sections.forEach((section) => {
    if (section.offsetTop <= marker) visible = section;
  });
  navAnchors.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.id}`);
  });
}
updateActiveSection();
window.addEventListener('scroll', updateActiveSection, { passive: true });

document.querySelector('#year').textContent = new Date().getFullYear();

const tickerTrack = document.querySelector('.ticker-track');
const tickerGroups = tickerTrack ? [...tickerTrack.querySelectorAll('.ticker-group')] : [];
if (tickerTrack && tickerGroups.length === 2) {
  const tickerSeed = tickerGroups[0].innerHTML;
  let tickerResizeTimer;

  const fillTicker = () => {
    tickerGroups.forEach((group) => { group.innerHTML = tickerSeed; });
    const seedWidth = Math.max(1, tickerGroups[0].getBoundingClientRect().width);
    const repeats = Math.max(2, Math.ceil(window.innerWidth / seedWidth) + 1);
    const repeatedWords = tickerSeed.repeat(repeats);
    tickerGroups.forEach((group) => { group.innerHTML = repeatedWords; });
    const loopWidth = tickerGroups[0].getBoundingClientRect().width;
    tickerTrack.style.setProperty('--ticker-duration', `${Math.max(18, loopWidth / 56)}s`);
  };

  fillTicker();
  window.addEventListener('resize', () => {
    window.clearTimeout(tickerResizeTimer);
    tickerResizeTimer = window.setTimeout(fillTicker, 140);
  }, { passive: true });
}

const starField = document.querySelector('#site-stars');
if (starField) {
  const starCount = window.innerWidth < 700 ? 46 : 78;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement('span');
    const noticeable = index % 13 === 0;
    const size = noticeable ? 1.8 + Math.random() * 1.2 : 0.6 + Math.random() * 1.2;
    star.className = `site-star${noticeable ? ' is-noticeable' : ''}`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--opacity', noticeable ? `${0.46 + Math.random() * 0.28}` : `${0.08 + Math.random() * 0.2}`);
    star.style.setProperty('--twinkle', `${4.2 + Math.random() * 6.8}s`);
    star.style.setProperty('--delay', `${-Math.random() * 8}s`);
    fragment.appendChild(star);
  }
  starField.appendChild(fragment);
}

const shorts = [
  ['gsOFUAuJ3Pc', 'GTA 6 Tidal System', false],
  ['KgyFzMmVmF4', 'Make Sense', false],
  ['GDHdmkyQ500', 'See You Again', false],
  ['BkFptHb0MFc', 'GTA 6 Leak', false],
  ['M1offHp1muc', 'Michael’s Car Reference', false],
  ['MR5UlgWboSI', 'Franklin Is a Traitor', false],
  ['CChpNWAgnFA', 'The GTA 6 Hacker', false],
  ['WBtS4kjdC2o', 'Could This Be the Twist?', false],
  ['49PbFTez5g8', 'GTA 6 Map in Minecraft', false],
  ['WaIRZPtrgik', 'Early GTA 5 Hint', false],
  ['TaiUWy3-MRc', 'Google Flow / 01', true],
  ['J7Ckzlbz1K0', 'Google Flow / 02', true],
  ['I5b3-CLgEz8', 'Google Flow / 03', true],
  ['SqOGk9wZSuE', 'Google Flow / 04', true],
  ['MUG-Dxo0IMo', 'Google Flow / 05', true],
];

const shortsGrid = document.querySelector('#shorts-grid');
if (shortsGrid) {
  const fragment = document.createDocumentFragment();
  shorts.forEach(([id, title, unlisted], index) => {
    const card = document.createElement('article');
    card.className = 'short-card reveal';
    card.innerHTML = `
      <div class="video-frame short-frame">
        <iframe
          src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1&playsinline=1"
          title="${title}"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
        <button class="video-hit-layer" type="button" aria-label="Play ${title}">
          <span class="video-control"><span class="video-control-icon" aria-hidden="true">▶</span><span class="video-control-label">Play video</span></span>
        </button>
      </div>
      <h3 class="short-title">${title}</h3>
      <a class="short-link" href="https://youtube.com/shorts/${id}" target="_blank" rel="noreferrer">${unlisted ? 'Open unlisted short' : 'Open short'} ↗</a>`;
    card.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    fragment.appendChild(card);
  });
  shortsGrid.appendChild(fragment);
  shortsGrid.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll('.video-frame').forEach((frame) => {
  const iframe = frame.querySelector('iframe');
  const hitLayer = frame.querySelector('.video-hit-layer');
  if (!iframe || !hitLayer) return;

  let playing = false;
  const icon = hitLayer.querySelector('.video-control-icon');
  const label = hitLayer.querySelector('.video-control-label');

  hitLayer.addEventListener('click', () => {
    playing = !playing;
    iframe.contentWindow?.postMessage(JSON.stringify({
      event: 'command',
      func: playing ? 'playVideo' : 'pauseVideo',
      args: [],
    }), '*');

    hitLayer.classList.toggle('is-playing', playing);
    hitLayer.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${iframe.title}`);
    if (icon) icon.textContent = playing ? 'Ⅱ' : '▶';
    if (label) label.textContent = playing ? 'Pause video' : 'Play video';
  });
});

const solarSystem = document.querySelector('#solar-system');
const planetSystem = document.querySelector('#planet-system');
const orbitRings = document.querySelector('.orbit-rings');
const planets = [...document.querySelectorAll('.planet')];
const particleCanvas = document.querySelector('#particle-field');
const particleContext = particleCanvas?.getContext('2d');

const solarState = {
  width: 0,
  height: 0,
  scale: 1,
  pointerX: 0,
  pointerY: 0,
  pointerActive: false,
  particles: [],
  start: performance.now(),
};

function sizeSolarSystem() {
  if (!solarSystem) return;
  const bounds = solarSystem.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  solarState.width = bounds.width;
  solarState.height = bounds.height;
  solarState.scale = Math.min(1, bounds.width / 680);

  if (particleCanvas && particleContext) {
    particleCanvas.width = Math.round(bounds.width * pixelRatio);
    particleCanvas.height = Math.round(bounds.height * pixelRatio);
    particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  solarState.particles = Array.from({ length: Math.round(220 * Math.max(0.68, solarState.scale)) }, () => {
    const radius = Math.pow(Math.random(), 0.58) * Math.min(bounds.width, bounds.height) * 0.27;
    const angle = Math.random() * Math.PI * 2;
    return {
      angle,
      radius,
      size: 0.55 + Math.random() * 1.6,
      drift: (Math.random() - 0.5) * 0.12,
      alpha: 0.18 + Math.random() * 0.54,
      phase: Math.random() * Math.PI * 2,
    };
  });

  orbitRings?.replaceChildren();
  planets.forEach((planet, index) => {
    const radius = Number(planet.dataset.radius) * solarState.scale;
    const size = Math.max(24, Number(planet.dataset.size) * solarState.scale);
    planet.style.setProperty('--planet-size', `${size}px`);
    planet.title = planet.dataset.name || '';

    if (orbitRings) {
      const ring = document.createElement('span');
      ring.className = 'orbit-ring';
      ring.style.width = `${radius * 2}px`;
      ring.style.height = `${radius * 0.98}px`;
      ring.style.setProperty('--ring-opacity', String(0.1 + index * 0.018));
      orbitRings.appendChild(ring);
    }
  });
}

function updateSolarPointer(event) {
  if (!solarSystem) return;
  const bounds = solarSystem.getBoundingClientRect();
  solarState.pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width / 2)));
  solarState.pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height / 2)));
  solarState.pointerActive = true;
  solarSystem.classList.add('is-engaged');
}

solarSystem?.addEventListener('pointerenter', updateSolarPointer);
solarSystem?.addEventListener('pointermove', updateSolarPointer);
solarSystem?.addEventListener('pointerleave', () => {
  solarState.pointerActive = false;
  solarSystem.classList.remove('is-engaged');
});

function drawParticles(time) {
  if (!particleContext || !particleCanvas) return;
  const centerX = solarState.width / 2;
  const centerY = solarState.height / 2;
  particleContext.clearRect(0, 0, solarState.width, solarState.height);

  solarState.particles.forEach((particle) => {
    const angle = particle.angle + time * particle.drift * 0.0001;
    const pulse = 1 + Math.sin(time * 0.0014 + particle.phase) * 0.035;
    const x = centerX + Math.cos(angle) * particle.radius * pulse;
    const y = centerY + Math.sin(angle) * particle.radius * 0.56 * pulse;
    const pointerPixelX = centerX + solarState.pointerX * solarState.width / 2;
    const pointerPixelY = centerY + solarState.pointerY * solarState.height / 2;
    const distance = Math.hypot(pointerPixelX - x, pointerPixelY - y);
    const influence = solarState.pointerActive ? Math.max(0, 1 - distance / 54) : 0;

    particleContext.beginPath();
    particleContext.arc(x, y, particle.size + influence * 0.85, 0, Math.PI * 2);
    particleContext.fillStyle = influence > 0.08
      ? `rgba(200,255,50,${0.32 + influence * 0.68})`
      : `rgba(174,181,169,${particle.alpha})`;
    particleContext.fill();
  });
}

function animateSolarSystem(time) {
  const elapsed = reduceMotion ? 0 : (time - solarState.start) / 1000;
  const pointerLightX = solarState.pointerActive ? solarState.pointerX * 3 : 0;
  const pointerLightY = solarState.pointerActive ? solarState.pointerY * 3 : 0;

  planets.forEach((planet) => {
    const radius = Number(planet.dataset.radius) * solarState.scale;
    const speed = Number(planet.dataset.speed);
    const phase = Number(planet.dataset.phase);
    const angle = phase + elapsed * speed;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const x = cosine * radius;
    const y = sine * radius * 0.49;
    const depth = sine;
    const depthScale = 0.82 + (depth + 1) * 0.11;
    const vectorLength = Math.max(1, Math.hypot(x, y));
    const outwardX = x / vectorLength;
    const outwardY = y / vectorLength;
    const towardSunX = -outwardX;
    const towardSunY = -outwardY;
    const lightX = 50 + towardSunX * 38 + pointerLightX;
    const lightY = 50 + towardSunY * 38 + pointerLightY;
    const shadowX = outwardX * 11;
    const shadowY = outwardY * 11;
    const shadeX = outwardX * 10;
    const shadeY = outwardY * 10;
    const highlightX = towardSunX * 6;
    const highlightY = towardSunY * 6;
    const warmGlow = 0.08 + Math.max(0, 1 - radius / (310 * solarState.scale)) * 0.17;

    planet.style.setProperty('--planet-x', `${x}px`);
    planet.style.setProperty('--planet-y', `${y}px`);
    planet.style.setProperty('--planet-z', `${depth * 54}px`);
    planet.style.setProperty('--planet-scale', depthScale.toFixed(3));
    planet.style.setProperty('--light-x', `${lightX}%`);
    planet.style.setProperty('--light-y', `${lightY}%`);
    planet.style.setProperty('--shadow-x', `${shadowX}px`);
    planet.style.setProperty('--shadow-y', `${shadowY}px`);
    planet.style.setProperty('--shade-x', `${shadeX}px`);
    planet.style.setProperty('--shade-y', `${shadeY}px`);
    planet.style.setProperty('--highlight-x', `${highlightX}px`);
    planet.style.setProperty('--highlight-y', `${highlightY}px`);
    planet.style.setProperty('--warm-glow', warmGlow.toFixed(3));
    planet.style.zIndex = String(10 + Math.round((depth + 1) * 20));
  });

  drawParticles(time);
  if (!reduceMotion) requestAnimationFrame(animateSolarSystem);
}

if (solarSystem && planetSystem) {
  sizeSolarSystem();
  window.addEventListener('resize', sizeSolarSystem, { passive: true });
  requestAnimationFrame(animateSolarSystem);
}

function parseColor(color) {
  const match = color.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const values = match[1].split(',').map((value) => Number.parseFloat(value.trim()));
  return { r: values[0], g: values[1], b: values[2], a: values.length > 3 ? values[3] : 1 };
}

function cursorColorFor(target) {
  if (!(target instanceof Element)) return '#f4f5ef';
  const explicit = target.closest('[data-cursor-tone]')?.getAttribute('data-cursor-tone');
  if (explicit === 'dark') return '#070807';
  if (explicit === 'light') return '#f4f5ef';

  let node = target;
  while (node && node !== document.documentElement) {
    const color = parseColor(getComputedStyle(node).backgroundColor);
    if (color && color.a > 0.22) {
      const luminance = (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
      return luminance > 0.52 ? '#070807' : '#f4f5ef';
    }
    node = node.parentElement;
  }
  return '#f4f5ef';
}

if (finePointer) {
  const cursor = document.createElement('div');
  cursor.className = 'cursor-crosshair';
  document.body.appendChild(cursor);
  let scrollRotation = 0;
  let previousScroll = window.scrollY;

  document.addEventListener('pointermove', (event) => {
    const target = event.target;
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.style.setProperty('--cursor-color', cursorColorFor(target));
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-clickable', target instanceof Element && Boolean(target.closest('a, button, iframe, [role="button"]')));
  }, { passive: true });

  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  window.addEventListener('scroll', () => {
    const delta = window.scrollY - previousScroll;
    scrollRotation = (scrollRotation + Math.max(-28, Math.min(28, delta * 0.42))) % 360;
    previousScroll = window.scrollY;
    cursor.style.setProperty('--cursor-rotation', `${scrollRotation}deg`);
  }, { passive: true });
}
