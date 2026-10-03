# Portfolio — working instructions

## Prose: bold the highlights

**Every long sentence or paragraph carries its highlights in bold.** A reader
should be able to skim only the bold and still get the argument. This holds
everywhere on the site — hero copy, case-study chapters, section intros, card
summaries, AI Space blurbs — and it is a standing rule, not a per-task request
(Uttham, 2026-09-20).

Markup, as `rich()` in `src/pages/work/[slug].astro` parses it:

| Syntax | Renders | Use for |
|---|---|---|
| `**text**` | `<strong class="em">` | the normal highlight |
| `^^text^^` | `<strong class="em em--lg">` | one bigger beat per chapter, used sparingly |

In `.astro` templates the same effect is plain `<strong>` (see the hero lead in
`src/pages/index.astro`).

Rules of thumb:
- Highlight the **claim**, not the connective tissue. Bold what the sentence is
  *for*, never a whole clause of setup.
- Roughly one highlight per sentence, two at most. If most of a paragraph is
  bold, nothing is.
- Short lines (under ~15 words) usually need none.
- `^^` is a beat, not a second weight of `**` — at most one per chapter.

## Metrics: no Meesho business figures

**No confidential business numbers anywhere on the site** — NMV share, user
counts, adoption or conversion percentages, order volumes (Uttham, 2026-09-20).
Say direction and magnitude instead: "climbed", "hit the share the business
asked for", "most shoppers". This mirrors `metrics_policy: direction-only` in
the Context Layer repo.

Not covered by this rule, and fine to keep: dates, version numbers, and the
method detail of Uttham's own research (number of rounds, sample sizes,
locations).

**A public figure Meesho itself published is fine** (Uttham's case-study brief,
2026-10-01: "Public figures are fine when sourced"). Today that is one number:
**250 million shoppers**, from Meesho's Q3 FY26 Shareholders' Letter (251
million annual transacting users). **It is not linked** (2026-10-02: "the 250mn
users in first project has a link please remove that"); the source stays in the
data file's comment. Outcome metrics stay off the site
even when public — no lifts, rates or conversion.

## Motion: magnetic sheets only where a hand would peel them

**Project tiles and AI Space cards keep the magnetic tilt; nothing else moves on
hover** (Uttham, 2026-09-20, late — this reinstates the tilt after it was retired
earlier the same day). `initMagneticTiles` in `src/scripts/motion.js` drives any
element carrying `data-magnetic`: pivot at the taped top edge, the free area
lifts toward the pointer, fine pointers only, reduced motion respected. Instax
photos and stickers never lift, tilt, straighten or peel — with the one
exception below; the `magnetic` prop on `InstaxFrame` stays retired. Other hover
states are colour, border and the arrow nudge only. Entrance reveals and the
pointer ride are unaffected.

**The contact notes lift on hover again** (Uttham, 2026-10-01: "the hover
animations on these cards are also gone, please fix them"). On a fine pointer a
note **straightens to 0°, rises `--lift-y` (2px) and takes `--shadow-lift`**;
pressing it returns the tilt and flattens the shadow; reduced motion keeps the
tilt and drops the lift. This is the original rule from before the 2026-09-20
no-hover pass, restored as it was — not a new one.

**The one exception is the hero portrait, which develops** (Uttham, 2026-10-01:
"make it grey, and once people hover, we can have the instax effect of shaking
and revealing the colored version"). `<InstaxFrame develop>` shows its image in
greyscale at rest on fine pointers; on hover **the print gives one short decaying
shake around its tilt and the colour comes up while it settles**, and on leave it
fades back to grey, slower and without a shake. The shake replaces the frame's
hover lift; the two never stack. The hi! sticker is stuck onto the print — about
40% of it over the print's top-right corner, clear of the face — and **rides the
same shake about the print's centre**. Reduced motion: no shake, the colour just
changes. Touch and coarse pointers: full colour, always. `develop` is opt-in and
lives only on the hero instance; **the contact bike photo stays still**. Its
durations (`--develop-in` / `--develop-out` / `--develop-shake`) are
component-local on purpose, above the `--dur-*` ladder, because a develop is
slower than any UI feedback; the values are in `docs/design-tokens.md`.

**The homepage sections settle into view, weakly** (Uttham, 2026-10-03: "can we
do a weak magnetic scroll of sorts to center these sections in viewports"): a
wheel gesture resting within 18% of a screen of a section's nav landing (Contact:
the page bottom) eases there, **never back past where the gesture began**; touch,
keys, nav jumps, reduced motion and teaser pages never snap (`section-snap.js`).

## Images: never full-bleed inside a glass panel

**An image or coloured cover sits as a card ON the pane, never filling it end to
end** (Uttham, 2026-09-20). Keep a margin on every side so the glass reads as the
surface underneath rather than as a frame around a picture. Size phone frames off
the container's *height* so they stand flush on an edge instead of being cut
mid-screen.

## AI Space previews: synthetic data only

**Every preview in the AI Space section renders invented data** (locked
2026-09-20). No Figma file key, no colleagues' records, no participant audio or
verbatims, no Meesho figures. The previews show the *mechanism*; the contents
are always made up. The visible "synthetic data" caption was **dropped on
2026-09-21** (Uttham: "no need to explain this") — the rule about the data
stands, the label on the card does not. Copy and framing live in
`src/data/tools.ts`.

**The realistic prototype's pictures are drawn and self-hosted** (2026-10-03).
Its compiled bundle used to hotlink about 1,260 real product photos from
Meesho's image server, plus placehold.co fallbacks and an Unsplash avatar.
`scripts/proto-synthetic-images.mjs` now **points every one of those URLs at a
drawn picture of the same kind** under `public/proto/feed-ux/catalog/` (shirts,
co-ords, sarees, cookers … from `scripts/proto-catalog-art.mjs`: no photo,
person, logo or lettering). The map in `scripts/proto-synthetic-images.json` is
keyed by a hash of each URL, so the real addresses stay out of the repo and the
same product always gets the same picture. **After any rebuild of the prototype
from its source, run the script** (`--check` says whether a remote image is
left); it renames the bundle, because `/proto/feed-ux/assets/*` is cached as
immutable. Only the pictures changed: the product titles, prices and ids are
still the build's own. Any file in `catalog/` can be swapped one for one for a
better picture of the same kind without touching the bundle.

## Spacing: the rhythm ladder

**Every vertical gap is one of four rungs, and each rung is a clear step under
the one above it** (Uttham, 2026-09-25; four rungs since 2026-10-01). Proximity
does the grouping, not borders. Between sections (`--section-y`, 96–160px) →
heading to its content (`--head-gap` + the board's `--tape-overhang`, 72px) →
card inset (`--card-padding`, 16–32px) → within a card (16px / 8px). Two traps,
both already sprung once:

- **Never put `--section-y` back on `vh`.** It is the only rhythm token that was,
  and `10vh` never cleared its own 96px floor on any laptop.
- **Never anchor the washi tape to the board's padding.** It is anchored to half
  its own height, so retuning the gap above the board cannot slide it inside a
  card.
- **Never let a sheet's content start under its tape.** The tape is 35px tall
  centred on the sheet's top edge, so 17.5px of it lies on the paper
  (`--tape-bite`, 18px). A taped sheet's top padding is `--sheet-top` =
  `max(--card-padding, --tape-bite + --space-4)` — the title clears the tape by
  one within-card step (16px) at every width. At `--card-padding` alone it
  cleared it by 0px on a phone (Uttham, 2026-10-01: "the washi tape is so
  tightly spaced with the product card").

**The hero is not a rung: it is one whole screen, and so is every section after
it** (Uttham, 2026-10-01: "in one viewport so many elements are there, I want to
just show one section"). The hero is `min-height: 100svh`; `#work`, `#ai` and `#contact`
are `min-height: calc(100svh - var(--header-height))`, content centred. **Each
section pads `--section-pad` — half a `--section-y` — top and bottom**, so two
neighbours' pads meet at the boundary and content-to-content is never less than
one `--section-y`; no section owns the whole gap, so none can double it. Every
`section[id]` lands a nav jump with `scroll-margin-top: var(--header-height)`.
**The one exception is the last screen**: Contact has no bottom pad and shares
its screen with the footer (see "Contact fits one screen").

**The hero sits optically high, not centred** (Uttham, 2026-10-03: "there is
lot of top space than bottom as the image is only on left side, can we optimise
by moving the content slightly above and keeping more space down, to balance
the negative space"). Centred, the heavy band — the glass slab and the scene
beside it — sat ~85px below the screen's middle, because the portrait poking
above the slab on the left only counted as half the block. The hero's top pad
is `--header-height` + `--space-7` (no section above it to keep a rhythm with;
48px still clears the portrait's hi! sticker), its bottom pad stays
`--section-pad`, and on laptops (≥1024px) **the free space splits 1 : 2 above :
below** through `minmax(0, 1fr) auto auto minmax(0, 2fr)` rows, so the band now
sits 22–42px below the middle at 1226×924 to 1920×1080, with the larger margin
at the bottom. With no room to spare both fr rows collapse to 0, so short
screens are unchanged; below 1024px the hero stacks and simply centres.
Centring is block-level `align-content: center`, so the children keep normal
flow and their collapsing margins; a browser without it top-aligns, which is the
old layout.

This **retires the peek** (plans/016, /018, /023) and the `--section-y-hero`
token: there is no fold for Projects to peek into, so it takes a normal section
gap. Never reintroduce a peek, a hero-specific top gap on `#work`, or a whole
`--section-y` on one side of a section.

Two costs, stated so nobody "fixes" them by accident:

- **On tall screens `min-height` adds slack.** The content budget is
  `100svh − --header-height − --section-y`; a section shorter than that is
  centred and the slack lands on no rung, so the between-section gap is *at
  least* `--section-y` and grows with the viewport.
- **A sheet is sized to the screen, with a floor.** On a laptop each Projects
  and AI Space sheet gets `--sheet-in` of content height — the budget less the
  section's chrome and the sheet's padding, clamped 360–480px — and the picture
  takes what the copy leaves. Below the floor the section grows instead of the
  phone shrinking, so Projects and AI Space run a little over at 1280×720;
  Contact does too, by 11px, from its photo and notes rather than a sheet
  (plans/025 has the table). That is the trade, not a bug.

The full table and what supersedes what live in `docs/design-tokens.md`; the
ladder pass is `plans/023`, the screen contract is `plans/024`. Re-measure
before trusting any pixel figure recorded in an older plan — three of them were
stale.

## Header: end to end

**The header's content spans the full viewport at every width** (Uttham,
2026-10-01: "the header top nav should always be end to end"). `.site-header__inner`
is `width: 100%` with `padding-inline: var(--margin-side)`, so the wordmark sits
on the left gutter and the nav on the right one; **it is not capped to
`--container-max`** — only the page sections below keep the 1200px column. Its
height is still `--header-height` at every breakpoint, and both the rhythm
ladder and the screen contract lean on that, so never size the bar any other
way. Above ~1350px the bar's edges and the sections' edges visibly differ; that
is what "end to end" asks for.

**While the header avatar is hidden it takes no room** (Uttham, 2026-10-03: "the
name should be left aligned when no favicon, once it is there move the name").
On the homepage the avatar starts folded away (`<Header heroAvatar />`, so it is
hidden from the first paint, not after the script) and the wordmark sits on the
left gutter; once the hero portrait scrolls out, motion.js unhides it and the
name slides over as the avatar's width and trailing gap animate in. Reduced
motion: the avatar fades and the name moves without sliding. The gap belongs to
the avatar (`--avatar-gap`), not the brand's flex gap, so it folds with it.

## Contact fits one screen

**Contact and the footer share the last screen** (Uttham, 2026-10-02: "reduce
the space between footer and last section, so whole contact with footer can come
in one viewport"). `#contact` gives up its bottom pad and takes
`min-height: calc(100svh − header − --footer-block)`; the footer's own top pad,
one `--section-y-sm`, is the only gap between the panel and the footer rule, and
its bottom pad is one `--card-padding` (the 96px it kept for a page navigator
that no longer exists is gone). A jump to `#contact` lands the *content* one
`--space-6` under the header, so the top pad slides under it and the footer
stays on screen. Measured 1024×768 to 1920×1080: content + footer fit at every
size, with 6px of air at 1366×768, where the photo is at its 150px floor.

**The whole contact section fits one viewport** (Uttham, 2026-10-01: "the whole
contact section should be in one viewport, let's remove the paragraph section for
the How I lead section"). The three principles are **a title and a tagline each,
nothing more** — the body paragraphs are gone, and that is the owner's cut, not a
compression, so "Uttham's copy is Uttham's" holds. **The sheet runs on one inset,
`--prin-x` = `--card-padding`** (Uttham, 2026-10-03: "spacings can be optimised
… are they consistent or not, please fix them"): the paper's sides, the paper
showing under the taglines, and each side of the dashed rules (drawn in the
middle of a 2 × `--prin-x` column gap, so every column is the same width). Its
top, `--prin-top`, clears the "How I lead" sticker — now centred on the top edge
like washi tape — by one `--space-4`. Both tokens live on `#contact`, and the
photo's height budget subtracts them, so a change to the sheet moves the photo
instead of pushing Contact off the screen (re-measured: the fit at 1024×768 to
1920×1080 is unchanged). **The bike photo is the panel's
focus; the notes are its actions** (Uttham, 2026-10-01: "it looks like block of 4
cards, I want the image to be more focussed, while the 3 CTAs retain their
clickability"). The three notes sit in **one row at their own size** — two lines
each, label and arrow then address, all three the widest one's width — and are
**never stretched across the leftover glass**, and never narrower than their
content (nothing wraps). They keep their tilt, hover lift and arrow. The photo is
**as big as the screen's height allows** (`--photo-w`: what the screen leaves under the header after `--space-6` of air, the footer and 412px of everything else, since 2026-10-02; it was budget − 295px, ÷ 1.23,
150–340px), sized off the content budget, not its column, and sits one
`--space-4` in from the panel's right edge so its tilted corner clears the bolts
by the 16px they are owed. **Tablets (≤960px) set the notes in one column with the photo beside them, centred against each other; phones (≤600px) stack them on one left edge** (2026-10-02: "the contact me cards and image, they are not aligned"). **No badges on the photo for now** (2026-10-01, "for
now remove the stickers") — `MotoSticker.astro` is kept so they are one import
away from coming back.

## AI Space and Projects are the same object

**An AI Space card is a Projects tile** (Uttham, 2026-09-21): same tape, paper,
title, lead line, glass well and an action that reads like "Read the case" —
**"View more →"** (2026-10-02: "the ai cards should not have copy the plan as
CTA, view more should be the CTA for it").
**Every card carries its own picture, on its own taped sheet** (Uttham,
2026-10-01: "why we are having image of one card, we should have for both") —
never one shared stage that several cards switch between; that was tried the
same day and reversed. **A project tile's well holds the case page's own screens in phones** (`tile` in `studies.ts`, 2026-10-03): the product cards show the old and new feeds side by side, tagged Before and After (the after on amber) — "from what to what" — and Mall shows its landing page. Screens Uttham drops anywhere in the website folder are filed by state under `src/assets/plp/` or `src/assets/mall-case/` and wired in. **No pill-and-year row on any homepage tile** (2026-10-01:
"we don't need this whole section") — the kicker and year stay in the data for
the case pages, the guide pages and the case index. The old "two cards, never
three" cap is lifted (2026-10-01: "lets change that rule to 3"); each section
has two sheets today.

**A tool card is its name, its one line, the phone and "View more" —
nothing else** (Uttham, 2026-10-01: "remove the explanation on the main AI space
cards to optimise content, these descriptions can be in l2 page"). The "how it
helps" lines live on the tool's teaser page, `/ai/<slug>`, word for word under
"How it helps", and **the whole card opens that page** the way a case card opens
its case: the title's link stretches over the sheet (an iframe may not sit
inside a link, so the sheet cannot be one) and "View more" is its visible,
aria-hidden action, as "Read the case" is a case tile's; the arrow nudges on the
sheet's hover. **The phones are running previews with no link or pill of their
own** (Uttham, 2026-10-01: "in the ai prototype card, no need to add view
prototype link, clicking on the card will move to ai space teaser page") — a
click anywhere on the card, the phone included, opens the teaser; the full-size
prototype is opened from the teaser page instead. The copy buttons are gone from
the cards; the prompt is copied on the teaser page.

How the two differ: **a case sheet stacks** — title, lead, the well, the action —
and on a laptop its well takes the height the copy leaves; **a tool sheet sets its
copy on the left and its phone on the right** wherever the sheet is at least 540px
wide (the phone column is `clamp(220px, 40cqw, 280px)`), with the name, line and
action **one block centred against the phone's glass well**, and stacks like a
case sheet below that.

**A case sheet's well shows the case's own screens as a from → to** (Uttham,
2026-10-03: "highlight the old and new in the first, basically from what to what,
it should look like 2 phones showing both the variations"; "create phone mocks to
represent the images on home page … these images have strong hook and content").
**The "from" phone stands shorter (86% of the well) and in grey; the "to" stands
full height in colour, its tag on amber**; both flush on the bottom edge, sized
off the well's height. **One paper loupe strip across both magnifies the same
region of each screen**, so the change itself reads at tile size — on product
cards, a line of name text becoming fact chips. The crops are CSS windows over
his exports (`loupe` in `src/data/studies.ts`, `[x, y, w, h]` in the export's own
pixels, both windows the same aspect ratio), never pre-cropped files, and they
stop above the price rows. **It is all static**: nothing in the well moves on
hover (the tile keeps its tilt, border and arrow nudge), the strip overlays the
well so the sheet gains no row, and it renders only when a tile has exactly two
phones that both carry a loupe. A case with one screen keeps one phone and no
strip — Meesho Mall, until Uttham approves standing his v2 deck export beside the
v3 landing (the pair is written out, commented, in `studies.ts`).

A tool sheet's well holds **one phone standing flush on the bottom edge and
nothing else** — no step list, no page list, no caption beside it — and the phone
is as tall as the well, so it takes a handset's proportions rather than a fixed
9/15. Keep the two sections within sight of each other in height: if a card is
running long, take it out of the layout, not out of the copy.

## Favicon: the header avatar

**The site's favicon is the header avatar** (Uttham, 2026-10-01: "use the header
icon as website favicon too"), generated from `public/assets/avatar.png`: cropped
square to the head (the collar goes) so it still reads as a face at 16px.
`favicon.ico` (16/32/48) and `favicon-192.png` are transparent;
`apple-touch-icon.png` (180×180, opaque) sits on `--paper-1`, the white sheet
stock, with an 8% margin, because iOS paints a transparent touch icon black. Linked once, in `src/layouts/Base.astro`. If the avatar changes,
regenerate all three from it — never draw a separate mark.

## Domain trust

**uttham.fyi has to look like a real, maintained personal site to the filters
recruiters sit behind** (Uttham, 2026-10-03: "how can we make our domain more
trustable, find ways and lets execute that"; his office Netskope blocks it as a
newly registered domain). On-page SEO came in the same pass. What lives where:

- **`public/_headers` sets the security headers on every response**: HSTS,
  nosniff, Referrer-Policy, `X-Frame-Options: SAMEORIGIN`, a Permissions-Policy
  and an enforced Content-Security-Policy. It also sets long caching on the
  hashed `/_astro/*` and `/proto/feed-ux/assets/*`, and noindex on workers.dev.
  The CSP lists exactly what the build loads, so **a new embed, font, image host
  or analytics script needs adding to the CSP first, or it is silently
  blocked**. `'unsafe-inline'` stays because Astro inlines its small scripts
  and the pages use style attributes. **`img-src` is `'self' data:` and no
  host** since 2026-10-03, when the prototype's catalogue went self-hosted (see
  "AI Space previews"); Google Fonts stays for the prototype's DM Sans. PDFs
  drop the CSP so the browser's viewer opens them. The microphone stays allowed for this origin only, because the
  prototype has voice search. **HSTS carries `preload`** (Uttham, 2026-10-03:
  he chose to preload now rather than wait a few clean weeks). The list is hard
  to leave — removal takes months — so **every subdomain of uttham.fyi must
  serve HTTPS for good**; never point one at a service that cannot. The
  submission at hstspreload.org needs Cloudflare's Always Use HTTPS on first.
- **Every page names its one address on the apex** (`<link rel="canonical">`,
  from `site` in `astro.config.mjs`), so the www and workers.dev copies fold
  into it. Titles, descriptions, Open Graph, Twitter and JSON-LD are built in
  `src/lib/seo.ts` and printed by `src/layouts/Base.astro`, after the font
  preloads. **They are assembled from copy already on the site, never written
  fresh**: the hero line on the homepage, title plus dek on a case page, the
  guide's headline plus the card's line on a tool page. They are joined only
  while they fit 60 / 155 characters, otherwise the shorter whole sentence is
  used, and the build warns when one runs over. The homepage carries the
  `Person` (with LinkedIn and GitHub in `sameAs`). Case and tool pages carry a
  `CreativeWork` by that Person plus a two-step `BreadcrumbList`.
- **Link previews are drawn in the site's own stock**, from
  `scripts/og/og-card.html` (its comment has the render command), as
  `public/og/<card>.jpg` at 1200×630. That is a card for home and one for each
  case; tool pages use home. **Keep each under 300KB, or WhatsApp drops the
  picture.** They repeat the case titles and deks, so re-render after changing
  either.
- **`/sitemap-index.xml` comes from `@astrojs/sitemap`**, pinned to 3.7.0, the
  last release for Astro 5. `public/robots.txt` names it.
  `public/.well-known/security.txt` gives the contact-panel email and
  **expires 2027-10-01; renew it before then**, because a stale one reads as
  abandoned.
- **A wrong address gets `src/pages/404.astro` with a 404 status**, because
  `wrangler.jsonc` sets `not_found_handling: "404-page"`. The 404 is noindex and
  stays out of the sitemap. **`workers_dev: true`** (Uttham, 2026-10-03), so the
  site can be checked from a network that blocks uttham.fyi; with `routes`
  present Wrangler turns that address off unless this says true. It is noindex
  and its canonical tags name the apex.
- **One h1 per page and no skipped levels.** "How I lead" is an h2, so its three
  principles sit under it rather than under the AI Space heading. The Resona
  preview's screen labels are paragraphs, not h4s: they are the tool's UI, not
  the page's outline. The styles are unchanged.

Everything else is dashboard or third-party work that only Uttham can do: DNSSEC,
email anti-spoofing records, the www → apex redirect, Search Console and Bing,
and the web-filter recategorisation requests.

## Case study pages: the teaser layout

**The product-cards case study (`/work/a-line-of-card-height`) is Uttham's teaser
layout, built as he drew it** (2026-10-01, "PLP card case study — teaser
layout.html": "I want that as it is"). Text only on the left — Context, Problem,
Strategy, Outcome (the scan-order section came off on 2026-10-02: "what shoppers
look at - we can omit this section") — and **a sticky phone on the right that swaps
to the screen for whatever is being read** (the bus-discovery reference). Every
element with a `data-state` picks a screen; **the screens are Uttham's Figma
exports, never coded mock-ups** ("I will give the figma screens, use them, no
need to code"), dropped into `src/assets/plp/` named after their state (the
README there lists them). A state without a screen shows the nearest earlier state's
screen, and the dev server names the missing one. **Responsive, learnt from the
same reference:** laptops and tablets (≥768px) keep the phone sticky beside the
text (7/5 columns, 5/3 on the 8-column tablet grid); **phones float it as a mini
player in the bottom-right corner** — it appears once the hero has gone, keeps
following the reading, opens full size on a tap, hides on × ("Show preview"
brings it back) and steps away at the end of the study. Content lives in `src/data/plp-case.ts`;
the page is `src/components/CaseTeaser.astro`, opted in by `teaser` on the study.

**Meesho Mall is the same teaser**, from `src/data/mall-case.ts`, reworked on
2026-10-02 from his notes: Role Senior Product Designer, 2022–2023; where it
started (competitive, better-quality alternatives for shoppers who seek quality,
and a quiet hint that the first launch found the go-to-market); v2 as the bold
version that followed; the research before the v3 launch, with its sticky note;
v3; what happened. **Its full case study is behind the same gate**, built from
his own deck chapters (git `09893d8^`): no colleague names, no team-lead claims,
no numbers. **Uttham supplies every case-page screen** (2026-10-02: "the existing
screens you have put are all bad for projects remove them and ask me I will give
all of them"): they go in `src/assets/plp/` and `src/assets/mall-case/`, named by
state, listed with their card titles in `screens.titles`; until one exists the
phone borrows the previous screen, and with none at all the build shows "Screen
coming soon". `src/assets/mall/` is the Mall deck's own exports, kept only for the
homepage tile.

**The teaser pages run on the homepage spacing ladder, stepped up for reading**
(Uttham: "make sure there is lot of spacing … it should match that system"):
`--section-y` between sections (the bus-discovery reference's 160px), `--ct-head`
(32) from a heading to its text, `--ct-sub` (48–64) to a sub-group and above its
heading, `--ct-para` (24) between paragraphs, rows padded `--space-6` — one rung
up on 2026-10-02 ("the texts are closely placed making it too textual"). **Each
block of rows or steps plays as a slideshow** (2026-10-02: "the preview runs
these 4 slideshows, accordingly the highlight changes in the left … in all the
blocks"): once the reading reaches a block showing two or more different
screens, the phone runs through them a beat (2.6s) each and the row it shows
takes the highlight; hovering a row holds it; reduced motion keeps the
scroll-driven pick. The table is in `docs/design-tokens.md`; never drop these pages back
to `--section-y-sm`. **Every teaser page navigates by a rail of scroll points,
each title a tooltip** (Uttham, 2026-10-02: "the sticky notes as scroll points in
l2 is weird lets do the one you initially made but the active or hover state show
these as tooltips" — this retires the 2026-10-01 book-style bookmarks). A tick
per section and per sub-group heading, fixed and vertically centred in the right
gutter (a sub-group's tick shorter, the one being read longer and in
`--ink-900`), the full study and its blocks joining once it is open; a click
jumps. **Only one title shows at a time, as a small paper tooltip left of its
tick**: the current tick's, or the hovered or keyboard-focused one's instead.
It fades, never slides. The rail is ≥768px only, since on phones the mini player
owns the right edge. **A page can limit its rail** (`rail` on the page's data;
2026-10-02: "the scroll stepper should also have limited things, outcome,
strategy, problem, title"): the product cards keep only the top of the page (its
title), Problem, Strategy and Outcome — no sub-group ticks, no full-study ticks.

**The phone card hugs the phone** (2026-10-02: "too much padding on left right of
the mobile preview, we should optimise this space"): from 768px the phone is as
tall as the screen allows (`--ct-pane-h`, ≤720px) and the card is the phone plus
one `--card-padding` all round, centred in its columns, so spare width falls
outside the card. **The card is centred in the visible height under the header** (the sticky box is `100dvh` less the header and two gaps, so a tablet browser's sliding address bar never piles the spare height under the card; 2026-10-02: "less spacing on top than bottom"). **Reference boards are shown whole** (2026-10-03: "I will give reference image (figure out a way on how to place this)"): a screen wider than a phone (width/height > 0.62) drops the phone frame and the card widens to its whole column, the board contained on the paper at the phone's height; a block that holds any board keeps the card wide throughout, so the slideshow never makes it breathe. **The card carries a title above the phone** naming what it
shows (`screens.titles`, one short line per state; a state that borrows an
earlier screen borrows its title); the mini player on phones has none.

**Glass only where something sits between** (Uttham, 2026-10-01: "for the phone
preview no need to use the glass, use the card component, glass is only used
when you want to keep something between"). On the teaser pages the phone and the
AI prompt panel stand on the paper card (`--paper-1`, `--line-1`, `--radius-sm`,
`--shadow-rest`, `--card-padding`), the prompt in the sheet's recessed well
(`--paper-2`); glass is for a pane with something tucked behind it, as the hero
portrait is behind its slab.

**The AI Space tool pages are one-pagers, not teasers** (Uttham, 2026-10-02:
"for AI space cards, there is no need to have teaser, just a one pager only" —
he then chose to keep the layout and drop the word). Everything is on the page,
nothing is gated, and the page is about **explaining his work** ("just this page
is all about explaining my work"). They borrow the case studies' layout
(2026-10-01: "the right side is running preview as we did for the project case
studies"): `/ai/<slug>` renders `CaseTeaser` in live mode with `frame="phone"`: **the left column is
the white-label guide and the sticky phone runs the tool itself**, in the
teaser's own 9/19.5 phone (the tool fills it). Left, in order (2026-10-02): the page's headline and summary as the hero
(explaining the tool, not selling it); facts — Tool, **Value added** (his line
on who uses it, where he has given one; it replaces Kind) and Year; The idea
(the prototype: how the spark came, then the real-data claim with its one `^^`
beat); How it helps; **How I made it** (Resona, in four sub-groups — research
planning, execution, synthesis, library — each with his lead and rows that drive
the phone; never called a skill, no tool or model names, mechanism only); **Next
steps** (the prototype: the pilot, and the advanced version with the tech team);
then the recipe — **The prompt, then What you get** (2026-10-02: "what you get
should be after the prompt section for both the ai projects"). The prompt card
carries the page's one primary sticker, "Copy the prompt", and **the prompt
folded to its first ten lines with "Show the full prompt" under it**; the button
always copies the whole `<pre>` word for word. **The prompts are white-label and
follow the page**: each does what its page says the tool does (Resona's has four
modes: Prepare, Run, Synthesise, Library), and wherever the real tool leans on
Meesho context it asks the reader for their own instead; no prompt names Meesho,
its users or internal tools. **What you need and What to change for your team
are gone** (2026-10-02). **No copy
lives in `src/data/ai-pages.ts`**: it arranges `tools.ts` and `guides.ts` and
says which step each row shows. **Resona follows the reading** (`follow`): every
row and step names one of its own steps — prepare, setup, record, synth, insights — and
the phone shows that step; the homepage card keeps its loop. **The prototype
just runs, and can be used in the phone** (`interactive`); driving its routes
from the reading would pull it out of the reader's hands, so its rows carry no
state, and "Open the prototype ↗" under the facts opens it full size. On phones
a live phone opens full size *in place* on a tap (moving an iframe into the
dialog would reload it), centred under the header over a dimmed page; × or the
page shrinks it, a second × hides it. A page that ends on its last rows (these
do) lets the reading band slide down over the last half screen, so those rows
still drive the phone; a page with rows that all reach the middle never takes
that path.

**The full case study opens behind a light gate** (Uttham chose "Light
gate only"). **The password card holds the "In the full case study" list** (2026-10-02:
"I want the full case study information in the white card"): its line, the
list, then the button; a right password reloads the whole page, which opens on a
dashed separator labelled "The full case study"**, with the card and the list
hidden (2026-10-02: "once I enter the password the whole page should refresh,
with seperator to show the added content"). The gate is a speed bump, not protection — the text ships in the page and this
repo is public. Only the password's SHA-256 is stored, set with
`npm run case-password`; with none set, the dev server opens it with any entry
and a production build for no one. **A research verbatim his layout marks
consent-open stays off the page** (`consent: false` on the quote; the
product-cards fabric quote left with the scan-order section on 2026-10-02) until
he confirms it; the Mall quotes are not so
marked and were already public. Anything a brief marks "open" is left out,
never shown as a placeholder.

## Uttham's copy is Uttham's

**When he supplies the words for a card, section or chapter, use them** — fix
grammar and add the bold highlights, nothing else (Uttham, 2026-09-21).
Compressing his sentences to fit a layout changed what they meant. If the copy
does not fit, change the layout or ask; do not paraphrase it shorter.

## A tool preview keeps the tool's own identity

**A preview renders the tool's real UI, not a restyled version of it** (Uttham,
2026-09-20). Resona is black with magenta `#9F2089`, a numbered pill stepper
(`Preparation → Observations → Synthesised`), 16px radii and white chat bubbles —
taken from `Resona Web app/components`, not invented. Its frame gets
`frame--dark` so the chrome belongs to the app inside it. Only the *data* is
mock; the design language is the tool's own.

## Tokens: keep the existing names

**The token names stay as they are** — `--ink-*`, `--paper-*`, `--amber-*`,
`--line-*`, `--text-*`, `--space-1..12`, `--section-y` and the rest of the
rhythm ladder (Uttham, 2026-10-01: "keep consistent tokenised elements"). **Do
not rename to a `--color-*` / `--space-*` namespace**: it would rewrite ~900
`var()` references and orphan 207 token-name mentions across `plans/` and
`docs/design-tokens.md`, which no codemod can fix. A tool that needs category
grouping maps prefixes to categories in a table instead. New tokens follow their
family's prefix; component-tier tokens (`docs/design-audit.md` §5.2) are named
for the component (`--cta-*`, `--tile-*`, `--pill-*`). The decision is recorded
as `docs/design-audit.md` §10, decision 1; decisions 2–6 there are still open.
