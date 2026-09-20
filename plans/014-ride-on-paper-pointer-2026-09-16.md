# Ride on the paper — pointer marks, paper grain, cursor (plan, 2026-09-16)

**Status: implemented 2026-09-16 (phases 1–4 and 6; phase 5 dropped: native cursor). Decisions taken by Uttham: native cursor, faint marks allowed on paper text and paper objects, 8 s hold with no erase on click, grain landed at 0.07. Validation in §11.** Written by Claude after reading Codex's
suggestions (pasted by Uttham on 2026-09-16) against the code as it stands. Codex's smoke work is
recorded in `plans/013`. This plan builds on it rather than replacing it. **Ownership: Claude has
taken over this thread from Codex (Uttham, 2026-09-16); Codex's module is inherited, not shared.**

---

## 1. What exists today (facts from the code)

| Piece | Where | State |
|---|---|---|
| Pointer smoke | `src/scripts/pointer-smoke.js`, `src/components/PointerSmoke.astro`, mounted in `Base.astro` | One fixed, full-viewport canvas at `z: var(--z-header) + 1`, click-through, aria-hidden. Fine mouse only; off under reduced motion, coarse pointer, hidden tab, drag. |
| Emission | same | **A puff every 45 ms of any movement** (every 20 ms in a burst). This is why it "follows your hand". A sustained fast gesture (≥110 ms and ≥220 px, reversals tolerated) fires the 2 s burst: 10 puffs at once, then 3 per 20 ms for 350 ms, 4.5 s cooldown. Cap 64 puffs. |
| Lifetime | same | Normal 600–700 ms, burst puffs expire within 2 s of the trigger. Fade-in 75 ms, ease-out `(1-p)^1.6`. |
| Material | same | `smokeMaterial()` walks `closest()` over a surface list: `.glass`/`.workboard` → glass, paper objects (tile, note, instax, cta, ai-mock) → paper, `data-smoke-surface` overrides. Blends over ~100 ms at emission; puffs keep their mix. |
| Sprites | same | Two 96 px sprites baked once: paper = four soft lobes + 160 baked grain dots; glass = lobes + white highlight. Colour is hard-coded `rgba(58,55,46,…)`, not read from a token. |
| Clearing | same | Cleared on **every scroll event**, pointerdown, blur, pagehide, pointerleave, visibilitychange, media change; resize re-inits. With Lenis, one wheel tick wipes the trail. |
| Bike exhaust | `SignalLoop.astro` | Eight pooled SVG circles, `--ink-600`, 650 ms, opacity ≤ .16, human riders only, never mid-jump. The pointer smoke already rhymes with it in colour and lifetime. |
| Paper grain | `global.css` `body::before` | Fixed pseudo-element at `z:-1`, 180 px tile of `feTurbulence` (fractalNoise, baseFrequency .9, 2 octaves), rect opacity **0.04**, `mix-blend-mode: multiply`. Hidden under `prefers-reduced-transparency`. At 1× it is not perceptible; the page reads as a flat near-white with dotted guides (`GridOverlay.astro`). |
| Cursor | — | Native arrow everywhere. The only override is `cursor: none` inside the page navigator, which draws its own handwritten label. |

Measured in the pane at 1024×768: eight synthetic hovers across the paper painted 863 canvas pixels
with a peak alpha of 21/255. The effect is present and very faint; real mouse motion emits far more
because samples arrive every ~8–16 ms.

---

## 2. Review of Codex's suggestions

| # | Codex proposes | Stance | Why |
|---|---|---|---|
| 1 | Visitor leaves **traces of riding**, not drawing | **Agree — this is the idea.** | It ties the pointer to the hero story (bikes, exhaust, "clearing the road") without adding a new motif. The burnout cloud finally has a reason to exist. |
| 2 | Normal movement: almost no marks; sharp turns: scuffs; fast back-and-forth: skid + smoke; stopping: smoke clears first, rubber lingers 6–10 s | **Agree, with one structural change.** | Lingering marks must live in **page space** (they belong to the paper and must scroll with it). The current canvas is viewport space and is *cleared on scroll*, so marks cannot be added to it. They need their own layer (see §4). |
| 3 | Broken, textured, like rubber on fibres; not a continuous line | Agree. | Stamp-based rendering (short dabs spaced along the path) with multiply blending, not a stroked path. |
| 4 | Glass collects no rubber; smoke may drift over glass | Agree. | Material detection already exists; marks reuse it with `glass → no emission`. |
| 5 | Paper: fine grain visible at normal size, sparse fibres and flecks, tonal unevenness, no obvious repeat | **Agree it is flat today.** | 0.04 is invisible. Raise it, add a second large-scale tonal layer and a sparse fibre tile. Two tiles of unrelated sizes make the repeat period effectively infinite. Keep it CSS-only. Watch legibility of 12 px labels; cap around 0.08. |
| 6 | Tyre marks pick up the same grain | Agree in spirit, not pixel-for-pixel. | Bake the mark sprites with the **same noise frequency** as the paper tile. Sampling the exact paper noise at page coordinates is possible but nobody can see the difference. |
| 7 | Paper first, then tune marks against it | **Agree — that is the order below.** | Marks on a flat surface will look like a drawing tool; on textured paper they read as residue. |
| 8 | Pointer stays precise; Codex prefers a **graphite arrow** custom cursor | **Disagree on priority; keep the native arrow.** | A custom cursor overrides the visitor's OS pointer size and colour settings (an accessibility preference), is a 32 px raster on most platforms (soft on retina unless `image-set` works), and adds a per-material rule set. The marks and smoke already carry the personality. Codex's own third option, "quiet arrow + refined exhaust", is the one I would ship. If Uttham wants to see it, gate a graphite arrow behind `?pointer=graphite` so both can be compared on the real page in minutes, then delete the loser. |
| 9 | Ordinary movement: much less emission | **Strongly agree.** | Current rate is constant while moving. Gate on speed and cut the rate (numbers in §5). Silence is the default state. |
| 10 | Fast straight: short stretched exhaust; stopping: one last wisp | Agree; cheap. | Anisotropic scale of the puff along heading when fast. Stopping already emits nothing. |
| 11 | Over links: hand cursor; over text: text cursor, suppress smoke | Agree, extend to marks. | Over `a, button, .cta, input, textarea`: no marks, no smoke. The pointer is parked at a control, not riding. Over paper body text: allow faint marks (rubber over ink is real and at ≤ 14% alpha it stays legible), but suppress the burst. |
| 12 | "Dust versus exhaust" | Fold it in, do not build it. | It is the same ladder: slow = nothing, medium = faint trace, fast = exhaust, reversal = skid + burst. No separate dust particle. |
| 13 | Avoid tiny-bike cursor, lagging follower, click explosions | Agree. | |

Things Codex's notes did not flag:

- **Scroll and click both erase.** For marks that is wrong: a click is a stop, not an eraser, and
  scrolling must repaint the marks at their new offset, not clear them.
- **Sticky header.** Page-space marks that scroll upward would be drawn over the header if the canvas
  stays above it. The marks layer must sit **below `--z-header`** and above content.
- **Hard-coded colour** in the sprites. Read `--ink-600`/`--ink-900` from computed style once at init
  so the smoke follows the tokens like everything else.
- **Mobile sees none of this.** Coarse pointers get no smoke and no marks, so on phones the paper grain
  is the only part of this work that lands. Another reason to do the paper first and do it well.
- **One module, one owner.** `pointer-smoke.js` is inherited from Codex. The marks need the same pointer
  samples, so the clean shape is one sampler feeding two renderers; Claude owns the merge.

---

## 3. The model: one gesture ladder, two renderers

Every pointer sample gives speed `v` (px/ms), heading, turn `Δθ` (radians between consecutive
headings) and whether the direction reversed (dot product of consecutive velocities < 0).

| Gesture | Smoke (air, viewport space) | Marks (rubber, page space) |
|---|---|---|
| Still, or slow (`v < 0.6`) | nothing | nothing |
| Cruising (`0.6 ≤ v < 1.2`) | nothing | occasional faint trace only when turning (`slip > 0.15`) |
| Fast straight (`v ≥ 1.2`, small `Δθ`) | sparse puffs, stretched along heading | nothing (tyres are gripping) |
| Sharp turn (`Δθ ≥ 0.35 rad` at `v ≥ 0.6`) | one puff | short curved scuff, alpha ∝ slip |
| Reversal (`dot < 0`, `v ≥ 1`) | — | 120 ms skid window at full slip |
| Burst (existing detector: sustained fast, reversals tolerated, ≥110 ms & ≥220 px) | existing 2 s cloud, unchanged | skid at double alpha for the burst window |
| Over glass | lighter wisps (exists) | none |
| Over a control (`a, button, .cta, input, textarea`) | none | none |
| Stop | last puffs finish in ≤ 700 ms | marks stay ~8 s, then fade over 3 s |

`slip = clamp((|Δθ| − 0.35) × 2, 0, 1) × clamp(v / 1.5, 0, 1)`, set to 1 during a reversal or burst
window. Marks are emitted only when `slip > 0.15`. The burst detector is Codex's `updateGesture`,
reused as is, so marks and smoke never disagree about what a burnout is.

---

## 4. Architecture

Two canvases, one sampler.

| Layer | Space | z | Blend | Lifetime | Cleared by |
|---|---|---|---|---|---|
| **Marks** (`PointerMarks.astro`, new) | page: each dab stores `(x, pageY)`; painted at `pageY − scrollY` | new token `--z-surface-fx: 5` (above content, below header 10, float 20) | `multiply` on canvas | 8 s + 3 s fade (`--linger`, one new token) | resize, media change, pagehide. **Not** by scroll or click. Scroll → repaint. |
| **Smoke** (existing, moved into the shared module) | viewport | `calc(var(--z-header) + 1)` as today | source-over | as today | as today |

- One module `src/scripts/pointer-ride.js` exports `initPointerRide({smokeCanvas, marksCanvas})`.
  It owns the `pointermove` listener and the gesture state, and calls `smoke.emit()` / `marks.emit()`.
  Codex's smoke functions move in unchanged; `pointer-smoke.js` is deleted at the end of the work.
- Marks render as **stamps**: 3 baked sprites (≈ 12×6 px at 1×, elongated, edges broken by the same
  fractalNoise frequency as the paper), rotated to heading, spaced every 3–4 px of travel, alpha
  `0.05 + 0.12·slip`. Colour `--ink-900`. Cap 320 dabs; oldest dropped.
- Frame loop runs only while marks are fading or a scroll is in progress; idle = zero frames, same
  discipline as the smoke.
- DPR/pixel-area cap identical to the smoke canvas.
- Gates: `(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)`, plus
  `prefers-contrast: more` → marks off (they lower text contrast a little). `aria-hidden`,
  `pointer-events: none`, `contain: strict`.

Why not one canvas: marks need to sit under the header and scroll with the page; smoke needs to drift
over everything and is disposable. Different z, different space, different lifetime.

---

## 5. Starting numbers (tune in-page, all replaceable)

**Smoke, ordinary movement (changes to Codex's values)**

| | Today | Proposed |
|---|---|---|
| Emit when | any movement | `v ≥ 1.2` px/ms or `slip > 0.15` |
| Interval | 45 ms | 120 ms |
| Puff shape when fast | round | scaled 1.6× along heading |
| Burst | unchanged | unchanged |

**Marks**

| Parameter | Value |
|---|---|
| Dab spacing | every 3–4 px of travel |
| Dab size | 10–14 × 4–6 px at 1×, ±20% jitter, rotated to heading ± 0.15 rad |
| Alpha | `0.05 + 0.12 · slip` (skid ≈ 0.17, burst ≈ 0.3) |
| Colour / blend | `--ink-900`, multiply |
| Life | 8000 ms hold, 3000 ms fade (`(1−p)^1.4`) |
| Cap | 320 dabs |

**Paper grain (CSS only, `body::before`)**

| Layer | Purpose | Spec |
|---|---|---|
| Tooth | fine grain visible at 1× | existing feTurbulence tile, opacity 0.04 → **0.07**, baseFrequency .9 → .75 so the grain is slightly coarser than a device pixel |
| Tone | uneven paper colour | second feTurbulence tile, baseFrequency 0.004, 1 octave, opacity 0.035, tile 1100 px |
| Fibres | sparse flecks and hairs | hand-authored SVG tile 640 px with ~14 short strokes and ~20 dots at 2–3% ink, random rotations |

Three background layers on the one fixed pseudo-element; tile sizes 180 / 1100 / 640 share no small
common multiple, so no visible repeat. Keep `mix-blend-mode: multiply`, keep the
`prefers-reduced-transparency` gate, add `prefers-contrast: more` → none.

**Tokens (three additions to `:root`, so nothing is a magic number)**

- `--z-surface-fx: 5`
- `--linger: 8000ms`
- `--grain-opacity: 0.07` (referenced by the tooth layer)

---

## 6. Cursor stance

Ship the **native arrow**. Reasons in §2 row 8. If Uttham wants to compare, the graphite arrow is a
32 px PNG with hotspot `2 2` behind `?pointer=graphite` (body class toggled at load), links keep
`pointer`, text keeps `text`, the navigator keeps its own label cursor. Decide in-page, delete the
loser the same day. Not part of phases 1–3.

---

## 7. Order of work

1. **Paper** — grain, tone, fibres in `global.css`. Check 12 px labels, the annotation, the Instax
   caption and the sticky notes for legibility at 1× and 2×. Check 320 / 390 / 768 / 1440.
2. **Sampler + smoke** — create `pointer-ride.js`, move the smoke in unchanged, add speed/turn/
   reversal to the sample, reduce ordinary emission, stretch fast puffs, read colours from tokens,
   suppress over controls. Behaviour of the burst must be byte-for-byte the same.
3. **Marks** — `PointerMarks.astro` + marks renderer, page-space repaint on scroll, lifetime and fade,
   material and control gating, tokens.
4. **Tune together** — marks against the new paper; aim for "residue", not "drawing".
5. **Optional** — cursor A/B.
6. **Docs** — `docs/design-tokens.md` / `.json`: three tokens, the ladder in one paragraph, the
   two-layer rule (rubber on paper only, smoke anywhere).

Each phase is one review point. Phase 1 alone is worth shipping.

---

## 8. Verification

- Headless (Codex's `tmp/` pattern): feed recorded pointer traces (straight, S-curve, zigzag, hard
  reversal, click-in-motion, scroll-in-motion) into the sampler and assert mark counts, alpha ranges,
  no marks over glass, no marks over controls, marks survive click and scroll, zero frames pending once
  faded.
- In-page: screenshot paper at 1× and 2× before/after grain; skid visible under a glass edge should not
  exist; marks scroll with the paper; header hides marks passing under it; frame time while scrolling
  with 320 live dabs stays under 4 ms on the pane.
- Preferences: reduced motion → no marks, no smoke; reduced transparency → no grain; contrast more →
  no grain, no marks. Coarse pointer → nothing but grain.
- Build passes; no new dependencies.

---

## 9. Decisions needed before coding

1. Cursor: native (recommended) or run the graphite A/B first?
2. Marks over paper text and paper objects (tiles, notes, Instax): allow faint marks (recommended) or
   page paper only?
3. Marks lifetime ≈ 8 s + 3 s fade, and a click does **not** erase them — agreed?
4. Grain: land at 0.07 (recommended) or mock 0.06 vs 0.09 behind a query flag first?
5. ~~Who implements~~ — resolved: Claude implements and verifies; Uttham reviews at each phase.

## 10. Not doing

Tiny-bike cursor, lagging follower, click explosions, WebGL, new dependencies, any change to the hero
scene, any change to copy.

---

## 11. Implemented and validated (2026-09-16)

**Files.** `src/scripts/pointer-ride.js` (new: sampler + Codex's smoke renderer + marks renderer + coverage cap; `pointer-smoke.js` deleted), `src/components/PointerRide.astro` (new, two canvases; `PointerSmoke.astro` deleted), `src/layouts/Base.astro` (mounts PointerRide), `src/styles/global.css` (three tokens; fibres on the body background; tooth + tone on `body::before`; `prefers-contrast: more` gets flat stock and no marks), `docs/design-tokens.md` / `.json`, `tmp/verify-pointer-ride.mjs` (24 headless checks).

**Departures from the plan, all in the plan's spirit.**
- The burnout trigger now also requires a reversal within the last 400 ms. Codex's detector fired on any sustained fast motion, so a plain fast swipe would have left a dark skid; Codex's own brief reserves the burnout for rapid back-and-forth. A fast straight swipe now leaves exhaust only.
- Rubber saturates: a coverage grid (4 px cells, cap 0.34) bounds how dark any spot can get. Without it, six zigzag passes stacked to near-black under the cloud.
- The slip model is a lagging bike heading (τ 90 ms) against a lightly smoothed path direction (τ 28 ms): sideways slip above |sin| 0.5, longitudinal slip on reversal. It replaces the raw per-sample turn angle, which was too noisy at pixel scale.
- Fibres live on the body background (they scroll with the sheet); only the tooth and tone are fixed. Fixed hairs would have read as dust on the screen.
- Marks compose source-over on their transparent canvas; darkness is bounded by the coverage cap, not by a blend mode.

**Headless (node `tmp/verify-pointer-ride.mjs`, 24/24):** slow → nothing; fast straight → exhaust, stretched, no rubber, no burnout; gentle arc → nothing; sharp corner → 156 px tapering scuff at 0.06–0.10 alpha, no burnout; reversal → skid; zigzag → one burnout, cooldown holds, rubber at 0.18, puffs 10 then 3; glass → exhaust only; controls → nothing; re-entry after a gap → nothing; dab spacing; coverage cap saturates, refuses, releases.

**Live (pane at 1024×768, synthetic mouse traces at 8 ms):** rubber appeared only at the corner and in the zigzag, none along the straight run; the burnout cloud showed on the zigzag; after `scrollTo(0, 200)` the marks moved up exactly 200 px and the smoke cleared; both canvases mounted at z 5 and 11; below 768 px wide the pane emulates a touch phone and nothing is emitted, as designed. The sheet at 2× shows a fine tooth and a few faint hairs; the paper keeps its colour.

**Cost:** 320 dabs redraw in 0.3 ms on a 1536×1152 backing bitmap. No frame loop while marks are held or nothing is on either canvas.

**Live cap check (2026-09-17):** an eight-leg zigzag over one line on the real event path reached a maximum canvas coverage of 0.52 with the cell cap at 0.34 — neighbouring cells stack. Cap lowered to 0.26; re-run on the real event path: 49 events delivered, 82 px skid, darkest pixel at 0.40 coverage, smoke cloud present, screenshot shows a compact rubber-grey mark under the cloud, never black. The same run also exposed a teleport case: the real mouse moving while a synthetic pointer started made the sampler see a 500 px jump and lay rubber along it. One pointer cannot do this, but a re-entry or a swallowed event could, so a jump over 160 px at more than 8 px/ms now settles the ride and lays nothing. Tune-in-page knobs are all in `RIDE` at the top of the module, plus `COVER_CAP`, `--grain-opacity` and `--linger`.
