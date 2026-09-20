# Design tokens — Uttham Udatthu portfolio

Updated 2026-09-07. Based on the second supplied token JSON, with the user's latest requirement: **exactly two font families**. The shared tracking and line-height tokens resolve conflicting values in the older composite typography records. The glass CTA uses the explicit 8px/no-border material note.

Canonical export: `docs/design-tokens.json`. Implementation: `src/styles/global.css`. Keep these and this guide synchronized; do not reintroduce older typography recipes.

**Controls — one button family, three weights (locked 2026-09-07).** Every button is a die-cut *sticker*: sharp corners (`--radius-control`, 0), the sticker label voice (`--font-paper` 600 · `--text-small` · uppercase · `--track-label`), padding `--space-3 --space-5`, min-height `--space-7`, a −2° lean (`--cta-tilt`; a second sticker beside the first leans +1.5°), `--shadow-stuck` at rest. Hover (fine pointers only): straightens, lifts `--lift-y`, `--shadow-lift`. Press: flat, `--shadow-press`, `--dur-1`; release 100ms. Weight is the stock alone:

| Class | Stock | Use |
|---|---|---|
| `.cta.cta--primary` | `--amber-500` fill (`--amber-400` pressed) | The one primary action per view, on glass or paper |
| `.cta.cta--secondary` | Kiss-cut outline: `1.5px solid --amber-700`, `--amber-text` label, 35% white fill | Secondary action beside a primary |
| `.text-link` | No sticker: `--font-paper` 500 · `--text-body`, 2px `--amber-700` underline, offset 5px (3px pressed; ink on hover) | Tertiary: "Read the case", "All projects" |

Retired: `.cta--glass` (frosted), `.cta--ghost` (outline), the solid amber block. The floating page-navigator uses the primary stock with `--cta-tilt: 0` and no uppercase.

---

## Typography

**General Sans** is the interface family on paper and glass: navigation, headings, body, buttons, labels, footer and case pages. **Caveat** is the handwritten accent for annotations, notes, photo captions and navigator cues. `--font-glass` aliases `--font-paper`; it is not another font family. Both are self-hosted. Only weights 400, 500 and 600 are allowed; synthetic font styles are disabled.

| Role | Size | Weight | Line height |
| --- | --- | --- | --- |
| display-hero | `clamp(42px, 4.6vw, 68px)` | 600 | 1.05 |
| display-h2 | `clamp(34px, 3.6vw, 52px)` | 600 | 1.15 |
| heading-h3 | `clamp(26px, 2.2vw, 34px)` | 600 | 1.15 |
| heading-h4 | `clamp(20px, 1.7vw, 24px)` | 500 | 1.15 |
| body-lg | `clamp(17px, 1.35vw, 20px)` | 400 | 1.55 |
| body-base | `clamp(16px, 1.1vw, 17px)` | 400 | 1.55 |
| label-eyebrow | `12` | 500 | 1.55 |
| note | `clamp(18px, 1.4vw, 22px)` | 500 | 1.4 |
| annotation-hand | `clamp(32px, 3vw, 44px)` | 500 | 1.05 |
| small | `14` | 400 | 1.55 |

Tracking: display `-0.03em`, headings `-0.015em`, uppercase labels `0.06em`; body and handwriting use normal tracking. Multi-line hero statements use line height `1.4`. Wordmark sizing reuses h3 (h4 at 900px and below).

## Spacing and grouping

The spacing steps `--space-1` through `--space-12` are **4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160 and 200px**.

| Role | Value | Application |
| --- | --- | --- |
| Section | `clamp(96px, 10vh, 144px)` | Separation between major sections |
| Compact section | `clamp(48px, 5vw, 72px)` | Supporting case details and case-navigation separation |
| Content gap | `clamp(16px, 2vw, 24px)` | Related text, card internals and card padding |
| Group gap | `clamp(24px, 3.5vw, 48px)` | Column groups and panel side padding |
| Control gap | `12px` | Controls that belong together |

Headings and their labels form one group; descriptions stay nearer to their heading than the next group. Principle receipts have additional separation from their explanation. A single container owns the side gutter: never add container padding on top of the same margin. Card and panel padding aliases reuse the content/group values above. Artboard artwork has no extra nested padding.

Homepage sections are separated by **the ruler**: a full-bleed 1px dashed hairline (`--line-0`) at the section's top edge, a 7px tick (`--line-mark`, `--tick-size`) at every column of the measure, and the section's name as a tracked uppercase label (`--text-eyebrow`, 500, `--track-label`) breaking the rule at the container's leading edge on a paper-coloured patch. The label is wayfinding in the nav's own voice, not a heading; the section's heading is its sentence (`.sec-sub`, h4 size, 500) 12px (`--space-3`) below the rule, while the rule itself sits a full section gap below the previous content — the ruler belongs to what follows it. Contact carries only the label; the footer only the rule. Caveat is marginalia only. The hero-to-Projects boundary uses `--section-y-sm` above and below the ruler so the ruler and heading show inside the first fold. (2026-09-18, replacing the one-heading guideline of the same morning after the separator mock; option 3 of plans/018.)

On the homepage, each section owns its top separation; do not add a second section-sized bottom gap to the preceding section. The work heading sits one content gap above its board, which supplies its own hardware padding. Case details use compact-section spacing because they support the artwork immediately above.

The hero statement fills the glass panel's padded content width. Its portrait tucks 32px behind the glass and sits 64px from the panel's left edge, clear of the corner bolts. Panel top and bottom padding follows the hardware rules below. The scene and its handwritten explanation form one figure: caption first, artwork 12px below it, with a shared left edge. Its width follows whole foundation columns, as described below. Contact notes share the same size, and the photo group reserves 32px above its frame for the attached badge.

## Responsive layout

| Width | Page gutter | Header token | Foundation grid / gap |
| --- | --- | --- | --- |
| Above 900px | `clamp(20px, 5.6vw, 80px)` | 76px | 12 / 24px |
| 641–900px | 40px | 96px | 8 / 20px |
| Up to 640px | 20px | 96px | 4 / 16px |
| Up to 360px | 20px | 92px | 4 / 16px |

Container maximum: **1200px**. The four project cards form a 2×2 collection from 768px, and one column below 768px. Hero and contact groups stack below 1024px; principles stack at 900px and below; case details stack at 640px and below. Hero content remains in normal flow so short viewports can scroll without overlapping.

The measure: two 1px **dashed** hairlines (`--line-0`) at the content container's edges run the full page behind all content, snapped to whole pixels with `round()` so a fractional margin never blurs one edge. The rulers cross it at every section boundary with their ticks; the 12-column grid itself lives in the CSS, not on the paper. (2026-09-18, plans/018.)

## Corners and materials

- **8px**: all freestanding surfaces, including glass slabs, work cards, notes, Instax frames and preview frames.
- **2px**: nested media/insets.
- **0px**: CTA controls and the full-width navigation edge.
- **999px**: tag chips only. Circular avatars, bolts and illustrative geometry remain circular.
- Legacy 16px/24px radius tokens are unused; never apply them to new surfaces.

White liquid glass keeps its diagonal sheen, single warm glow, 8px blur, saturation 1.5 and 0.5px border. Content panels have 16px bolts inset 18px; the navigation has no bolts. Glass CTAs use blur 8px/saturation 1.4 with no separate border. Glass, bolt and CTA recipes remain in the JSON; paper elevations use the four shared rest/stuck/lift/press shadows.

**The sheet (2026-09-16).** Paper-0 carries three authored texture layers, all CSS. Fibres — sixteen hairs and twenty-two flecks of ink at 4–7% on a 640px tile — live on the body background so they scroll with the page like fibres in the stock, not dust on the screen. The tooth (180px fractal-noise tile, pushed towards white so multiply leaves dark specks rather than a grey cast) and the tone (1100px one-octave tile for slight unevenness) sit fixed on `body::before` at `--grain-opacity` (0.07), multiply. The three tile sizes share no small common multiple, so no repeat reads. Glass blurs all of it away, which is why glass looks smooth. Hidden under `prefers-reduced-transparency`; `prefers-contrast: more` gets the flat stock.

Every bolt requires **16px of clear space** around its footprint. The static content inset is `18 + 16 + 16 = 50px` from the frame's top and bottom. Case artboards own this padding; SVGs and placeholders fill the remaining interior without adding another padding layer. Hero and contact panels pad vertically by the bolt zone plus one small step (`--bolted-panel-padding`, 58px; reduced 2026-09-18 from a minimum of 82 because the glass read as mostly empty). The workboard reserves 64px for tape and sheets (`--bolted-board-padding`), 96px at the bottom on layouts with magnetic hover. These dimensions keep the current tallest card clear even at its maximum 4°/2.5° tilt. Recheck the projected bounds if card copy or hover amplitude changes. Side padding retains the group token so narrow screens keep their reading width.

## Color

| Family | Values |
| --- | --- |
| Paper 0 / 1 / 2 | `#FAF9F4` / `#FFFFFF` / `#F0ECE3` |
| Ink 900 / 600 / 400 | `#16140E` / `#5C594F` / `#8C887C` |
| Amber 500 / 400 / 700 / text | `#F3B44A` / `#F7C36D` / `#C8871F` / `#9C640C` |
| Line 1 / 0 | `rgba(22,20,14,.13)` / `rgba(22,20,14,.07)` |

Small text uses ink 900 or 600; ink 400 is reserved for text at least 18px. Small amber text and focus rings use amber-text. Native illustrations retain their signal colors and rider liveries.

## Motion

**Pointer ride (plans/014, finished per plans/015 on 2026-09-17).** On a fine mouse the visitor rides the paper. One sampler reads speed, path direction and a lagging bike heading (τ 90 ms) and feeds two click-through canvases: **dust** (graphite lifted off the sheet; viewport space, `z: header + 1`) and **marks** (rubber; page space so they scroll with the sheet, `--z-surface-fx` under the header). **Two greys, one rule:** `--graphite` for anything the ride leaves in the air, `--ink-900` for anything on the sheet; the hero's `--ink-600` exhaust is the illustration's and is not a pointer colour.

The ladder (`RIDE` in `pointer-ride.js`, re-tuned 2026-09-17 after the first pass proved invisible at ordinary mouse speed): under 0.6 px/ms nothing; a brisk move (≥ 1.2) lifts dust **per 16 px of path** from the rear tyre (14 px behind the pointer along the heading), never on a clock, so motes overlap into a small soft exhaust ribbon; a turn (path more than ~33° off the heading) lays a scuff at alpha `0.04 + 0.12 · slip`, width `3 + 4 · slip`; a reversal a skid; rapid back-and-forth (sustained ≥ 1.15 px/ms with a reversal in the last 400 ms) the burnout: a 14-mote bloom staggered over ~100 ms seated at the last reversal (± 24 px), then 2 motes per 20 ms for 350 ms around the tyre (± 12 px), at most 32 alive, all gone by 2 s, rubber at 0.2, 4.5 s cooldown. Dust never swells: motes are 13–19 px, kicked back 40 px/s with drag 4 /s, rising 18 px/s, fraying on a 2 px curl, arriving over `--dur-1`, holding to 30 % of a 900–1300 ms life, leaving on the exponent 1.4 the rubber also uses; the fast rung smears a mote ≤ 1.35× along the path. Peak alpha is `--dust-alpha` (0.22, settled between 0.16 and 0.3 after living with both); glass × 0.6. Sprites are baked once per backing ratio from the paper's own noise (`PAPER_TOOTH` 0.75 per CSS px, the `body::before` recipe) at one sprite pixel per device pixel — three grain variants thresholded at the noise median, haze the first tile blurred 1.2 px, each mote born half haze and crossfading fully to haze — every raster checked for colour and coverage, with canvas-drawn grain as the fallback, never silence. Tread is baked at the drawn size (12×6 CSS px × ratio, four variants): solid where the across-track gradient is ≥ 0.55, kept toward the edge only where a seeded value noise at the tooth's frequency peaks; dabs run exactly along the path, 6 px apart, and when the tyre lets go two more dabs fade at ×0.5 and ×0.25. Rubber saturates: a 4 px cell holds at most 0.26 coverage, so passes stack to ≈ 0.5 and never to black. Marks hold `--linger` (8 s) then fade 3 s; a click, a scroll gesture (once, not per smoothed frame) or leaving the window **stops the bike** (no more emission; a pause inside a burnout ends it too) and the air already lifted finishes on its own; only a hidden page, a layer switch or a resize erases it. Still means nothing: no idle breath, no last-wisp timer. Caps: 64 motes, 320 dabs, 4-million-pixel bitmaps, no frame loop while nothing changes. Off for touch, coarse pointers, dragging, hidden pages and reduced motion; marks also off under `prefers-contrast: more`. The drawing measurements live in the frozen `DUST` object beside `RIDE` and are measurements, not interface tokens. The native pointer is untouched.

The bot faces right in three-quarter profile on an electric bike with a small battery/lightning panel. Only the human bikes leave occasional low-opacity exhaust, which dissipates in 650ms. Their exhaust shares the scene's existing visibility and reduced-motion gates.

The signal scene represents two people and a small AI bot on matching motorcycles. At the start of each red-light cycle, choose a new flip combination: usually one rider, occasionally two, rarely all three, with no consecutive repeat. All riders have equal selection weight. Keep the choice fixed through the cycle and off-screen pauses; selected riders finish one eased backflip before landing. Reduced motion shows the group riding under green without animation. The caption refers to “people and AI agents” and stays above the scene. On desktop the caption-and-scene group is centred vertically against the glass slab, excluding the portrait above it.

Durations: **150 / 220 / 400 / 600ms**. Sibling stagger: **70ms**. Standard/enter/exit easing: `cubic-bezier(.2,0,0,1)` / `cubic-bezier(.22,1,.36,1)` / `cubic-bezier(.3,0,1,.3)`.

Tile entrances stagger by the current grid column. Case headings rise 12px and fade in. Hover movement is limited to a fine pointer with hover support; touch has active press feedback. CTA press is 150ms and release 100ms. Reduced motion removes spatial transitions and reduces durations to 0.01ms.

Magnetic card perspective is four times the larger sheet dimension (minimum 400px), updated through ResizeObserver. This keeps the top-anchored tilt gentle as cards grow wider, protecting the next row's tape and the board hardware. Resizing below 768px removes the observer/listeners and reverts the transforms.

The SVG scene has its own narrative timing. A small ramp settles on red; all three riders jump and only the middle rider completes one backflip. It lifts away after the rear rider clears it. Distant scenery is cropped behind the far curb; the vehicle signal occupies the foreground to the left of the zebra crossing, overlapping the ramp's left edge. Its placement is independent of the crossing and jump anchor so the pole stays clear of airborne riders. Rendering pauses off-screen and in hidden tabs, and reduced motion shows a still green crossing. Illustration coordinates, SVG letter placement and physical hardware geometry are drawing measurements, not extra interface spacing or type tokens.
