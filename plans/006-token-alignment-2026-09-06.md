# Token alignment and scene update — 2026-09-06

Implemented against the second user-supplied JSON, with their later explicit limit of two font families. General Sans serves all interface text; Caveat serves handwriting. `--font-glass` aliases `--font-paper`. Font faces/preloads, footer and all three token guides now agree. Duplicate composite tracking/line-height values in the export were reconciled to its shared global tokens; glass CTA uses its explicit 8px/no-border note.

Aligned surface radii (8px), nested insets (2px), sharp CTA corners, card/panel padding, heading groups, principles, contact notes, shared page gutters and case artboard padding. Hero layout remains in normal flow at every breakpoint. Preserved the current hero copy and other existing source edits.

Scene: smaller lighter buildings/trees clipped at the far curb, larger foreground signal, small amber kicker with star cutout, shared approach/flight/landing path and exactly one middle-rider backflip. Existing off-screen, hidden-tab and reduced-motion lifecycle retained.

## Validation

- `npm run build`: passed; homepage and all four case routes generated.
- Browser homepage measurements at 320, 360, 361, 390, 640, 641, 767, 768, 900, 901, 1023, 1024, 1280, 1440 and 1920px: no horizontal page overflow; header links inside viewport. Breakpoint values explicitly confirmed after viewport updates.
- Case template (Intent): 320, 390, 640, 641, 768, 900, 901, 1023, 1024, 1440, 1920px; no overflow, 8px artboard radius, responsive detail columns.
- Other three cases: 320, 640, 900, 1440px; no horizontal page overflow.
- Visual review: homepage hero at 320px and desktop; mobile work cards and contact; 640px principle grouping; Intent at 320px. At 1024×600 the hero continues naturally below the viewport and the work section starts at its exact bottom (645.8px), without overlap.
- Computed text families on homepage: General Sans and Caveat only.
- Deterministic scene preview built from production SVG/CSS and scene script: red backflip frame has only the middle rider inverted; completed rotation before landing. Temporary harness moved out of public to `tmp/scene-check.html` after checking.
- `node tmp/verify-signal-lifecycle.mjs`: passed visible/off-screen/hidden-tab/reduced-motion transitions, phase-preserving resume and no duplicate rAF loop.
- Existing Download CV remains linked to the supplied PDF as `Uttham-Udatthu-CV-2026.pdf`; download previously verified.

Existing unavailable photography and project-media slots remain honestly labeled. No assets or case-study outcomes were invented.

## Scene correction after visual feedback

Moved the signal to the right foreground shoulder. Its footing starts at y=664, beyond the road's near edge at y=640, with a solid housing and visible base. Repositioned the scenery using each source SVG's natural aspect ratio and visible baseline: the far curb now clips only approximately 3 scene units, preserving tree trunks and building floors. Verified the rendered result at 1440px and 390px, with no mobile overflow. Production build passed.

## Mobile washi overlap correction

Replaced first-row-only stacking rules with an isolated layer per card, ordered from the study data so earlier cards stay above later washi tape at every column count. Limited magnetic perspective tilt to fine-pointer layouts at least 768px wide; GSAP media-context cleanup removes transforms and pointer listeners when entering the single-column layout. Retained the 48px row gap.

Build passed. Fresh browser checks at 320, 390, 640, 767, 768 and 1440px confirmed layers 4/3/2/1, no horizontal overflow, no perspective below 768px, and at least 29px visible card-to-next-tape clearance on mobile. Verified desktop-to-mobile resize removes perspective. Restarted the development server to clear stale component CSS before final visual verification.

## Reconnect the ramp to the signal crossing

The signal, stop line, ramp and flight path now share `SIGNAL_X` so their story stays spatially connected. The ramp sits before the stop line; the arc peaks at the signal and lands just beyond it, within the visible frame. Shifted the crossing slightly left and raised the housing to keep the landing visible and avoid masking the backflip. The footing remains outside the near curb. The ramp waits for the final landing before lifting away, followed by a short rest before green.

Production build and motion lifecycle checks passed. A deterministic preview built from the production SVG/CSS/script verified takeoff/crossing/landing positions: the middle rider is airborne at x=570 under red, only that rider flips, and the landing is past the signal. Desktop and 390px snapshots confirmed the composition. Temporary preview moved to `tmp/scene-story-check.html` and removed from the built output.

## Denser town and consistent SVG outlines

Replaced the seven externally scaled background SVG images with `TownBackdrop.astro`: 24 buildings and 26 trees arranged in two depth layers. All background outlines and details use a shared 1.8-unit rounded stroke; geometry is generated at its final scene size, avoiding the original assets' uneven baked-in borders. Opaque paper fills keep overlapping objects clean while lighter stroke colors establish distance. Bases still end at 548, so the road clips only 3 units. Signal, zebra crossing and jump geometry are preserved.

Build passed. Desktop (1440px), mobile (390px) and narrow (320px) checks confirmed the denser composition, consistent computed stroke width and no horizontal overflow.
