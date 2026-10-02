// Site motion: Lenis smooth scroll, the scroll reveals, the nav scrollspy and
// the header avatar's reveal — everything a page needs on top of its own CSS.
// The hero's GSAP choreography and the magnetic sheets live in motion-hero.js,
// loaded by the homepage alone, so the teaser pages never download GSAP
// (perf pass 2026-10-02). Motion preferences can change while the page remains
// open, so the loops are explicitly started/stopped instead of being decided
// only at page load.
import Lenis from 'lenis';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let lenis;
let rafId = 0;

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

motionPreference.addEventListener('change', (event) => {
  if (event.matches) stopSmoothScroll();
  else startSmoothScroll();
});

if (!motionPreference.matches) startSmoothScroll();

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
initAvatarReveal();
