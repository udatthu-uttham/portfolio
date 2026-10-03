// The homepage's weak magnetic snap (Uttham, 2026-10-03: "can we do a weak
// magnetic scroll of sorts to center these sections in viewports"). Every
// homepage section is one screen with its content centred in it (CLAUDE.md,
// the screen contract), so each has one place where it sits right: its top
// under the fixed header, exactly where a nav jump lands it (the section's own
// scroll-margin-top). The last, Contact, is the exception: it shares the last
// screen with the footer, so its place is the page bottom. Where the two fit
// that is also where its nav jump lands; on a short window they part by a few
// px, and two places that close would settle in two steps. When a wheel or
// trackpad gesture comes to rest close to one of those places, the page eases
// the rest of the way; anywhere else it stays exactly where the reader left it.
//
// Weak, by four rules:
// - Reach: only within 18% of a screen of a resting place. Stop further off and
//   nothing happens.
// - Direction: a snap only finishes the move the reader made. A resting place
//   behind where the gesture began never counts, so a nudge away from a section
//   is never pulled back (a mouse wheel's notch would otherwise be undone every
//   time), while an overshoot within one gesture is caught.
// - Wheel only: touch scrolls natively on this site (Lenis leaves it alone), so
//   phones are never snapped; keyboard, scrollbar and nav jumps are native too
//   and never start one.
// - Never in the way: a key, click or tap cancels a pending snap and stops one
//   in flight, so a nav jump or a keyboard scroll always wins; a wheel takes
//   over from a snap the way it takes over from any Lenis glide.
// A section taller than the screen gets no resting place of its own inside it:
// the reader scrolls through it freely, and its top catches them only when they
// arrive near it. Reduced motion never gets here (no Lenis), nor do the teaser
// pages (no hero).
//
// Why not lenis/snap: checked against Lenis 1.3.26, it snaps after a touchend
// (fighting native momentum on phones), aligns an element's top to the viewport
// top (under the header), judges from the scroll position plus the last wheel
// delta rather than where the glide will come to rest, and pulls back to a
// point the reader has just nudged away from. The rules above are a few lines
// on Lenis's own events, so they live here instead.

const REACH = 0.18; // of the viewport height
const WAIT_MS = 200; // quiet after the last wheel event (trackpad momentum included)
const DURATION = 0.8; // s; above the --dur-* ladder on purpose, a page move is slower than UI feedback
// --ease-enter, cubic-bezier(0.22, 1, 0.36, 1) ("arriving: fast in, soft
// settle"), in its closed form: it picks up a glide still in motion without a
// jolt, as the site's own lerp would
const easeEnter = (t) => 1 - (1 - t) ** 5;
const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/**
 * The resting place a gesture should settle on, or null to leave the page be.
 * Pure, so the rules can be checked without a browser.
 * @param {number[]} places resting places, in px of scroll
 * @param {number} from where the gesture began
 * @param {number} rest where the page will come to rest without a snap
 * @param {number} reach how far a place may be from `rest` and still pull
 */
export function pickRestingPlace(places, from, rest, reach) {
  const dir = Math.sign(rest - from);
  if (!dir) return null;
  let best = null;
  let gap = reach;
  for (const place of places) {
    if ((place - from) * dir < 1) continue; // behind where the gesture began
    const d = Math.abs(place - rest);
    if (d <= gap) {
      best = place;
      gap = d;
    }
  }
  return best === null || gap < 1 ? null : best;
}

/**
 * Wire the snap to a Lenis instance on the homepage; a no-op elsewhere.
 * @param {import('lenis').default} lenis
 * @param {() => void} wake restarts motion.js's parked rAF loop
 * @returns {() => void} detach
 */
export function attachSectionSnap(lenis, wake) {
  const hero = document.querySelector('main > section.hero');
  if (!hero || !hero.parentElement) return () => {};
  const sections = [...hero.parentElement.querySelectorAll(':scope > section[id]')];

  let timer = 0;
  /** @type {number | null} */
  let from = null; // where the current wheel gesture began

  // Measured when a gesture ends, so a resize or a late image never leaves
  // them stale.
  const restingPlaces = () => {
    const limit = lenis.limit;
    const places = sections.slice(0, -1).map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const landing = top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      return Math.round(Math.min(Math.max(landing, 0), limit));
    });
    places.push(Math.round(limit)); // the last screen: Contact with the footer
    return places;
  };

  const cancel = () => {
    clearTimeout(timer);
    timer = 0;
    from = null;
  };

  const settle = () => {
    const start = from;
    timer = 0;
    from = null;
    // A native scroll (a nav jump, the keyboard, the scrollbar) already has the
    // page. Its velocity tells it apart from the stale 'native' Lenis can be
    // left in after a stray scroll event that moved nothing.
    const nativeMoving = lenis.isScrolling === 'native' && lenis.velocity !== 0;
    if (start === null || document.hidden || lenis.isStopped || lenis.isLocked || nativeMoving) return;
    const place = pickRestingPlace(restingPlaces(), start, lenis.targetScroll, window.innerHeight * REACH);
    if (place === null) return;
    lenis.scrollTo(place, { duration: DURATION, easing: easeEnter, userData: { initiator: 'snap' } });
    wake();
  };

  // Lenis emits this before it applies the delta, so targetScroll is still
  // where the page was headed before this event: the gesture's start.
  const offWheel = lenis.on('virtual-scroll', ({ event }) => {
    // touch is native here, and ctrl + wheel is a pinch-zoom, not a scroll
    if (event.type !== 'wheel' || event.ctrlKey) return cancel();
    if (from === null) from = lenis.targetScroll;
    clearTimeout(timer);
    timer = window.setTimeout(settle, WAIT_MS);
  });

  /** @param {Event} event */
  const giveWay = (event) => {
    if (event instanceof KeyboardEvent && MODIFIERS.has(event.key)) return;
    cancel();
    // stop() + start() is Lenis's public way to drop an animation where it is
    if (lenis.isScrolling === 'smooth' && lenis.userData?.initiator === 'snap') {
      lenis.stop();
      lenis.start();
    }
  };

  const abort = new AbortController();
  const opts = { passive: true, signal: abort.signal };
  window.addEventListener('keydown', giveWay, opts);
  window.addEventListener('pointerdown', giveWay, opts);
  document.addEventListener('visibilitychange', cancel, opts);

  return () => {
    cancel();
    abort.abort();
    offWheel();
  };
}
