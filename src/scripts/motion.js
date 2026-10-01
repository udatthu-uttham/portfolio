// Site motion: Lenis smooth scroll + GSAP hero choreography (brief §9).
// Motion preferences can change while the page remains open, so the loops are
// explicitly started/stopped instead of being decided only at page load.
import gsap from 'gsap';
import Lenis from 'lenis';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
// Mirrors the CSS motion tokens in global.css (--dur-1..4, --stagger-1), in
// seconds for GSAP. Change both together.
const DUR = { micro: 0.15, standard: 0.22, moderate: 0.4, deliberate: 0.6 };
const STAGGER = 0.07;
// A page opened in a background tab gets a throttled rAF; GSAP's default lag
// smoothing then advances tweens ~33ms per throttled frame and the hero intro
// crawls for many seconds once the tab is shown. With smoothing off, tweens
// catch up to real time — a load intro should simply be done by then.
gsap.ticker.lagSmoothing(0);
let lenis;
let rafId = 0;
let intro;
let introPlayed = false;

function settleHero() {
  gsap.set(
    '[data-hero-slab], [data-hero-line], [data-hero-ctas], [data-hero-art], [data-hero-hello]',
    { clearProps: 'opacity,transform' }
  );
}

// Lenis's own example keeps a rAF alive for the life of the page. That wakes the
// CPU 60-120 times a second forever, even parked at the footer with nothing
// moving — measured as the single biggest idle cost on a long visit. Here the
// loop runs only while the page is actually moving: a gesture wakes it, and it
// stops once Lenis has settled. No visual difference (perf pass 2026-09-20).
const SETTLE_MS = 260; // how long the page must be still before the loop parks
let stillSince = 0;
let wakeAbort;

function isMoving() {
  if (!lenis) return false;
  if (lenis.isScrolling) return true;
  if (Math.abs(lenis.velocity ?? 0) > 0.05) return true;
  // mid-animation (anchor jump) can read velocity 0 for a frame — trust the gap
  const gap = Math.abs((lenis.targetScroll ?? 0) - (lenis.animatedScroll ?? 0));
  return gap > 0.5;
}

function pump(time) {
  if (!lenis || motionPreference.matches) { rafId = 0; return; }
  lenis.raf(time);
  if (isMoving()) stillSince = 0;
  else if (!stillSince) stillSince = time;
  if (stillSince && time - stillSince >= SETTLE_MS) { rafId = 0; stillSince = 0; return; }
  rafId = requestAnimationFrame(pump);
}

function wake() {
  if (!lenis || motionPreference.matches) return;
  stillSince = 0;
  if (!rafId) rafId = requestAnimationFrame(pump);
}

function startSmoothScroll() {
  if (lenis || motionPreference.matches) return;

  lenis = new Lenis({ lerp: 0.1 });
  wakeAbort = new AbortController();
  const opts = { passive: true, signal: wakeAbort.signal };
  // Any of these means the page is about to move, or already has.
  ['wheel', 'touchstart', 'touchmove', 'keydown', 'scroll', 'pointerdown'].forEach((type) =>
    window.addEventListener(type, wake, opts)
  );
  // A hidden tab should not be running a scroll loop at all.
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
        stillSince = 0;
      } else wake();
    },
    { signal: wakeAbort.signal }
  );
  wake();
}

function stopSmoothScroll() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  stillSince = 0;
  wakeAbort?.abort();
  wakeAbort = undefined;
  lenis?.destroy();
  lenis = undefined;
}

function playHeroIntro() {
  if (introPlayed || motionPreference.matches || !document.querySelector('[data-hero-slab]')) return;

  introPlayed = true;
  intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .from('[data-hero-slab]', { opacity: 0, y: 24, duration: DUR.moderate }, 0)
    .from('[data-hero-line]', { yPercent: 120, duration: DUR.deliberate, stagger: STAGGER }, 0.1)
    .from('[data-hero-ctas]', { opacity: 0, y: 16, duration: DUR.deliberate }, 0.45)
    .from('[data-hero-art]', { opacity: 0, duration: DUR.deliberate }, 0.5)
    .from('[data-hero-hello]', { opacity: 0, y: -14, duration: DUR.moderate }, 0.55);
}

function startMotion() {
  if (motionPreference.matches) return;
  startSmoothScroll();
  playHeroIntro();
}

function stopMotion() {
  stopSmoothScroll();
  intro?.kill();
  intro = undefined;
  settleHero();
}

motionPreference.addEventListener('change', (event) => {
  if (event.matches) stopMotion();
  else startMotion();
});

if (motionPreference.matches) settleHero();
else startMotion();

// Scroll-reveal — sections fade/rise in as they enter. Under reduced motion the
// global transition-duration override makes this effectively instant.
function initReveals() {
  const items = document.querySelectorAll('.rv');
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -18% 0px' }
  );
  items.forEach((el) => io.observe(el));
}

// Scrollspy — highlight the nav item for the section currently in view.
function initScrollSpy() {
  const links = new Map(
    [...document.querySelectorAll('[data-nav]')].map((a) => [a.dataset.nav, a])
  );
  const sections = [...document.querySelectorAll('section[id], [data-spy]')].filter((s) =>
    links.has(s.id)
  );
  if (!links.size || !sections.length) return;

  const setActive = (id) => {
    links.forEach((a, key) => {
      const on = key === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

// Magnetic sheets — project tiles and AI Space cards only (Uttham, 2026-09-20, late).
// This is the last tuning that was live before the tilt was retired earlier today
// (recovered verbatim from the 19 Sep session); values are not to be re-invented.
// Magnetic case-study pages — physically anchored at the top edge, where
// the washi tape holds the sheet down. The pivot lives there (not the
// card's center), so the taped top barely moves while the free area below
// tilts and lifts toward the pointer, like someone peeling the sheet up
// with a hand — the closer to the bottom, the more it lifts. Fine
// pointers only; CSS hover is the fallback elsewhere.
function initMagneticTiles() {
  // Perspective magnifies the free bottom edge of tall, single-column cards
  // into the next card's tape. Keep that effect on wider hover layouts only.
  // GSAP reverts its transforms when resizing back into the mobile layout.
  const media = gsap.matchMedia();
  media.add('(min-width: 768px) and (hover: hover) and (pointer: fine)', () => {
    const cleanup = [];
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      // Scale perspective with the sheet so wider/taller cards do not grow
      // into the next row's tape or the board bolts when tilted.
      // Tiles pivot at their tape; photos pivot where their stickers hold them.
      gsap.set(el, { transformOrigin: el.dataset.magneticOrigin || '50% 0%' });
      const updatePerspective = () => gsap.set(el, {
        transformPerspective: Math.max(400, el.offsetHeight * 4, el.offsetWidth * 4),
      });
      updatePerspective();
      const sizeObserver = new ResizeObserver(updatePerspective);
      sizeObserver.observe(el);
      const rxTo = gsap.quickTo(el, 'rotationX', { duration: DUR.micro, ease: 'power2.out' });
      const ryTo = gsap.quickTo(el, 'rotationY', { duration: DUR.micro, ease: 'power2.out' });
      const zTo = gsap.quickTo(el, 'z', { duration: DUR.micro, ease: 'power2.out' });

      const enter = () => {
        if (!motionPreference.matches) zTo(2);
      };
      const move = (event) => {
        if (motionPreference.matches) return;
        const rect = el.getBoundingClientRect();
        const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (event.clientY - rect.top) / rect.height;
        rxTo(gsap.utils.clamp(0, 4, ny * 4));
        ryTo(gsap.utils.clamp(-2.5, 2.5, nx * 2.5 * ny));
        zTo(2 + ny * 2.5);
      };
      const leave = () => {
        rxTo(0);
        ryTo(0);
        zTo(0);
      };
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanup.push(() => {
        sizeObserver.disconnect();
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
    return () => cleanup.forEach((removeListeners) => removeListeners());
  });
}

// Header avatar — hidden on landing (pages with the hero Instax photo only),
// fades back in once that photo has scrolled fully above the viewport.
function initAvatarReveal() {
  const avatar = document.querySelector('[data-header-avatar]');
  const hello = document.querySelector('[data-hero-hello]');
  if (!avatar || !hello) return;

  avatar.classList.add('is-hidden');

  const io = new IntersectionObserver(
    ([entry]) => {
      const scrolledPast = entry.boundingClientRect.bottom <= 0;
      avatar.classList.toggle('is-hidden', !scrolledPast);
    },
    { threshold: 0 }
  );
  io.observe(hello);
}

initReveals();
initScrollSpy();
initMagneticTiles();
initAvatarReveal();
