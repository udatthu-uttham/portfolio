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
// arrive near it. Reduced motion never gets here (no Lenis).
//
// THE READING PAGES settle too, more weakly still (Uttham, 2026-10-03: "and
// some magnetic scroll to these also shuold be implemented"): the case teasers
// and the AI Space one-pagers (CaseTeaser.astro) hand over their own resting
// places through provideRestingPlaces() — each the scroll position where a
// part of the reading becomes the one the phone shows, its heading on the
// reading line. Two rules differ from the homepage's, both because a resting
// place there is a change of state, not just a tidy position:
// - Forward only: a snap only ever carries a gesture on to a place AHEAD of
//   where it came to rest. The homepage also catches an overshoot within one
//   gesture; here that would pull the reader back across a line they have just
//   crossed and flip the phone back to the screen they scrolled away from.
// - A shorter reach, READING_REACH: the parts of a reading page are a quarter
//   to a whole screen apart, not a screen each, so the homepage's 18% would
//   cover most of the gap between two short parts; 12% keeps most of every
//   part free to stop in.
// The page can also say when not to snap at all (an open dialog, the mini
// player's enlarged phone, a password field with the focus).
//
// Why not lenis/snap: checked against Lenis 1.3.26, it snaps after a touchend
// (fighting native momentum on phones), aligns an element's top to the viewport
// top (under the header), judges from the scroll position plus the last wheel
// delta rather than where the glide will come to rest, and pulls back to a
// point the reader has just nudged away from. The rules above are a few lines
// on Lenis's own events, so they live here instead.

const REACH = 0.18; // of the viewport height
const READING_REACH = 0.12; // the reading pages' (see above)
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
 * @param {boolean} [forward] only places ahead of `rest` in the gesture's
 *   direction count (the reading pages); without it an overshoot is caught
 */
export function pickRestingPlace(places, from, rest, reach, forward = false) {
  const dir = Math.sign(rest - from);
  if (!dir) return null;
  let best = null;
  let gap = reach;
  for (const place of places) {
    if ((place - from) * dir < 1) continue; // behind where the gesture began
    if (forward && (place - rest) * dir < 1) continue; // behind where it came to rest
    const d = Math.abs(place - rest);
    if (d <= gap) {
      best = place;
      gap = d;
    }
  }
  return best === null || gap < 1 ? null : best;
}

/**
 * @typedef {object} ReadingPlaces
 * @property {() => number[]} places the resting places, in px of scroll,
 *   measured when a gesture ends
 * @property {() => boolean} [blocked] true while nothing may snap
 */
/** @type {ReadingPlaces | null} */
let reading = null;

/**
 * A reading page hands over its resting places (CaseTeaser.astro). Read when a
 * gesture ends, so it may arrive after the snap is attached.
 * @param {ReadingPlaces} source
 */
export function provideRestingPlaces(source) {
  reading = source;
}

/**
 * Wire the snap to a Lenis instance: the homepage's sections, or a reading
 * page's places; a no-op on a page that has neither.
 * @param {import('lenis').default} lenis
 * @param {() => void} wake restarts motion.js's parked rAF loop
 * @returns {() => void} detach
 */
export function attachSectionSnap(lenis, wake) {
  const hero = document.querySelector('main > section.hero');
  const home = Boolean(hero && hero.parentElement);
  const sections = home ? [...hero.parentElement.querySelectorAll(':scope > section[id]')] : [];

  let timer = 0;
  /** @type {number | null} */
  let from = null; // where the current wheel gesture began

  // Measured when a gesture ends, so a resize or a late image never leaves
  // them stale.
  const restingPlaces = () => {
    if (!home) return reading?.places() ?? [];
    const limit = lenis.limit;
    const places = sections.slice(0, -1).map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const landing = top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
      return Math.round(Math.min(Math.max(landing, 0), limit));
    });
    places.push(Math.round(limit)); // the last screen: Contact with the footer
    return places;
  };
  const blocked = () => !home && (!reading || Boolean(reading.blocked?.()));

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
    if (start === null || document.hidden || lenis.isStopped || lenis.isLocked || nativeMoving || blocked()) return;
    const reach = window.innerHeight * (home ? REACH : READING_REACH);
    const place = pickRestingPlace(restingPlaces(), start, lenis.targetScroll, reach, !home);
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
