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
just show one section"). The hero is `min-height: 100svh` with its content
centred and `--header-height` added to its top pad; `#work`, `#ai` and `#contact`
are `min-height: calc(100svh - var(--header-height))`, content centred. **Each
section pads `--section-pad` — half a `--section-y` — top and bottom**, so two
neighbours' pads meet at the boundary and content-to-content is never less than
one `--section-y`; no section owns the whole gap, so none can double it. Every
`section[id]` lands a nav jump with `scroll-margin-top: var(--header-height)`.
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

## Contact fits one screen

**The whole contact section fits one viewport** (Uttham, 2026-10-01: "the whole
contact section should be in one viewport, let's remove the paragraph section for
the How I lead section"). The three principles are **a title and a tagline each,
nothing more** — the body paragraphs are gone, and that is the owner's cut, not a
compression, so "Uttham's copy is Uttham's" holds. **The bike photo is the panel's
focus; the notes are its actions** (Uttham, 2026-10-01: "it looks like block of 4
cards, I want the image to be more focussed, while the 3 CTAs retain their
clickability"). The three notes sit in **one row at their own size** — two lines
each, label and arrow then address, all three the widest one's width — and are
**never stretched across the leftover glass**, and never narrower than their
content (nothing wraps). They keep their tilt, hover lift and arrow. The photo is
**as big as the screen's height allows** (`--photo-w`: budget − 285px, ÷ 1.23,
150–340px), sized off the content budget, not its column, and sits one
`--space-4` in from the panel's right edge so its tilted corner clears the bolts
by the 16px they are owed. **No badges on the photo for now** (2026-10-01, "for
now remove the stickers") — `MotoSticker.astro` is kept so they are one import
away from coming back.

## AI Space and Projects are the same object

**An AI Space card is a Projects tile** (Uttham, 2026-09-21): same tape, paper,
title, lead line, glass well and an action that reads like "Read the case".
**Every card carries its own picture, on its own taped sheet** (Uttham,
2026-10-01: "why we are having image of one card, we should have for both") —
never one shared stage that several cards switch between; that was tried the
same day and reversed. **No pill-and-year row on any homepage tile** (2026-10-01:
"we don't need this whole section") — the kicker and year stay in the data for
the case pages, the guide pages and the case index. The old "two cards, never
three" cap is lifted (2026-10-01: "lets change that rule to 3"); each section
has two sheets today.

**A tool card is its name, its one line, the phone and the copy action —
nothing else** (Uttham, 2026-10-01: "remove the explanation on the main AI space
cards to optimise content, these descriptions can be in l2 page"). The "how it
helps" lines live on the tool's guide page, `/ai/<slug>`, word for word under
"How it helps", and **the whole card opens that page** the way a case card opens
its case: the title's link stretches over the sheet, and the copy action and the
prototype's phone link sit above it. No visible "read more" was added — the
action row stays "just Copy the plan, nothing else here".

How the two differ: **a case sheet stacks** — title, lead, the well, the action —
and on a laptop its well takes the height the copy leaves, so the cover sits as a
card on the pane; **a tool sheet sets its copy on the left and its phone on the
right** wherever the sheet is at least 540px wide (the phone column is
`clamp(220px, 40cqw, 280px)`), with the name, line and action **one block centred
against the phone's glass well**, and stacks like a case sheet below that. The well holds **one phone standing flush on the bottom edge and
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
