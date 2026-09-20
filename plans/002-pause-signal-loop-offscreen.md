# 002 — Pause the SignalLoop when the hero is off-screen

- **Status**: DONE — checked 2026-09-06
- **Commit**: no VCS — written 2026-09-04
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/SignalLoop.astro` script), ~15 lines

## Problem

`SignalLoop.astro:250–288` runs `requestAnimationFrame(render)` for the life of the page. The hero is the first of six sections; for the whole remaining scroll the loop keeps writing four SVG transforms per frame to an element nobody can see.

```js
// src/components/SignalLoop.astro:304–308 — current
function start() {
  if (running || motionPreference.matches) return;
  running = true;
  frameId = requestAnimationFrame(render);
}
```

## Target

```js
// target — gate on visibility; start() and stop() already exist
const visibility = new IntersectionObserver(
  ([entry]) => { if (entry.isIntersecting) start(); else pause(); },
  { rootMargin: '20% 0px' }
);
function pause() { running = false; if (frameId) cancelAnimationFrame(frameId); frameId = 0; }
visibility.observe(root);
if (motionPreference.matches) settle();   // the observer starts the loop otherwise
```

`pause()` differs from the existing `stop()` in that it does not call `settle()` — the scene is invisible while paused, and the phase clock (`performance.now() % CYCLE`) means it resumes in the right beat.

## Repo conventions to follow

- Same `IntersectionObserver` idiom as `initReveals()` in `src/scripts/motion.js:74–90`.
- Keep the reduced-motion listener (`motionPreference.addEventListener('change', …)`) calling `stop()`/`start()` as today.

## Steps

1. Add `pause()` next to `stop()`.
2. Create the observer after `start`/`stop` are defined; observe `root` (the `.signal-loop` element).
3. Replace the trailing `if (motionPreference.matches) settle(); else start();` with `if (motionPreference.matches) settle();` — the observer's first callback starts the loop when in view.

## Boundaries

- Do NOT change any timing constant or the render body.
- Do NOT observe the `<svg>` — observe `root`, which has layout.

## Verification

- **Mechanical**: `npm run build` passes. In the browser, scroll to `#contact`, then run `performance.now()` twice 1s apart while polling `document.querySelector('[data-rider]').getAttribute('transform')` — it must not change while the hero is off-screen; scroll back to the top and it resumes within one frame.
- **Feel check**: scrolling back up never shows a stale frame longer than one repaint.
- **Done when**: no rAF work while the hero is out of view (Performance panel shows an idle main thread on the contact section).
