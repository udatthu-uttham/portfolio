# Reference teardown — pleurat.com

Live-extracted 2026-08-27 via computed styles + stylesheet rules. For tone-matching only (brief §13). **This site is almost certainly the direct ancestor of our own token set** — see the note at the bottom.

## Base tokens

| Token | Value | Matches our token |
|---|---|---|
| Ink (headings/body) | `#16140E` (`rgb(22,20,14)`) | **Identical** to our `--ink-900` |
| Amber accent | `#F3B44A` (`rgb(243,180,74)`) | **Identical** to our `--amber-500` |
| Amber, darker | `#C77E0A` (`rgb(199,126,10)`) | Near-identical to our `--amber-700` `#C8871F` |
| Muted ink | `#8B8577`, `#57534A` | Same family as our `--ink-600`/`--ink-400` |
| Paper surfaces | `#FBF7E6`, `#FFFCF0` | Warmer/yellower than our current `--paper-0` `#FAF9F4`, but the same "near-white stock" idea |
| Dark hero background | `rgb(5,7,17)` on `rgb(239,237,226)` text | A near-black intro section — the page opens dark, then transitions to the light paper theme (a light/dark toggle exists site-wide, see below) |
| Radii | `2px`, `50%` only | **Sharp, not pill** — see CTA note below |

## Typography

- **Font:** "General Sans" — **the exact same family** we self-host as `--font-paper`
- H1: 45px / weight 500 / letter-spacing **-1.44px** (about -3.2%) / line-height 51.3px (1.14) — heavier negative tracking than our `--text-hero` (-2.5%) but same idea
- H2: 41px / weight 500 / -1.23px tracking
- H3: 23px / weight 500 / -0.575px tracking
- Body: 18px / line-height 27px (1.5)

## CTAs

**Sharp corners, not pills** — `border-radius: 0px` on both the primary (amber-filled, "View selected work ↗") and ghost (outlined, "About me ↗") buttons, padding `13px 22px`, `transition: background .2s, transform .15s`. This is the opposite of our current `--radius-pill` CTA convention — worth knowing since it's likely where the *sharp-corner* instruction earlier in this project's history originally came from, before the tokens locked pill radius for CTAs.

## Signature interesting elements

- **The hero art is a line-art city street scene** — a walking figure, buildings, a tree, a bicycle, lampposts, and an amber map-pin — rendered in the same graphite-outline-plus-one-amber-accent style as our own `SignalLoop` component. This is unmistakably the same visual lineage as our motorcyclist/traffic-signal scene.
- **The walking figure is a fully rigged, procedural walk-cycle**, not a sprite loop — separate `<g>` layers animate independently and recombine into a believable gait:

```css
/* all ~0.84s per step, several linear/ease-in-out, some phase-offset by
   exactly half a cycle (-0.42s) to pair opposite limbs */
.leg-thigh   { animation: 0.84s linear infinite sv-walk-thigh; }
.leg-thigh-2 { animation: 0.84s linear -0.42s infinite sv-walk-thigh; } /* other leg, phase-shifted */
.leg-knee    { animation: 0.84s linear infinite sv-walk-knee; }
.leg-foot    { animation: 0.84s linear infinite sv-walk-foot; }
.body-bob    { animation: 0.84s ease-in-out infinite sv-walk-bob; }    /* vertical body bounce */
.body-rise   { animation: 0.84s ease-in-out infinite sv-walk-rise; }
.arm-carry   { animation: 0.84s ease-in-out infinite sv-walk-carry; }  /* the carried coffee cup */
.shoulder    { animation: 0.84s ease-in-out -0.5376s infinite sv-walk-shoulder; }
```
Six to eight independently-timed layers (thigh/knee/foot ×2 legs, body bob, body rise, arm carry, shoulder sway) is a materially more sophisticated rig than our single-timeline bike animation — this is the technique to study if the motorcyclist scene ever needs a walking human instead of a vehicle.

- **A speech-bubble "say" pop-in**: `animation: 0.5s cubic-bezier(0.2,0.8,0.2,1) both sv-street-say` — a bouncy scale/fade-in, presumably fires when the figure passes a point of interest.
- **A note/sheet fade-in**: `.ln.k-note { animation: 0.22s both sv-sheet-fade; }` — fast, subtle, for revealing an annotation card.
- **A skeleton-loading pulse**: three `span`s each running `1.1s cubic-bezier(0.2,0.8,0.2,1) infinite sv-sk`, staggered 0 / 0.12s / 0.24s — a typing-dots-style loader.
- **A light/dark theme toggle** built as a custom SVG "dial" (`sv-lights` button, `aria-label="Switch to dark"`) rather than a sun/moon icon swap — a rim circle + a path, likely animating the path to sweep between states.

### Worth stealing (technique, not asset)
1. **Multi-layer procedural walk-cycle** — the single strongest technique here. If we ever animate a walking figure (not just the motorcyclist), this six-to-eight-layer phase-offset rig is the reference to rebuild from, not a sprite sheet.
2. **Confirms our token lineage** — identical ink-900 and amber-500 hex values are not a coincidence; whoever produced the original brief's "teardown data" for this project pulled these two values directly from pleurat.com. If our palette ever needs to evolve, this is the site to re-diff against for the "why" behind our exact hex choices.
3. **Sharp-corner CTA as an alternate valid direction** — noted only for history; our own tokens have since locked pill radius for buttons (see `design-sanity-rules` memory), so this is a documented alternative, not a pending change.
