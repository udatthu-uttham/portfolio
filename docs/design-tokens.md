# Design tokens — Uttham Udatthu portfolio

Updated 2026-09-07. Based on the second supplied token JSON, with the user's latest requirement: **exactly two font families**. The shared tracking and line-height tokens resolve conflicting values in the older composite typography records. The glass CTA uses the explicit 8px/no-border material note.

Canonical export: `docs/design-tokens.json`. Implementation: `src/styles/global.css`. Keep these and this guide synchronized; do not reintroduce older typography recipes.

Naming is locked as of 2026-10-01 (`docs/design-audit.md` §10, decision 1): **the existing prefixes stay**; category grouping happens through a prefix mapping table, never a rename.

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

### The rhythm ladder (2026-09-25; four rungs and the screen contract, 2026-10-01)

Every vertical gap on the homepage is one of four rungs, and **each rung is a
clear step under the one above it**. That ratio is what makes grouping legible:
proximity does the work, not borders (Law of Proximity — a heading belongs to
its content because it is nearer to it than to the section before it). The hero
is not a rung: it is one whole screen, and every section after it is at least a
screen too (see the screen contract below).

| Rung | Token | Value | Resolves to | Application |
| --- | --- | --- | --- | --- |
| 1 · Between sections | `--section-y` | `clamp(96px, 11vw, 160px)` | 96 / 113 / 141 / 146 / 158 / 160 at ≤872 / 1024 / 1280 / 1324 / 1440 / ≥1455 | Split in half as `--section-pad`: every homepage section pads half a gap top and bottom, so two neighbours sum to one gap (plus centring slack) |
| — Section pad | `--section-pad` | `calc(var(--section-y) / 2)` | 48 / 56 / 70 / 73 / 79 / 80 | Top and bottom pad of every homepage section; the hero adds `--header-height` to its top |
| — Hero | *(none)* | `min-height: 100svh` | one whole screen | Not a rung: the first screen, content centred under the fixed header |
| 2 · Heading → its content | `--head-gap` + board padding | `--space-5` + `--space-7` = 72px | 72px flat | A section's sentence to the first card |
| 3 · Card inset | `--card-padding` | `clamp(16px, 2.2vw, 32px)` | 16 → 32 | Padding inside a sheet (sides and bottom) |
| — Sheet top | `--sheet-top` | `max(--card-padding, --tape-bite + --space-4)` | 34px at every width today | A taped sheet's top padding: clears the tape by one within-card step |
| — Tape bite | `--tape-bite` | `18px` | flat | The part of the tape lying on the sheet: the 32×87px strip turned 92° stands 35px tall, centred on the edge |
| — Sheet content | `--sheet-in` | budget − `--sec-chrome` − sheet padding, `clamp(360px, …, 480px)` | 396 / 470 / 480 at 1280×800 / 1440×900 / ≥1324×967 | Content height of a Projects or AI Space sheet on a laptop (≥1024px), so the section is one screen |
| 4 · Within a card | `--space-4` / `--space-2` | 16px / 8px | flat | Stack between a card's blocks / between answer lines |
| — Supporting detail | `--section-y-sm` | `clamp(48px, 5vw, 72px)` | 48 → 72 | Case-page chapters, case details, page navigator, footer |
| — Content gap | `--content-gap` | `clamp(16px, 2vw, 24px)` | 16 → 24 | Related text and grid gutters |
| — Group gap | `--group-gap` | `clamp(24px, 3.5vw, 48px)` | 24 → 48 | Column groups and panel side padding |
| — Control gap | `--control-gap` | `12px` | flat | Controls that belong together |

**`--section-y` is measured in `vw`, not `vh`.** It was the one rhythm token on a
viewport-*height* basis, and `10vh` needs a 960px-tall viewport just to clear its
own 96px floor — so on every laptop it rendered a flat 96px and the documented
96–144px range never once happened. Do not put it back on `vh`.

**The hero boundary token is gone.** `--section-y-hero` (2026-09-25) was retired
on 2026-10-01: the hero now fills the first screen, so there is no fold for
Projects to peek into, and Projects takes `--section-y` like every section.

**The screen contract (2026-10-01).** Every top-level section is one screen with
its content centred (Uttham: "in one viewport so many elements are there, I want
to just show one section"). The hero is `min-height: 100svh` under the fixed
header, so it adds `--header-height` to its top pad; `#work`, `#ai` and
`#contact` are `min-height: calc(100svh - var(--header-height))`. **Each pads
`--section-pad` top and bottom**, so neighbouring pads meet at the boundary and
content-to-content is at least one `--section-y`. Every `section[id]` lands a nav
jump with `scroll-margin-top: var(--header-height)`, Contact included. The
content budget is `100svh − --header-height − --section-y`: 503 / 583 / 745 /
666 / 844px at 1280×720 / 1280×800 / 1324×967 / 1440×900 / 1920×1080 (computed
from the CSS; plans/024 holds the measurements). Centring is block-level
`align-content: center` (Chrome/Edge 123+, Firefox 125+, Safari 17.4+), chosen so
the children keep normal flow and their collapsing margins; an older browser
top-aligns, which is the old layout.

**Two costs come with the contract, and both are known.** A section shorter than
its budget is centred, and the slack above and below its content sits on no rung
— so on tall screens the between-section gap grows past `--section-y`. And a
Projects or AI Space sheet has a 360px content floor so a phone stays legible:
below it the section grows rather than the phone shrinking. Measured on
2026-10-01 (plans/025): **Projects fits from 1024×768 up; AI Space from 1280×800
up** (since its cards dropped the "how it helps" lines; at 1024 its sheets go one
per row and the section runs long); both run over at 1280×720.

**The tape owes the sheet's content one within-card step** (2026-10-01). It is
anchored to half its own height on the sheet's top edge, so 17.5px of it lies on
the paper; `--sheet-top` = `max(--card-padding, --tape-bite + --space-4)` puts the
title 16.5px below it at every width. With `--card-padding` alone the title sat
under the tape on a phone (0px) and 11px from it at 1280px. Measured: the tape
rises 16.5px above every sheet and its lower edge is 16.5px above the title, at
375, 768, 1024, 1280, 1440 and 1920px.

Headings and their labels form one group; descriptions stay nearer to their
heading than the next group. Principle receipts have additional separation from
their explanation. A single container owns the side gutter: never add container
padding on top of the same margin. Artboard artwork has no extra nested padding.

**Card padding is no longer an alias of the content gap** (2026-09-25, superseding
plans/006). Uttham: "some cards are very heavily loaded, add breathing spaces."
The sheets now carry a title, a lead line, three answers and a live preview, and
at the content gap's 24px they read as a wall of text. `--card-padding` is its
own `clamp(16px, 2.2vw, 32px)` — both ends land on the scale, so it is a
considered value, not the ad-hoc number that alias existed to prevent. Panel
padding still aliases the group gap.

Homepage sections are separated by **the ruler**: a full-bleed 1px dashed hairline (`--line-0`) at the section's top edge, a 7px tick (`--line-mark`, `--tick-size`) at every column of the measure, and the section's name as a tracked uppercase label (`--text-eyebrow`, 500, `--track-label`) breaking the rule at the container's leading edge on a paper-coloured patch. The label is wayfinding in the nav's own voice, not a heading; the section's heading is its sentence (`.sec-sub`, h4 size, 500) 12px (`--space-3`) below the rule, while the rule itself sits a full section gap below the previous content — the ruler belongs to what follows it. Contact carries only the label; the footer only the rule. Caveat is marginalia only. Every boundary, the hero's included, is two half-gap pads meeting (`--section-pad` + `--section-pad`): the rule is 0px tall in flow at the top of the section's content box plus its 12px margin, so it sits at least one `--section-y` below the previous content and its sentence 12px below it. Projects takes the same `--section-y` as every section; the hero above it fills the first screen (2026-10-01). (2026-09-18, replacing the one-heading guideline of the same morning after the separator mock; option 3 of plans/018; retuned 2026-09-25; half-pad split 2026-10-01.)

**The test is the screen, not the peek** (2026-10-01). Plans/016 and /018
recorded "Projects top at 797 / 752 / 707px", and plans/023 restated the peek as
a property — the Projects sentence inside the first viewport at 1440×900,
1280×800 and 1024×768. That test is retired: the hero fills the first screen
(`min-height: 100svh`, content centred) and every `.section` is at least
`100svh − --header-height`, so **nothing of the next section shows until you
scroll** (Uttham: "I want to just show one section"). State it as the test
instead — at 1280×720, 1280×800, 1440×900 and 1920×1080 the hero's bottom pad
edge is at or below the fold, and a nav jump to `#work`, `#ai` or `#contact`
lands the ruler directly under the header with nothing of the previous section
above it — and re-measure rather than trusting a number. Plans/024 holds the
measurements; plans/016, /018 and /023 are superseded on this point.

On the homepage, each section pads half a section gap at both ends (`--section-pad`); never give one section the whole `--section-y` on either side, or the boundary doubles. A section's heading sits `--head-gap` (24px) above its board, and the board adds `--tape-overhang` (48px) of its own — 72px in total, against a 96–160px section gap, so the heading reads as belonging to what follows it. The tape overhangs a sheet's top edge by ~16.5px, which is the floor that board padding has to beat; at 24px only 7.5px of paper showed above the tape and the heading looked glued to the cards. Case details use compact-section spacing because they support the artwork immediately above.

**Case-study teaser pages run on the homepage ladder, stepped up for reading** (2026-10-01, Uttham: "as the reference website shared, make sure there is lot of spacing… it should match that system"; plans/029). The bus-discovery reference pads each chapter 80px top and bottom (160 apart), its heading 18px over the text, its intro 32–48px over what follows. `CaseTeaser.astro` (both case studies, and the AI Space tool pages):

| Gap | Token | 375 / 1280 / 1440 |
| --- | --- | --- |
| Below the header | `--section-pad` | 48 / 70 / 79 |
| Hero → story, section → section, story → More cases, full-study block → block | `--section-y` | 96 / 141 / 158 |
| Heading → its text | `--head-gap` | 24 |
| Text → a sub-group (rows, note, list, gate card), and above a sub-group heading | `--ct-sub` = `max(--group-gap, --space-6)` | 32 / 45 / 48 |
| Sub-group heading → its rows; paragraph → paragraph | `--space-4` | 16 |
| Row padding / row label → its line | `--space-5` / `--space-2` | 24 / 8 |
| Gate card inset | `--card-padding` | 16 / 28 / 32 |

Each is a clear step under the one above at every width (the `--space-6` floor keeps a sub-group heading 2:1 over its rows on phones, where `--group-gap` alone is 24). These pages used `--section-y-sm` between sections until this pass; it stays the rung for the old chapter template only.

The hero statement fills the glass panel's padded content width. Its portrait tucks 32px behind the glass and sits 64px from the panel's left edge, clear of the corner bolts. Panel top and bottom padding follows the hardware rules below. The scene and its handwritten explanation form one figure: caption first, artwork 12px below it, with a shared left edge. Its width follows whole foundation columns, as described below. Contact notes share the same size, and the photo group reserves 32px above its frame for the attached badge.

**The hi! sticker is stuck onto the portrait's top-right corner** (2026-10-01, superseding the 2026-09-19 "a third on the photo, two thirds on the board" placement, which measured under 1% of the bubble on the print). `--hi-size: clamp(52px, 5vw, 72px)`; offsets `top: −0.25 × --hi-size`, `right: −0.42 × --hi-size` (were −0.22 / −0.8), which puts ~40% of the painted bubble over the print and 15–22% over the image, well right of the face, at every size. `--hello-w: clamp(120px, 13vw, 164px)` names the portrait's width so the sticker can pivot on the print's centre during the develop shake; the sticker's 12deg tilt and `--drop-stuck` live on `.hi-bubble`, leaving its wrapper free to turn with the print.

**Contact fits one screen, and the photo is its focus** (2026-10-01). The three principles are a title and a tagline each — the body paragraphs are gone at Uttham's request. The contact notes sit in one row at their own size: two lines (label and arrow, then address), padding `--space-3 --space-4`, all three the widest one's width when there is room and each its own when there is not, never stretched across the leftover glass and never wrapping. The photo is `--photo-w: clamp(150px, min((100svh − header − --section-y − 295px) / 1.23, 100cqw − --notes-min − --group-gap − --photo-inset), 340px)` — 295px is what Contact stacks besides the print (with the third principle's title on three lines), 1.23 the print's height per width with its caption — and sits `--photo-inset` (`--space-4`) in from the panel's right edge, which keeps its tilted corner 18–21px from the bolts. Measured: photo 234 / 301 / 340px wide at 1280×800 / 1440×900 / 1324×967 (was 171 / 248 / 323 before the pass); notes ~213×73px, down from ~255px wide and ~110px tall when they stretched; Contact fits at 1280×800 and up, is 6px over at 1024×768 (there the panel's width, not the reserve, sizes the photo) and 27px over at 1280×720.

## Responsive layout

| Width | Page gutter | Header token | Foundation grid / gap |
| --- | --- | --- | --- |
| Above 900px | `clamp(20px, 5.6vw, 80px)` | 76px | 12 / 24px |
| 641–900px | 40px | 96px | 8 / 20px |
| Up to 640px | 20px | 96px | 4 / 16px |
| Up to 360px | 20px | 92px | 4 / 16px |

Container maximum: **1200px**. The four project cards form a 2×2 collection from 768px, and one column below 768px. Hero and contact groups stack below 1024px; principles stack at 900px and below; case details stack at 640px and below. Hero content remains in normal flow so short viewports can scroll without overlapping.

`--container-max` (1200px) caps section content only. **The fixed header ignores it** (2026-10-01, Uttham: "the header top nav should always be end to end"): `.site-header__inner` is `width: 100%; padding-inline: var(--margin-side)`, so above ~1350px the bar's edges sit on the viewport gutter (80px at ≥1428px) while the sections' content stays centred at 1200px. `--margin-side` is the header's gutter at every breakpoint — `clamp(20px, 5.6vw, 80px)`, 40px at ≤900px, 20px at ≤640px — and its height is still `--header-height`.

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

**Develop (hero portrait only, 2026-10-01).** `InstaxFrame`'s `develop` variant keeps three component-local durations **above the `--dur-*` ladder on purpose**, because a develop is slower than any UI feedback: `--develop-in: 800ms` (grey → colour, ease-out), `--develop-out: 1000ms` (colour → grey, ease-in-out) and `--develop-shake: 640ms` (keyframes `instax-develop-shake`, a five-swing decaying wobble of +2.5 / −2 / +1.3 / −0.7 / +0.3deg around the print's own tilt). The shake replaces the frame's hover lift; they never stack. The hero's hi! sticker repeats the literal 640ms and the same global keyframe name — keep the two in step. Fine pointers only; coarse pointers see full colour; reduced motion removes the shake, and the global `transition-duration: 0.01ms !important` override turns the colour fade into a switch.

Tile entrances stagger by the current grid column. Case headings rise 12px and fade in. Hover movement is limited to a fine pointer with hover support; touch has active press feedback. CTA press is 150ms and release 100ms. Reduced motion removes spatial transitions and reduces durations to 0.01ms.

Magnetic card perspective is four times the larger sheet dimension (minimum 400px), updated through ResizeObserver. This keeps the top-anchored tilt gentle as cards grow wider, protecting the next row's tape and the board hardware. Resizing below 768px removes the observer/listeners and reverts the transforms.

The SVG scene has its own narrative timing. A small ramp settles on red; all three riders jump and only the middle rider completes one backflip. It lifts away after the rear rider clears it. Distant scenery is cropped behind the far curb; the vehicle signal occupies the foreground to the left of the zebra crossing, overlapping the ramp's left edge. Its placement is independent of the crossing and jump anchor so the pole stays clear of airborne riders. Rendering pauses off-screen and in hidden tabs, and reduced motion shows a still green crossing. Illustration coordinates, SVG letter placement and physical hardware geometry are drawing measurements, not extra interface spacing or type tokens.
