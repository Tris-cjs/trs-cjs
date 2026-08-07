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
  const starCount = window.innerWidth < 700 ? 36 : 64;
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement('span');
    const glitter = index % 19 === 5;
    const noticeable = index % 13 === 0 || glitter;
    const size = noticeable ? 1.7 + Math.random() * 1.15 : 0.55 + Math.random() * 1.15;
    star.className = `site-star${noticeable ? ' is-noticeable' : ''}${glitter ? ' is-glitter' : ''}`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--size', `${size}px`);
    star.style.setProperty('--opacity', noticeable ? `${0.46 + Math.random() * 0.28}` : `${0.08 + Math.random() * 0.2}`);
    star.style.setProperty('--twinkle', `${4.2 + Math.random() * 6.8}s`);
    star.style.setProperty('--delay', `${-Math.random() * 8}s`);
    star.style.setProperty('--glitter', `${6.8 + Math.random() * 5.4}s`);
    star.style.setProperty('--glitter-delay', `${-Math.random() * 10}s`);
    fragment.appendChild(star);
  }
  starField.appendChild(fragment);
}

const shorts = [
  { id: 'gsOFUAuJ3Pc', title: 'GTA 6 Tidal System', category: 'gaming', label: 'Gaming story' },
  { id: 'KgyFzMmVmF4', title: 'Make Sense', category: 'cinematic', label: 'Cinematic edit' },
  { id: 'GDHdmkyQ500', title: 'See You Again', category: 'cinematic', label: 'Cinematic edit' },
  { id: 'BkFptHb0MFc', title: 'GTA 6 Leak', category: 'gaming', label: 'Gaming story' },
  { id: 'M1offHp1muc', title: 'Michael’s Car Reference', category: 'gaming', label: 'Gaming story' },
  { id: 'MR5UlgWboSI', title: 'Franklin Is a Traitor', category: 'gaming', label: 'Gaming story' },
  { id: 'CChpNWAgnFA', title: 'The GTA 6 Hacker', category: 'gaming', label: 'Gaming story' },
  { id: 'WBtS4kjdC2o', title: 'Could This Be the Twist?', category: 'gaming', label: 'Gaming story' },
  { id: '49PbFTez5g8', title: 'GTA 6 Map in Minecraft', category: 'gaming', label: 'Gaming story' },
  { id: 'WaIRZPtrgik', title: 'Early GTA 5 Hint', category: 'gaming', label: 'Gaming story' },
  { id: 'TaiUWy3-MRc', title: 'Google Flow / 01', category: 'ai', label: 'AI experiment', unlisted: true },
  { id: 'J7Ckzlbz1K0', title: 'Google Flow / 02', category: 'ai', label: 'AI experiment', unlisted: true },
  { id: 'I5b3-CLgEz8', title: 'Google Flow / 03', category: 'ai', label: 'AI experiment', unlisted: true },
  { id: 'SqOGk9wZSuE', title: 'Google Flow / 04', category: 'ai', label: 'AI experiment', unlisted: true },
  { id: 'MUG-Dxo0IMo', title: 'Google Flow / 05', category: 'ai', label: 'AI experiment', unlisted: true },
];

const shortsGrid = document.querySelector('#shorts-grid');
if (shortsGrid) {
  const fragment = document.createDocumentFragment();
  shorts.forEach(({ id, title, category, label, unlisted = false }, index) => {
    const card = document.createElement('article');
    card.className = 'short-card reveal';
    card.dataset.category = category;
    card.innerHTML = `
      <div class="video-frame short-frame" data-video-id="${id}" data-video-title="${title}">
        <img class="video-poster" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async" fetchpriority="low" aria-hidden="true" onerror="this.remove()" />
        <button class="video-hit-layer" type="button" aria-label="Play ${title}">
          <span class="video-control"><span class="video-control-icon" aria-hidden="true">▶</span><span class="video-control-label">Play video</span></span>
        </button>
      </div>
      <h3 class="short-title">${title}</h3>
      <div class="short-card-meta">
        <span class="short-category">${label}</span>
        <a class="short-link" href="https://youtube.com/shorts/${id}" target="_blank" rel="noreferrer">${unlisted ? 'Open unlisted short' : 'Open short'} ↗</a>
      </div>`;
    card.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    fragment.appendChild(card);
  });
  shortsGrid.appendChild(fragment);
  shortsGrid.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));
}

const shortFilterButtons = [...document.querySelectorAll('[data-short-filter]')];
const shortsVisibleCount = document.querySelector('#shorts-visible-count');
shortFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.shortFilter;
    let visibleCount = 0;

    shortsGrid?.querySelectorAll('.short-card').forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.hidden = !visible;
      if (!visible) card.querySelector('.video-frame')?.dispatchEvent(new Event('pause-video'));
      if (visible) visibleCount += 1;
    });

    shortFilterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    if (shortsVisibleCount) shortsVisibleCount.textContent = String(visibleCount);
  });
});

document.querySelectorAll('.video-frame').forEach((frame) => {
  const hitLayer = frame.querySelector('.video-hit-layer');
  if (!hitLayer) return;

  let iframe = null;
  let playing = false;
  const icon = hitLayer.querySelector('.video-control-icon');
  const label = hitLayer.querySelector('.video-control-label');

  const updateVideoControl = () => {
    hitLayer.classList.toggle('is-playing', playing);
    hitLayer.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${iframe?.title || frame.dataset.videoTitle || 'video'}`);
    if (icon) icon.textContent = playing ? 'Ⅱ' : '▶';
    if (label) label.textContent = playing ? 'Pause video' : 'Play video';
  };

  hitLayer.addEventListener('click', () => {
    if (!iframe) {
      const id = frame.dataset.videoId;
      const title = frame.dataset.videoTitle || 'Video by Tristan';
      if (!id) return;

      iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
      iframe.title = title;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.addEventListener('load', () => frame.querySelector('.video-poster')?.remove(), { once: true });
      frame.insertBefore(iframe, hitLayer);
      frame.classList.add('is-loaded');
      playing = true;
    } else {
      playing = !playing;
      iframe.contentWindow?.postMessage(JSON.stringify({
        event: 'command',
        func: playing ? 'playVideo' : 'pauseVideo',
        args: [],
      }), '*');
    }

    updateVideoControl();
  });

  frame.addEventListener('pause-video', () => {
    if (!iframe || !playing) return;
    iframe.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
    playing = false;
    updateVideoControl();
  });
});

const solarSystem = document.querySelector('#solar-system');
const planetSystem = document.querySelector('#planet-system');
const orbitRings = document.querySelector('.orbit-rings');
const planets = [...document.querySelectorAll('.planet')];
const particleCanvas = document.querySelector('#particle-field');
const particleContext = particleCanvas?.getContext('2d');

const orbitProfiles = [
  { tilt: -12, tiltRange: 3.2, pivotSpeed: 0.052, pivotPhase: 0.4, pivotDirection: 1, flatten: 0.50, flattenRange: 0.018, flattenSpeed: 0.039 },
  { tilt: -5, tiltRange: 4.4, pivotSpeed: 0.043, pivotPhase: 1.6, pivotDirection: -1, flatten: 0.47, flattenRange: 0.024, flattenSpeed: 0.034 },
  { tilt: 7, tiltRange: 3.7, pivotSpeed: 0.047, pivotPhase: 2.7, pivotDirection: 1, flatten: 0.52, flattenRange: 0.019, flattenSpeed: 0.037 },
  { tilt: -9, tiltRange: 5.1, pivotSpeed: 0.036, pivotPhase: 3.8, pivotDirection: -1, flatten: 0.48, flattenRange: 0.022, flattenSpeed: 0.031 },
  { tilt: 4, tiltRange: 4.2, pivotSpeed: 0.041, pivotPhase: 5.1, pivotDirection: 1, flatten: 0.51, flattenRange: 0.02, flattenSpeed: 0.035 },
  { tilt: -2, tiltRange: 5.8, pivotSpeed: 0.032, pivotPhase: 0.9, pivotDirection: -1, flatten: 0.49, flattenRange: 0.025, flattenSpeed: 0.029 },
  { tilt: 11, tiltRange: 3.9, pivotSpeed: 0.046, pivotPhase: 2.1, pivotDirection: -1, flatten: 0.46, flattenRange: 0.02, flattenSpeed: 0.036 },
  { tilt: -15, tiltRange: 4.7, pivotSpeed: 0.038, pivotPhase: 4.4, pivotDirection: 1, flatten: 0.53, flattenRange: 0.018, flattenSpeed: 0.03 },
  { tilt: 2, tiltRange: 5.4, pivotSpeed: 0.034, pivotPhase: 5.8, pivotDirection: -1, flatten: 0.45, flattenRange: 0.023, flattenSpeed: 0.033 },
  { tilt: 14, tiltRange: 4.1, pivotSpeed: 0.042, pivotPhase: 3.2, pivotDirection: 1, flatten: 0.50, flattenRange: 0.021, flattenSpeed: 0.028 },
];

const solarState = {
  width: 0,
  height: 0,
  scale: 1,
  pointerX: 0,
  pointerY: 0,
  pointerActive: false,
  particles: [],
  orbitRings: [],
  start: performance.now(),
  visible: true,
  lastFrame: 0,
  frameInterval: 1000 / 45,
};

function sizeSolarSystem() {
  if (!solarSystem) return;
  const bounds = solarSystem.getBoundingClientRect();
  const compactMode = window.innerWidth < 700;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, compactMode ? 1.35 : 1.75);
  solarState.width = bounds.width;
  solarState.height = bounds.height;
  solarState.scale = Math.min(1, bounds.width / 680);
  solarState.frameInterval = 1000 / (compactMode ? 30 : 45);

  if (particleCanvas && particleContext) {
    particleCanvas.width = Math.round(bounds.width * pixelRatio);
    particleCanvas.height = Math.round(bounds.height * pixelRatio);
    particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  const particleCount = compactMode ? 84 : window.innerWidth < 1000 ? 120 : 150;
  solarState.particles = Array.from({ length: particleCount }, () => {
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
  solarState.orbitRings = [];
  planets.forEach((planet, index) => {
    const radius = Number(planet.dataset.radius) * solarState.scale;
    const profile = orbitProfiles[index % orbitProfiles.length];
    const size = Math.max(24, Number(planet.dataset.size) * solarState.scale);
    planet.style.setProperty('--planet-size', `${size}px`);
    planet.title = planet.dataset.name || '';

    if (orbitRings) {
      const ring = document.createElement('span');
      ring.className = 'orbit-ring';
      ring.style.width = `${radius * 2}px`;
      ring.style.height = `${radius * 2 * profile.flatten}px`;
      ring.style.transform = `translate(-50%, -50%) rotate(${profile.tilt}deg)`;
      ring.style.setProperty('--ring-opacity', String(0.1 + index * 0.018));
      orbitRings.appendChild(ring);
      solarState.orbitRings[index] = ring;
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
  const pointerPixelX = centerX + solarState.pointerX * solarState.width / 2;
  const pointerPixelY = centerY + solarState.pointerY * solarState.height / 2;
  particleContext.clearRect(0, 0, solarState.width, solarState.height);

  solarState.particles.forEach((particle) => {
    const angle = particle.angle + time * particle.drift * 0.0001;
    const pulse = 1 + Math.sin(time * 0.0014 + particle.phase) * 0.035;
    const x = centerX + Math.cos(angle) * particle.radius * pulse;
    const y = centerY + Math.sin(angle) * particle.radius * 0.56 * pulse;
    const influence = solarState.pointerActive
      ? Math.max(0, 1 - Math.hypot(pointerPixelX - x, pointerPixelY - y) / 54)
      : 0;

    particleContext.beginPath();
    particleContext.arc(x, y, particle.size + influence * 0.85, 0, Math.PI * 2);
    particleContext.fillStyle = influence > 0.08
      ? `rgba(200,255,50,${0.32 + influence * 0.68})`
      : `rgba(174,181,169,${particle.alpha})`;
    particleContext.fill();
  });
}

function animateSolarSystem(time) {
  if (!reduceMotion && (!solarState.visible || time - solarState.lastFrame < solarState.frameInterval)) {
    requestAnimationFrame(animateSolarSystem);
    return;
  }
  solarState.lastFrame = time;
  const elapsed = reduceMotion ? 0 : (time - solarState.start) / 1000;
  const pointerLightX = solarState.pointerActive ? solarState.pointerX * 3 : 0;
  const pointerLightY = solarState.pointerActive ? solarState.pointerY * 3 : 0;

  planets.forEach((planet, index) => {
    const radius = Number(planet.dataset.radius) * solarState.scale;
    const profile = orbitProfiles[index % orbitProfiles.length];
    const speed = Number(planet.dataset.speed);
    const phase = Number(planet.dataset.phase);
    const angle = phase + elapsed * speed;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    const pivot = Math.sin(elapsed * profile.pivotSpeed * profile.pivotDirection + profile.pivotPhase);
    const tilt = profile.tilt + pivot * profile.tiltRange;
    const flattening = profile.flatten + Math.sin(elapsed * profile.flattenSpeed + profile.pivotPhase * 1.7) * profile.flattenRange;
    const tiltRadians = tilt * Math.PI / 180;
    const localX = cosine * radius;
    const localY = sine * radius * flattening;
    const x = localX * Math.cos(tiltRadians) - localY * Math.sin(tiltRadians);
    const y = localX * Math.sin(tiltRadians) + localY * Math.cos(tiltRadians);
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
    const ring = solarState.orbitRings[index];

    if (ring) {
      ring.style.height = `${radius * 2 * flattening}px`;
      ring.style.transform = `translate(-50%, -50%) rotate(${tilt}deg)`;
    }

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
  const solarVisibilityObserver = new IntersectionObserver(([entry]) => {
    solarState.visible = entry.isIntersecting;
  }, { rootMargin: '120px 0px' });
  solarVisibilityObserver.observe(solarSystem);
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
