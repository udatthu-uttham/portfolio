# Pointer smoke and EV bot — 2026-09-16

Implemented the approved changes:

- Right-facing robot profile, single visible eye and forward-leaning torso; small electric drive panel on its existing motorcycle.
- Sparse, world-space exhaust from the two human bikes only. Eight pooled SVG puffs, 650ms lifetime, no emission during jumps or reduced motion.
- Shared `PointerSmoke.astro` in the base layout, backed by `pointer-smoke.js`. Fine mouse only; click-through and hidden from accessibility. The existing pointer is unchanged.
- Normal puffs live 600–700ms. Sustained fast motion (including reversals) emits a brief denser burst; all burst puffs expire within two seconds of its trigger. 4.5-second cooldown and a 64-puff cap.
- Paper/glass appearance is determined by the nearest material surface, with paper objects overriding a surrounding glass board. Emission blends between materials; existing puffs retain their initial mix.
- Two cached sprites, capped canvas resolution and on-demand rendering; no idle animation loop. Clear on preference changes, scroll, resize, hidden tab, drag start, blur or pointer exit.

Validation: production build; pointer lifecycle/gesture/material tests in `tmp/verify-pointer-smoke.mjs`; scene lifecycle, variation and exhaust checks. Browser visual checks of both materials and robot profile; burst fade reported zero painted pixels and zero pending frames after two seconds. Production canvas verified fixed, pointer-events:none, aria-hidden and single-instance. Temporary visual harnesses are kept in tmp rather than published.
