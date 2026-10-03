// The magnetic snap (Uttham, 2026-10-03: "can we do a weak magnetic scroll of
// sorts to center these sections in viewports", and later that day: "improve
// magnetic scroll strength on home page, and bring it on l2 pages as well").
// Every homepage section is one screen with its content centred in it
// (CLAUDE.md, the screen contract), so each has one place where it sits right:
// its top under the fixed header, exactly where a nav jump lands it (the
// section's own scroll-margin-top). The last, Contact, is the exception: it
// shares the last screen with the footer, so its place is the page bottom.
// Where the two fit that is also where its nav jump lands; on a short window
// they part by a few px, and two places that close would settle in two steps.
// When a wheel or trackpad gesture comes to rest close to one of those places,
// the page eases the rest of the way; anywhere else it stays exactly where the
// reader left it.
//
// Magnetic, never in the reader's way, by five rules:
// - Reach: only within 30% of a screen of a resting place (REACH; it was 18%
//   until 2026-10-03, which caught little but a near miss). Stop further off
//   and nothing happens.
// - Direction: a snap only finishes the move the reader made. A resting place
//   behind where the gesture began never counts, so a nudge away from a section
//   is never pulled back (a mouse wheel's notch would otherwise be undone every
//   time), while an overshoot within one gesture is caught.
// - Room: however wide the reach, it never covers more than GAP_SHARE of the
//   gap between a place and its neighbour, so between any two places there is
//   always a stretch, at least 30% of it, where a rest is left alone. The
//   homepage's screens are too far apart for this to bind (a screen less the
//   header, of which 35% clears 30% of the screen on any laptop); it is for
//   the reading pages below, whose parts can stand 180px apart.
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
// THE READING PAGES settle too (Uttham, 2026-10-03: "and some magnetic scroll
// to these also shuold be implemented"): the case teasers and the AI Space
// one-pagers (CaseTeaser.astro) hand over their own resting places through
// provideRestingPlaces() — each the scroll position where a part of the
// reading becomes the one the phone shows, its heading just across the
// reading line. A resting place there is a change of state, not just a tidy
// position, so the reach is shaped differently:
// - Ahead, READING_REACH: a gesture resting short of the next part is carried
//   on to it, from a little under a quarter of a screen away (12% until
//   2026-10-03). The parts of a reading page are a fifth to a whole screen
//   apart, not a screen each, so the homepage's reach would cover most of
//   the gap between two short parts; the Room rule caps it besides.
// - Behind, READING_BACK: a gesture down the page that overshoots a part's
//   landing by a little is settled back onto it, so the heading stands on the
//   reading line. It was forward only before 2026-10-03; the pull back is
//   small, and it can only ever reach the place the reader has just crossed —
//   the nearest behind the rest — which keeps the phone on the screen the
//   reader scrolled to, never flipping it back to the one before. Scrolling
//   up there is no pull back at all: a rest just short of a landing has left
//   that part, and settling onto the landing would put its heading back on
//   the line and flip the phone to the screen just left. Going up, the snap
//   only carries on, to a heading the reader is returning to. The Direction
//   rule still holds either way, so a nudge away from a part is never undone.
// The page can also say when not to snap at all (an open dialog, the mini
// player's enlarged phone, a password field with the focus).
//
// Why not lenis/snap: checked against Lenis 1.3.26, it snaps after a touchend
// (fighting native momentum on phones), aligns an element's top to the viewport
// top (under the header), judges from the scroll position plus the last wheel
// delta rather than where the glide will come to rest, and pulls back to a
// point the reader has just nudged away from. The rules above are a few lines
// on Lenis's own events, so they live here instead.

const REACH = 0.3; // homepage: of the viewport height, ahead of the rest and behind it alike
const READING_REACH = 0.22; // reading pages, ahead: carrying the gesture on to the next part
const READING_BACK = 0.1; // reading pages, behind: an overshoot past the part just entered
const GAP_SHARE = 0.35; // of the gap between two places: the most either side's reach may cover
const WAIT_MS = 200; // quiet after the last wheel event (trackpad momentum included)
// Above the --dur-* ladder on purpose: a page move is slower than UI feedback.
// 0.8s until 2026-10-03, when the whole snap was made firmer.
const DURATION = 0.6; // s
// A damped settle: the site's own lerp glide in closed form (1 − 2^−10t, the
// curve Lenis itself eases with), run to the pixel in DURATION. Fast in, so it
// picks up a glide still in motion without a jolt; decisive, most of the way
// there in a third of the time; and it only ever approaches, never bounces.
const easeSettle = (t) => (1 - 2 ** (-10 * t)) / (1 - 2 ** -10);
const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/**
 * @typedef {object} Reach how far a place may be from the rest, in px of
 *   scroll, and still pull
 * @property {number} ahead in the gesture's direction: the move is carried on
 * @property {number} behind against it: an overshoot is caught
 * @property {number} [limit] the page's scroll limit; with the page top it
 *   stands in for the missing neighbour of the first and last place
 */

/**
 * The resting place a gesture should settle on, or null to leave the page be.
 * Pure, so the rules can be checked without a browser.
 * @param {number[]} places resting places, in px of scroll, in any order
 * @param {number} from where the gesture began
 * @param {number} rest where the page will come to rest without a snap
 * @param {Reach} reach
 */
export function pickRestingPlace(places, from, rest, reach) {
  const dir = Math.sign(rest - from);
  if (!dir) return null;
  const sorted = [...new Set(places)].sort((a, b) => a - b);
  if (sorted.some((place) => Math.abs(place - rest) < 1)) return null; // coming to rest on one already
  const limit = reach.limit ?? Infinity;
  let best = null;
  let near = Infinity;
  sorted.forEach((place, i) => {
    if ((place - from) * dir < 1) return; // behind where the gesture began
    const d = Math.abs(place - rest);
    if (d >= near) return;
    // Room: the rest lies between this place and its neighbour on that side
    // (the page's end, past the first or last); the reach stops well short of
    // the neighbour, so a rest in the middle of the gap is nobody's.
    const side = Math.sign(rest - place);
    const across = sorted[i + side] ?? (side > 0 ? limit : 0);
    const room = Math.abs(across - place) * GAP_SHARE;
    const ahead = (place - rest) * dir > 0;
    if (d <= Math.min(ahead ? reach.ahead : reach.behind, room)) {
      best = place;
      near = d;
    }
  });
  return best;
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
    const vh = window.innerHeight;
    const rest = lenis.targetScroll;
    const reach = {
      ahead: vh * (home ? REACH : READING_REACH),
      // a reading page catches an overshoot only on the way down (see above)
      behind: vh * (home ? REACH : rest > start ? READING_BACK : 0),
      limit: lenis.limit,
    };
    const place = pickRestingPlace(restingPlaces(), start, rest, reach);
    if (place === null) return;
    lenis.scrollTo(place, { duration: DURATION, easing: easeSettle, userData: { initiator: 'snap' } });
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
