# Reference teardown — yanliuportfolio.vercel.app

Live-extracted 2026-08-27 via computed styles + stylesheet rules. For tone-matching only, not literal copying (per the brief's reference set, §13). This is a separate site's system — nothing here is wired into our codebase.

## Base tokens

| Token | Value |
|---|---|
| Page background | `#FAF8F5` (`rgb(250,248,245)`) |
| Body text | `#1C1917` (`rgb(28,25,23)`) — a warm near-black, same family as our `ink-900` |
| Secondary text | `#44403C`, `#78716C`, `#A8A2A9` (a stone/warm-grey ramp) |
| Card surface | `#FFFFFF` |
| Segmented-control bg | `#F5F5F4`, border `stone-300/40` |
| Accent — mint/green | `#059669` (used sparingly, link or status color) |
| Dark glass (mobile notice) | `rgba(28,25,23,.92)` + `backdrop-filter: blur(12px)` |
| Signal colors | red `#FF5F57`, amber `#FEBC2E`, green `#28C840` — literally macOS traffic-light dots on a fake terminal window |
| Radii in use | `50%` (avatars/dots), `9999px` (pills), `16px`, `12px`, `8px`, `2px` |

## Typography

- **Body/UI font:** Noto Sans (self-hosted via `next/font`, exposed as `--font-noto`)
- **Mono accents:** Source Code Pro (`--font-mono`) — same family we use for our own `--font-mono`
- **Secondary mono:** Courier Prime (`--font-courier-prime`) — same family as our `--font-note`
- Heading example: 28px / weight 800 / letter-spacing **+4.2px** (tracked way out, on a dark badge) — a much heavier hand than our type scale (max weight 600, tracking only on eyebrows)
- Buttons run small: 11px, weight 500, in a segmented tab control (`Projects / Snapshot / Achievements`), padding `8px`, pill/rounded container `16px` radius, no per-button radius (the container clips)

## Signature interesting elements

The whole page is a **desk/scrapbook metaphor** — same instinct as our Paper/Sticky/Glass system, executed as literal skeuomorphic desk objects rather than material layers:

- **ID lanyard badge** — a name tag with a photo, tilted, hanging from a lanyard strap
- **Vinyl record widget** ("Vibe coding playlist") — a spinning record; see animation below
- **Concert-ticket stub** — perforated edge, "DESIGN X TECHNOLOGY" event styling
- **Flip-clock/dot-matrix logo tile** — an 8×8 LED-style "P" monogram
- **macOS terminal window** — real traffic-light dots (`#FF5F57 #FEBC2E #28C840`), monospace `whoami` / `ls interests/` commands typed out
- **Punched sticky note** — a yellow note with **four grommet holes** at the top edge (ring-binder style) instead of tape — a different "how is this note attached" answer than our washi-tape convention
- **Manila folder icon** — closes the desk-drawer metaphor

### Keyframe animations (verbatim from the site's stylesheet)

```css
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
/* applied to many small `rounded-full bg-text-muted/20` dots, each with a
   randomized duration (2.1–4.7s) and delay (0–4.5s) — an ambient starfield
   sparkle over the paper background, never in sync, never mechanical */

@keyframes vinyl-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(1turn); }
}
/* .group/vinyl:hover .vinyl-spin, .vinyl-spin-active {
     animation: 12s linear infinite vinyl-spin;
   }
   — the record only spins on hover (or a manually toggled "active" class),
   12s per rotation reads as believably heavy/analog, not a cheap spinner */

@keyframes vinyl-border-rotate {
  0% { --vinyl-angle: 0deg; }
  100% { --vinyl-angle: 360deg; }
}
/* animates a CSS custom property directly (@property-registered), driving a
   conic-gradient border ring around the record — a rotating light/reflection
   ring independent of the label's own spin */

@keyframes vinyl-progress-grow {
  0% { width: 0px; }
  100% { width: 100%; }
}
/* a "now playing" progress bar filling — ties the widget to actual audio state */
```

### Worth stealing (technique, not asset)
1. **Randomized-but-deterministic ambient motion** (the twinkle field) — same principle as our brief's sticky-note idle bob (hand-set angles, "reads as placed by a person, not randomized"), applied to a background layer instead of foreground objects.
2. **Hover-gated looping animation** (vinyl spin only runs on hover/active, not always) — cheaper, calmer, and more intentional than an always-spinning decoration.
3. **Animating a registered custom property** (`--vinyl-angle`) to drive a conic-gradient — a clean way to rotate a *gradient* (not just a transform), useful if we ever want a rotating light-catch on the glass bolts/dots or a "recording" ring anywhere.
4. **A second valid answer to "how is a paper item attached"** — grommets/binder holes, as an alternative to our washi tape, worth keeping in mind if a future note needs to read as "filed" rather than "stuck down."
