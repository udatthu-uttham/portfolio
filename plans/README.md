# Animation plans

Written by the `improve-animations` audit on 2026-09-04 (no VCS in this folder; plans reference the code as of that date).

Latest implementation and verification: [CV and motion follow-through — 2026-09-06](005-motion-and-cv-2026-09-06.md). This records the current request's changes to the earlier scene revision and motion plans.

| # | Plan | Severity | Status |
|---|---|---|---|
| 001 | [Rebuild the SignalLoop so red means "help arrives"](001-signal-loop-help-not-stunt.md) | HIGH | DONE |
| 002 | [Pause the SignalLoop when the hero is off-screen](002-pause-signal-loop-offscreen.md) | MEDIUM | DONE (executed inside 001's script) |
| 003 | [Gate hover motion to fine pointers; add press feedback](003-hover-gating-and-press-feedback.md) | MEDIUM | DONE |
| 004 | [PageNavigator: compositor properties only](004-page-navigator-composite-only.md) | MEDIUM | DONE |

Recommended order: 001 → 002 (same file) → 003 → 004. No cross-plan dependencies beyond 001/002 sharing `SignalLoop.astro`.
Verification for every plan: `npm run build`, then the feel checks listed in each plan, then `review-animations` on the diff.
