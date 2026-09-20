# Portfolio Build Brief — Handoff to Claude Code
Owner: Uttham Udatthu · Design Manager portfolio · Status: direction locked, entering build

## 0. What this project is
A personal portfolio site supporting a design-manager job search. Design Leader,
10+ years, currently Lead Product Designer at Meesho (commerce: PDP → checkout →
repurchase). Motorcyclist (Triumph Tiger Sport 660) — used as one restrained
personal thread, not a dominant theme.

## 1. Stack (decided)
- **Astro** (static, content collections for case studies as markdown/JSON)
- **GSAP + ScrollTrigger** for reveals/choreography
- **Lenis** for smooth scroll (lerp ~0.1, subtle)
- Astro **View Transitions** for home ↔ case-study page morphs
- Static deploy target: Vercel or Netlify
- No React needed — this is typography + scroll choreography on mostly-static
  content; avoid paying a runtime tax for near-zero interactive state
- Self-host fonts (Fontshare General Sans + Switzer, Google Caveat), subset,
  `font-display: swap`

## 2. Site architecture (decided)
Hybrid, not pure one-pager and not pure multi-page:
- **One scrolling homepage**: hero → scope/proof → selected work → how I lead
  → off the bike → contact
- **Work tiles are also independently routable pages**: `/work/[slug]` — a
  recruiter can forward a direct case-study link. Clicking a tile from home
  does a shared-element transition (image morphs) into the case page via
  View Transitions; visiting the URL directly renders the case page standalone
  with its own back-to-home nav.
- Design/build exactly **two Figma frame sets**: (1) home scroll, (2) one
  case-study template reused across all projects — at all three breakpoints.

## 3. Breakpoints
| Frame | Width | Role |
|---|---|---|
| Desktop | 1440 | primary target |
| Tablet | 768 | collapse-point check only |
| Mobile | 390 | second real target — design it, don't just shrink desktop |

Everything between is fluid via `clamp()`. Container max-width 1200px, side
margins 80/40/20px. Reading column (prose) max-width 560px always. Grid:
12 col/24px gap → 8 col/20px → 4 col/16px.

## 4. Material system — "Paper, Glass, Sticky Notes" (locked)
Three physical layers, literally, not just a metaphor:

```
z-2  GLASS    — discrete slabs, NOT full-bleed except header + footer
z-1  STICKY   — floats between glass and paper, drifts on scroll
z-0  PAPER    — full-bleed canvas: sketches, headings, body, grid-respecting
```

**Paper**: the base. Warm off-white, gridded, disciplined, holds all content
and sketches. Always full-bleed background.

**Glass**: appears ONLY where a primary action lives, plus the two structural
bookends (nav header, footer) which are full-bleed.
- Locked slab locations: nav (full-bleed), hero (left-anchored slab hosting
  "Get in touch" / "Download CV"), contact section (wider left-anchored slab
  hosting email/LinkedIn/CV pills), footer (full-bleed).
- Everywhere else (scope stats, work tiles, leadership, about) = NO glass.
  Work tiles are plain paper cards with a text+arrow link, not a filled
  button — this is deliberate: it separates primary CTAs (glass) from
  secondary navigation (paper).
- Glass slabs **ignore the grid on purpose**: they bleed to true viewport
  edge on the left while paper content respects the 80px container margin.
  This mismatch is the visual tell that they're different materials.
- Cut edge treatment: hard edge (no fade-to-transparent), subtle light rim
  (1px highlight) + drop shadow the slab casts onto paper beneath/right of it.
- Rendering: `background: rgba(247,244,236,.78); backdrop-filter: blur(14px)`
  for nav-weight slabs; `blur(16px)` + `rgba(255,253,247,.85)` for the
  contact/case-overlay slab.

**Buttons/CTAs = cutouts in the glass**, not glass-colored objects:
- Sharp edges, no blur/tint inside the hole — it's a hole, there's no glass
  left in it to blur
- What shows through the hole is paper/ink color underneath: primary CTA
  shows `amber/500` through the cut; ghost CTA shows bare paper + ink outline
  (the outline = the die-cut edge)
- Inset shadow on the hole edge: `inset 0 1px 2px rgba(0,0,0,.15)` sells depth
- Hover: hole widens 2–3% (`transform: scale(1.02)`, 150ms ease-micro) rather
  than a color swap — more of what's underneath becomes visible
- Focus-visible: explicit `amber/700` outline regardless of the cutout effect

**Sticky notes**: middle layer, opaque, physically "solid."
- Cast a normal drop shadow down onto paper
- When a note's scroll path drifts behind a glass slab (crosses its z-plane),
  apply a few frames of `filter: blur(1px)` + reduced opacity as it passes —
  proves the z-stack visually without any explanation text
- Subtle parallax: notes scroll at ~0.95x page speed (barely perceptible)
- Idle motion: ±1.5° rotate/bob, 4–6s ease-in-out loop, hand-set starting
  angle per note (−3°, +2°, −4° — not randomized, reads as placed by a person)
- Exactly 3 sticky notes total, each anchored to a specific piece of content:
  1. Hero — "ten years in, still sketching first" (with drawn arrow sketch)
  2. Bike photo — "the actual bike →"
  3. One work tile (repurchase/current work) — a short annotation, e.g.
     "this one's still shipping"
- Route at least one note's scroll path to visibly cross under the hero glass
  slab early in the page, so the viewer registers the z-stack rule before
  they've consciously thought about it.
- All under `prefers-reduced-motion`: notes render static, no idle loop.

## 5. Fonts (three, mapped to layers — this is the taxonomy, keep it strict)
| Layer | Font | Source | Used for |
|---|---|---|---|
| Paper | **General Sans** | fontshare.com/fonts/general-sans (NOT Google Fonts) | headings, body, stat numerals, sketch labels |
| Glass | **Switzer** | fontshare.com/fonts/switzer (NOT Google Fonts) | nav labels, cutout-button text, eyebrows |
| Sticky notes | **Caveat** | Google Fonts | exclusively inside sticky-note components, nowhere else |

Fontshare fonts must be self-hosted or pulled via Fontshare's CSS API
(`api.fontshare.com/v2/css?f[]=general-sans@400,500,600` /
`f[]=switzer@400,500,600`) — they will NOT resolve as Google Fonts links.

## 6. Color tokens
```
paper/0   #F7F4EC   page background
paper/1   #FFFDF7   raised cards/tiles
paper/2   #EFEAE0   inset wells, media placeholders
ink/900   #16140E   headings, primary text
ink/600   #5C594F   body secondary, captions
ink/400   #8C887C   metadata, disabled
line/1    rgba(22,20,14,.13)  card borders
line/0    rgba(22,20,14,.07)  subtle rules
amber/500 #F3B44A   primary CTA fill (shows through cutout), active states, one sketch accent max
amber/400 #F7C36D   CTA hover
amber/700 #C8871F   amber-on-paper text, 18px+ only, also focus ring
graphite  rgba(58,55,46,.85)  sketch/outline stroke color
```
Rule: amber only on CTAs, active states, sketch annotations, scroll-progress
element. Never backgrounds. Target ≤12 distinct colors sitewide.

## 7. Typography scale (desktop / mobile, build as clamp())
```
display/hero    104 / 48   weight 600  line 1.0   tracking -2.5%
display/h2      64  / 36   weight 600  line 1.05  tracking -2%
heading/h3      34  / 26   weight 600  line 1.15  tracking -1%
heading/h4      22  / 20   weight 500  line 1.3   tracking -0.5%
body/lg         20  / 18   weight 400  line 1.55
body/base       17  / 16   weight 400  line 1.6
label/eyebrow   12  / 12   weight 500  line 1.2   tracking +8% UPPERCASE
stat/num        88  / 56   weight 600  line 1.0   tracking -2%  (tabular nums)
annotation      24  / 20   weight 500  line 1.3   (Caveat, sticky notes only)
```

## 8. Spacing, radius, shadow
- Spacing scale (base-8): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200
- Section padding: `clamp(80px, 14vh, 200px)` top/bottom
- Radius: pill 999 (CTAs) · media 24 (images/video) · card 16 (tiles) · sm 8
- `shadow/lift` (card hover only): `0 24px 60px -40px rgba(15,21,36,.5)`
- `shadow/rest` (glass overlay/media): `0 1px 2px rgba(0,0,0,.05)`
- Cards flat at rest (hairline border only) — depth earned on hover, not ambient

## 9. Motion spec
```
ease/reveal      cubic-bezier(0.22, 1, 0.36, 1)
ease/micro       cubic-bezier(0.4, 0, 0.2, 1)

Scroll reveal (default)     opacity 0→1, y 16px→0, 600ms ease/reveal, trigger 80% viewport
Heading line-mask            lines rise from y 120%, overflow-hidden, 800ms, stagger 90ms/line
Stagger (grids/lists)        70ms between siblings, cap at 5 then simultaneous
Card hover                   y -2px + shadow/lift + border darken, 220ms ease/micro
Image-in-card hover           scale 1.03, 400ms
Link hover                   underline draws left→right 200ms; arrow +4px
Cutout CTA hover              hole scale 1.02, 150ms
Hero intro                   eyebrow → line-mask headline (90ms stagger) → sub → CTA; ≤1.2s total; name/CTA legible by 600ms
Sketch draw-on                SVG stroke-dasharray draw, 900ms, once per session, on scroll-into-view
Sticky note idle               ±1.5° rotate/bob, 4-6s ease-in-out loop
Sticky note cross-under-glass  blur(1px) + opacity dip for a few frames while behind a slab
Scroll engine                  Lenis, lerp 0.1
```
Banned: pinned/scrubbed sections, parallax > 8px (except sticky-note 0.95x),
custom cursors, marquees.

`prefers-reduced-motion`: everything renders final-state; Lenis disabled;
sketches appear already-drawn; sticky notes static, no idle loop.

## 10. Content — locked copy (fill remaining TK before build)
**Hero**
- Eyebrow: "Lead Product Designer · Meesho"
- Headline (3 lines): "Design leadership / for commerce / at India scale."
- Sub: "I lead design across the surfaces where India shops — product page to
  checkout to repurchase. Ten years across B2C and B2B SaaS, now building and
  mentoring teams as a design manager."
- CTAs: "Get in touch" (amber cutout) / "Download CV" (ghost cutout)
- Sticky note: "ten years in, still sketching first" + arrow sketch

**Scope/proof block**
- "10+ years designing products, from B2B telecom to India's everyday commerce"
- "2 flagship programs built from zero — Meesho Mall and Meesho Gold"
- "[TK] designers mentored through critique and career conversations" —
  **needs Uttham's real number before build**
- Confidentiality line: "Outcome figures are confidential for a listed
  company — I walk through them in interviews."

**Selected work (4 tiles, each also a `/work/[slug]` page)**
1. Vision · 2022— · Meesho Mall & Gold — "Two flagship branded programs taken
   from zero — shaping strategy and evolution through continuous user learning."
2. Craft · 2023 · Post-order, rebuilt — "Order tracking and balance
   comprehension overhauled to cut cancellations and lift NPS at Meesho scale."
3. Systems · 2024 · Intent channelization — "Category feeds, filters and Reels
   tuned to how rural India expresses shopping intent."
4. Current · 2025— · Repurchase, as a system — "Ongoing work on how India buys
   again — from buy-again moments to replenishment rhythms." [carries sticky
   note #3]

**How I lead (3 principles)**
1. Problems before pixels — "Every project starts by interrogating the
   problem — in review rooms and in users' homes. Field research is a habit,
   not a phase."
2. Evidence over opinion — "I argue with data — cohorts, funnels, session
   logs — and build my own tools when the data isn't shaped for design
   questions."
3. Craft is taught in critique — "I run critiques that raise the bar for the
   whole team, and mentor designers into owning rooms of their own."

**Off the bike**
- Quote: "Long routes teach what good products do: trust the system, read
  the terrain, look far ahead."
- Line: "I ride a Triumph Tiger Sport 660 out of Bengaluru. The kilometres
  are where the systems thinking settles."
- Sticky note: "the actual bike →" (pointing at a REAL photograph — never
  illustrated/generated for this specific asset)

**Contact**
- "I'm interviewing for design manager roles."
- "If you're building a team that ships with evidence and taste, let's talk."
- CTAs on glass slab: email (mailto), LinkedIn, Download CV

## 11. Sketch/art asset brief (for whoever generates or draws these)
Line-art marginalia, NOT standalone illustrations. Single continuous line,
uniform ~1.5–2px stroke, graphite `#3A372E @85%` on transparent, max ONE
amber `#F3B44A` filled accent per sketch, loose/confident/slightly imperfect
(not a smooth vector trace), consistent "hand" across all pieces. Deliver as
SVG with one `<path>` per stroke so `stroke-dasharray` draw-on animation works.
Needed: pointing arrow, loose circle/ring, underline-with-flick, small
motorcycle side-view silhouette (Tiger Sport 660 proportions, no branding,
under 15 strokes), annotation bracket. Full detailed prompt already produced
separately if needed.

## 12. Open items before/during build
- [ ] Real mentorship number for the scope block (currently TK)
- [ ] Real photograph of Uttham with the Tiger Sport 660 (never generated)
- [ ] Confirm sticky-note copy for tile #3 once case content is finalized
- [ ] Figma frames (home scroll + case template, ×3 breakpoints) to true-up
      spacing/grid against this brief once delivered
- [ ] Case-study page content for all 4 `/work/[slug]` routes (currently only
      home-tile summaries exist)

## 13. Reference set (for tone-matching, not literal copying)
mitchellclements.com · yanliuportfolio.vercel.app · marimba.design ·
pleurat.com · julius.fm — teardown data (fonts/colors/easing/timings/hex
values) already extracted; ping for the full comparison table if useful
mid-build.
