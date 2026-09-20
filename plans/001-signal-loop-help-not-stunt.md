# 001 — Rebuild the SignalLoop so red means "help arrives", not "stunt"

- **Status**: DONE — revised same day (see bottom)
- **Commit**: no VCS in this folder — written 2026-09-04 against `src/components/SignalLoop.astro` as of that date
- **Severity**: HIGH
- **Category**: Purpose & frequency · Easing & duration · Physicality & origin
- **Estimated scope**: 1 file (`src/components/SignalLoop.astro`), full markup + script rewrite (~250 lines); reads `public/assets/scene/bike-rider.svg` at build

## Problem

The hero's focal animation contradicts the copy it sits under ("I run the signals — setting direction, deciding how to ship, and clearing the road for my teams"):

- On green three identical riders cross; on red **one** rider runs the red light off a ramp and backflips. The signal decides nothing; the red rewards the stunt.
- The ramp arrives with `ease-in` from 740 units above the canvas (`SignalLoop.astro:240–247`): `dropOffset = -740 * (1 - p*p*p)` — a spawn, not a placement. Ease-in on an entrance is always a finding.
- The flight spin is linear: `place(redBike, point, -360 * flightProgress)` (`:282`) and the rider is only upright at the last frame.
- There are no rests: ~20ms between the group leaving and the ramp falling, 0ms between landing and green.
- Riders are one sprite stamped three times at exactly 130 units (`data-rider="0|130|260"`), same scale, same y, moving as a block — it reads as copy-paste, not a team.
- The scene carries four amber objects (each rider's tank) where the site allows one accent.

## Target (this is also the micro-interaction spec)

**Trigger.** Page load; runs only while `.signal-loop` is in view (see plan 002). **Modes.** `prefers-reduced-motion: reduce` → `settle()`: green lamp, the pack mid-crossing, ramp hidden (static frame). Tab hidden → rAF pauses natively.

**Rules — one loop, two phases, one cast.**

| Phase | Beat | Timing | Easing |
|---|---|---|---|
| GREEN 2.3s | Pack crosses west→east in formation, subtle individual bob and lead/lag | enter 0.2s, exit 2.28s along `#green-path` (M-330 590 H790, ~530 u/s) | linear travel (constant motion), sine bob |
| RED 2.9s | 0.30s rest — empty road under a red lamp | `RED_REST = 0.30` | — |
| | Help arrives: the amber ramp is **set down** from 90 units above onto the road, fading in | `RAMP_LAND = 0.55`, `RAMP_FROM = -90` | `1-(1-p)^3` (ease-out cubic); opacity `min(1, p/0.3)` |
| | Pack enters west while the ramp settles; each rider follows **one** composite path `#hop-path` — flat, up the ramp face, a hop arc that clears the signal head, a landing dip (follow-through), flat out | `HOP_ENTER = 0.45`; position = shared path length `L = (t − HOP_ENTER) × 530` + each rider's lead (0 / 118 / 262) | pitch from the path tangent (nose up the face, nose down into the landing) |
| | Help withdraws: once the rear rider is past the ramp the ramp lifts and fades | `LIFT_AT = HOP_ENTER + 840/530 ≈ 2.03s`, `RAMP_LIFT = 0.45` | `p^3` (ease-in cubic — leaving) |
| | Phase ends when the rear rider is off-canvas east | `RED_DURATION = HOP_ENTER + (HOP_TOTAL − 300)/530 ≈ 2.9s` | — |

Cycle ≈ 5.2s. **Feedback.** Lamps (red/green fill, `--dur-1`), the ramp (position + opacity), the riders (position, pitch, bob).

**Cast.** Three riders in muted liveries (petrol, slate, plum) with different helmets and ≤6% scale variance — a team. The **ramp is the one amber object**: it is his help. No jumper, no dust, no captions (all four captions are cropped by `.hero__art-window` at every breakpoint — verified).

```js
// target constants (seconds, SVG units)
const GREEN_DURATION = 2.3, GREEN_ENTER = 0.2, GREEN_EXIT = 2.28;
const RED_REST = 0.30, RAMP_LAND = 0.55, RAMP_LIFT = 0.45, RAMP_FROM = -90;
const HOP_ENTER = 0.45, SPEED = 530, RAMP_CLEAR_LENGTH = 840, EXIT_MARGIN = 300;
```

```html
<!-- target paths -->
<path id="green-path" d="M-330 590 H790"></path>
<path id="hop-path" d="M-440 590 H200 C222 590 246 540 278 509 C330 445 470 520 600 590 C615 596 630 596 645 590 H1100"></path>
```

```css
/* target liveries — CSS variables consumed by the inlined bike paths */
.rider--a { --livery: #6e9a9c; --livery-shade: #4f7779; }                      /* petrol */
.rider--b { --livery: #7b86a8; --livery-shade: #5b6588; --helmet: #a9a6ab; }  /* slate, pale helmet */
.rider--c { --livery: #a5809a; --livery-shade: #82617a; --helmet: #74707b; }  /* plum, mid helmet */
.ramp__body { fill: var(--amber-400); }                                        /* the one amber: his help */
```

## Repo conventions to follow

- Scene tokens: stroke `var(--graphite)`, fills `var(--paper-0|1|2)`, accent `var(--amber-400|500|700)` — all defined in `src/styles/global.css :root`.
- Motion: the UI scale lives in `--dur-*`; this scene is narrative choreography and keeps its own beats (documented as exempt in `docs/design-tokens.md` → Motion). The lamp fill already uses `var(--dur-1) var(--ease-standard)` — keep.
- Reduced motion pattern to imitate: `SignalLoop.astro` `settle()` + `motionPreference.addEventListener('change', …)`.
- Exemplar of build-time asset inlining does not exist yet; use `node:fs` `readFileSync(new URL('../../public/assets/scene/bike-rider.svg', import.meta.url), 'utf8')` in the frontmatter (Vite refuses `?raw` from `public/`).

## Steps

1. **Frontmatter** — read `bike-rider.svg`, strip the `<svg>` wrapper, and turn the six colored fills into tokens (use `style=` — presentation attributes are less reliable with `var()`):
   `fill="#F3B44A"` → `style="fill:var(--livery,#F3B44A)"`; `fill="#C8871F"` → `style="fill:var(--livery-shade,#C8871F)"`; the helmet path (its `d` starts `M56.2024 12.4607`) `fill="#39363F"` → `style="fill:var(--helmet,var(--suit,#39363F))"`; every other `fill="#39363F"` → `style="fill:var(--suit,#39363F)"`. Expose as `bikeInner`.
2. **Defs** — replace the `<image>` inside `<g id="provided-bike">` with `<g transform="translate(-53.5 -53.5)" set:html={bikeInner} />` (same 1:1 placement). Replace `#flip-approach` and `#flip-flight` with `#hop-path` above.
3. **Markup** — delete `#phase-label`, `#dust`, `#bike-red`. Riders become
   `<g class="bike rider rider--a" data-rider="0" data-scale=".94" data-phase="4.2">`, `rider--b` `118 / .97 / 2.1`, `rider--c` `262 / 1 / 0`, each wrapping `<use href="#provided-bike"></use>`. Keep the signal group **after** the riders. Update `aria-label` to: "Three motorcyclists cross a green signal together; when it turns red a ramp is set down for them and they ride over it one after another."
4. **CSS** — delete `.rider--a/.rider--c` filters, `.dust`, `.caption`, `.caption--muted`; add the livery block and `.ramp__body { fill: var(--amber-400); }`.
5. **Script** — replace the whole `<script>` with the target: `pointAtLength(path, at)` (clamped, tangent angle), `place(rider, point, angle, seconds)` adding `y += (1 − scale) × 27.5 − 1.2·sin(10t+phase)` and `angle += 0.8·sin(10t+phase)`, `setRamp(red)` with the set-down/lift easings above, `render()` with the two phases (green: `base = total × p`, each rider at `base + lead + 7·sin(2.2t+phase)`; red: `L = (red − HOP_ENTER) × SPEED`, hide a rider whose `L + lead` is outside `[0, HOP_TOTAL]`), `settle()` (green, `pointAtLength(greenPath, 0.52 × total + lead)`), and the reduced-motion listener.
6. Run plan 002's IntersectionObserver gate in the same script.

## Boundaries

- Do NOT touch `index.astro`, the hero CSS, or `motion.js`.
- Do NOT reintroduce the backflip; if the owner wants the wink back, it is a later, separate plan.
- Do NOT add dependencies. Do NOT change the ramp's vector shape (its lip at x≈314 matches the path).
- If `bike-rider.svg` no longer contains exactly 4 amber fills and 2 `#39363F` fills, STOP and report.

## Verification

- **Mechanical**: `npm run build` → "5 page(s) built"; in the browser `document.querySelectorAll('[data-rider]').length === 3`, `#hop-path` exists, no `#bike-red`, `getComputedStyle(document.querySelector('.rider--a use'))` is irrelevant — instead check a livery path inside the `<use>` shadow renders petrol (`#6e9a9c`) via a screenshot.
- **Feel check** (DevTools → Animations panel is N/A for rAF; use a screen recording at 0.25× or frame-step): the ramp *lands* — decelerating, never bouncing; the first rider reaches the ramp base ≥0.2s after it has landed; each rider's nose lifts up the face and drops into the landing dip; riders are never stacked or clipped at the west edge on entry; the ramp lifts only after the rear rider's rear wheel is past it; under `prefers-reduced-motion` the still frame shows the three riders under a green lamp.
- **Done when**: cycle ≈ 5.2s (`CYCLE` logged), no rider or ramp pop-in/pop-out, and the amber appears on exactly one object (the ramp) in every frame.


## Revision (2026-09-04, later)

Owner feedback after the first cut: bring the backflip back, randomised, with a bigger jump; the ramp read too big and too yellow.
- The hop is now three joined paths (`#hop-approach`, `#hop-flight`, `#hop-out`) so the script knows the exact flight span. Flight: `M278 526 C335 395 545 515 660 590` (takeoff→landing 382 units, was 322; apex ≈ y 481, rider top ≈ 427, under the head).
- Per rider per cycle a deterministic pseudo-random choice (`flipsThisCycle`) adds a full backflip that starts the instant the rider leaves the lip: `spin = min(1, flightT / 0.85)`, `angle = tangent − 360·(1 − (1 − spin)²)` — fast off the ramp, complete by 85% of the flight, upright for the landing.
- Ramp shrunk to ~70% (`M262 597 C282 596 302 582 312 553 L318 553 L318 597 Z`) and tinted pale: `color-mix(in oklab, var(--amber-400) 45%, var(--paper-1))` with a `--paper-2` fallback.
