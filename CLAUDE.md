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
pointer ride are unaffected. **The pointer ride leaves only soft exhaust gas** (Uttham,
2026-10-05: "lets get rid of the tire marks … lets get subtle exhaust fumes,
more like gas feel"): no rubber marks, and no grain or smear that reads as a
brush stroke; the measurements are in `docs/design-tokens.md`.

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
shake around its tilt and the colour comes up while it settles**. **Once developed
it stays in colour for the rest of the browser session** (Uttham, 2026-10-03:
"once hovered on photo and removed the grey filter, keep it colorful throught
that session"): the first mouse or pen hover sets `is-developed` and a
sessionStorage flag, an inline script after the figure restores it before the
first paint on later pages of the session, and a later hover still shakes the
print without greying it. The shake replaces the frame's
hover lift; the two never stack. The hi! sticker is stuck onto the print — about
40% of it over the print's top-right corner, clear of the face — and **rides the
same shake about the print's centre**. Reduced motion: no shake, the colour just
changes. Touch and coarse pointers: full colour, always. `develop` is opt-in and
lives only on the hero instance; **the contact bike photo stays still**. Its
durations (`--develop-in` / `--develop-out` / `--develop-shake`) are
component-local on purpose, above the `--dur-*` ladder, because a develop is
slower than any UI feedback; the values are in `docs/design-tokens.md`.

**The homepage sections settle into view, magnetically** (Uttham, 2026-10-03:
"can we do a weak magnetic scroll of sorts to center these sections in
viewports", then later that day "improve magnetic scroll strength on home page,
and bring it on l2 pages as well"): a wheel gesture resting **within 30% of a
screen** of a section's nav landing (Contact: the page bottom) eases there in
0.6s on a damped curve (no bounce), **never back past where the gesture began**;
touch, keys, nav jumps and reduced motion never snap (`section-snap.js`). It was
18% and 0.8s until the second note. **The teaser pages settle too** (see "The
teaser pages settle into a part" under the teaser layout): 22% of a screen ahead
to the place where a part of the reading takes the phone, 10% back onto the
part just entered, and never more than 35% of the gap between two parts, so
every gap keeps a stretch that is nobody's. The homepage's rules hold there too.

## Images: never full-bleed inside a glass panel

**An image or coloured cover sits as a card ON the pane, never filling it end to
end** (Uttham, 2026-09-20). Keep a margin on every side so the glass reads as the
surface underneath rather than as a frame around a picture. Size phone frames off
the container's *height*. **A running preview** — an AI Space tool's phone —
stands flush on the well's bottom edge instead of being cut mid-screen; **an
export Uttham supplied is shown whole instead** (next paragraph), so it never
stands flush.

**A big image is shown whole, never pasted in or cropped abruptly** (Uttham,
2026-10-03: "when I give big images I dont want you to just paste them or crop
them abruptly making its content gone"). Give its frame the export's own aspect
ratio, size it to fit (never `object-fit: cover` on a screen), and keep every
edge of it on the glass. Nothing sits over it either: a label goes beside or
above the picture, never on it. The homepage project tiles do this: their phones
are whole screens standing as cards with glass on every side, not flush on the
well's edge, and their Before/After tags stand above the phones (2026-10-03:
half over the screen, they hid each export's search bar).

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
person, logo or lettering), and **draws the home strip's round category tiles**
(`categories/*.png`, which were photographs of models and products) under their
own names. **A card's picture follows the chip on the card**, which names the
record's category, not its title: a dress filed under co-ords shows a co-ord
set, because a feed card shows "Co-ord Set" and no title (2026-10-03 review:
pictures by title put ten trousers and tops under "Co-ord Set" chips on the
home feed's first screen). **Toys and under-bed storage are the exception**:
their category pictures were bottles, cookers and bedsheets, so they are
pictured by their titles (`BY_TITLE`), per record, not per URL, as the brief
asked; storage keeps its "Bedsheet" chip. The map in
`scripts/proto-synthetic-images.json` is keyed by a hash of each URL, so the
same product always gets the same picture and the current files do not list
the addresses; **the bundle committed before 2026-10-03 still holds them in git
history**.

**The prototype's records are synthetic too** (2026-10-03 review).
`scripts/proto-synthetic-data.mjs` **replaces the interview setup's four
participants' orders with invented ones** of the same shape (the same status
mix, dates in the same weeks, round prices, one repurchase each), **dealt so
that no basket shares more than one kind with any old one** and no kind keeps
its old status, date or repurchase role, **takes brand and seller names out of
catalogue titles**, drops each record's link to the marketplace listing it was
copied from (nothing rendered it), and fixes the My Orders routes, which carried
the base path twice and left an order's detail page blank. The catalogue's ids,
prices and ratings are still the build's own. The setup screen still introduces
the participants as "their real orders" loaded "from the workbook": that is the
prototype's UI copy, left for Uttham to reword.
**After any rebuild of the prototype from its source, run both scripts, images
then data** (`--check` on each says whether anything is left); each renames the
bundle, because `/proto/feed-ux/assets/*` is cached as immutable, and a second
run changes nothing. Any file in `catalog/` can be swapped one for one for a
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

## Header: its content on the grid lines

**The header bar runs edge to edge, and its content stands on the page's grid
lines** (Uttham, 2026-10-03: "the header content als should have the same
spacing left and right along the grid lines"). `.site-header__inner` insets its
content by GridOverlay's own `--edge` — `--margin-side`, or half of what the
viewport leaves beside `--container-max`, rounded down to a pixel — so the
wordmark starts on the left line and the nav ends on the right one at every
width. This replaces 2026-10-01's "the header top nav should always be end to
end", when the content ran to the viewport's gutters. Its height is still
`--header-height` at every breakpoint, and both the rhythm ladder and the
screen contract lean on that, so never size the bar any other way.

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
content (nothing wraps). They keep their tilt, hover lift and arrow. **A note is
one action, its link — no copy control** (Uttham, 2026-10-03, after trying one:
"drop the copy icon and funtionality remove the code as well"; two actions on
one small note were too close on a phone). **The email note shows his own
address, not a forwarding one** ("lets keep my original email only here, no need
of the proxy"): the Cloudflare route from hi@uttham.fyi still works but nothing
on the site names it. The photo is
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
same day and reversed. **A project tile's well holds the case page's own screens in phones** (`tile` in `studies.ts`, 2026-10-03): the product cards show the old and new feeds side by side, whole, tagged Before and After (the after on amber) — "from what to what" — with a few handwritten notes on what changed, and Mall does the same with his v2 landing page beside the v3 landing, tagged v2 and v3 (2026-10-03: "2 can do"; the v2 is his own landing export, not the deck's footwear page). Screens Uttham drops anywhere in the website folder are filed by state under `src/assets/plp/` or `src/assets/mall-case/` and wired in. **No pill-and-year row on any homepage tile** (2026-10-01:
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
**The "from" phone stands shorter (86% of the "to") and in grey; the "to" stands
full height in colour, its tag on amber**; both on one baseline. **Every phone
shows its whole screen** (see Images): the frame takes the export's own aspect
ratio, and the pair stands as cards on the glass, sized off the well's height —
or its width, when the pair and its notes would not fit across. **Each tag stands
one `--space-2` above its phone, never over the screen**, and the well keeps the
tag's room out of the "to"'s height; that costs the phones about a tag's height
on a short laptop well (1280×720: the "to" is ~74px wide), the price of showing
every screen's top row.
**The loupe strip is gone** (Uttham, 2026-10-03: "not liking the output of
highlighting the change in this lets keep it like the grey and colorful ones
only") — never put a magnifier or a crop window back on the tile. **Handwritten
notes beside the pair say what changed instead** ("maybe add some highlights in
text around the thumbnail about what we changed"): Caveat in ink straight on the
glass, a few words each, each with a hand-drawn arrow whose tip lands on the
part of the screen it talks about (`notes` on a phone in `src/data/studies.ts`,
`y` a fraction of that screen's height; words true to the screens, no numbers,
and the wording is Uttham's to set). They stand on the pair's outer sides — the
"from"'s to its left, the "to"'s to its right — never between the phones or over
a screen, and **a well under 440px wide keeps only the "to"'s notes**, which is
a tablet's two-up row, a phone and a small laptop; under 280px (a 320px phone)
only its first, in a narrower column and hanging below its tip. **On a phone
(≤600px) the well shows only the "to", zoomed** (Uttham, 2026-10-03: "in mobile
view, lets remove before and after just show the final version image without
notes and everything"; "I want the images to be zoomed and clear … keep a
zoomed view as well"): no "from", no tags, no notes; the final screen takes the
well's width inside one `--space-4` of glass, anchored at its top, and runs off
the 4 : 5 well's bottom edge, loaded up to 1080w. **This is the one place a
screen is not shown whole** — his exception, because the whole screen was too
small to read on a phone. **It is all
static**: nothing in the well moves on hover; the tile keeps its tilt, border and
arrow nudge, and the notes ride the tilt with the sheet. A case with one screen keeps one phone;
both cases have a pair today. **A note can carry on into the screen** (`x` on a "to" note: a thin ink line on a paper halo from its arrow's tip to a dot on the part it names, for a part in the far column — the product cards' "Images scroll" lands on the yellow kurti's carousel dots, 2026-10-03). **Keep a phone's notes about half a screen apart**
(`y` 0.4 and 0.91 on the Mall "to"), or their words collide on a short tablet or
laptop well. **Where the truth leaves them closer, the lower note is one line**:
the product cards' "to" has "Facts replace the title" at 0.31 (the shampoo's
chips) and "Images scroll" at 0.658 (the third product's carousel dots), a third
of a screen, 51px on a 1280×720 well where the "to" is 148px tall; a note's box
is 44px on one line and 65px on two, so only the one-line note clears (7px;
"Images you can swipe" wrapped and ran into the note above). A one-line note must
leave room in the narrowest note column, ~104px of text at 18px, so "Scrollable
images" (103px) was too tight. The tip lands on the screen's right edge, where
the "to"'s notes stand, so "Images scroll" points across the row of the dots
rather than at the kurti's card itself (its dots are in the left column).
**The product cards tile is titled and worded by Uttham** (2026-10-03: "Meesho
product cards title use camel case, and subtitle From quick scan to empowered
scan, and helping users understand products better."): the title is **Meesho
Product Cards** and its line "From quick scan to empowered scan, and **helping
users understand products better.**"; his notes on the tiles' arrows: "instead of
cards at natural height, say that images are scrollable, the third product in new
one shows this" and, on Mall, "say that mall is explained via brands as hook not
USPs" (the arrow lands on the purple "Popular Brands" band under the cards).

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
  preloads. **Descriptions are assembled from copy already on the site, never
  written fresh**: the hero line on the homepage, word for word (not recast to
  carry his name or "Meesho"; the title does that), title plus dek on a case page,
  the guide's headline plus who uses the tool (its Value added line) on a tool
  page, or the card's line where that runs long. They are joined only while they fit
  155 characters, otherwise the shorter whole sentence is used, and the build
  warns when a title passes 60 or a description 155.
- **Titles name him, his roles, his employer and the page's topic**, the words
  people search for (Uttham, 2026-10-03: "it should trigger for uttham, or
  product designer, design manager and all relevant scopes I hope"). Home is
  "Uttham Udatthu — Design Lead and Product Designer at Meesho"; a case is the
  employer-plus-topic query, then his name and his role on it ("Meesho Mall case
  study — Uttham Udatthu, product designer"); a tool is its name and kind ("Realistic
  prototype for user research — Uttham Udatthu"). The terms live in `caseSearch`
  and `toolSearch` in `src/lib/seo.ts`. **Every role term must be one he holds
  and the site shows**: design lead (the hero, the pod of five), Product
  Designer (the CV he links: Lead Product Designer at Meesho; Senior Product
  Designer on Mall). **"Design manager" is not his title, so nothing claims
  it**; it can only come from visible copy he writes. No meta keywords (Google
  ignores them), no hidden text.
- **The JSON-LD describes one person and his work.** Home carries a
  `ProfilePage` whose main entity is the `Person`: given and family name, the
  handles' order (`Udatthu Uttham`) as `alternateName`, `jobTitle` Design Lead,
  `hasOccupation` (Design Lead; Product Designer, alternately Lead Product
  Designer as the CV has it), `worksFor` Meesho (meesho.com, its Wikipedia
  page), `knowsAbout` only what the site shows him doing, `alumniOf` from the CV,
  LinkedIn and GitHub in `sameAs`. The `WebSite` gives `uttham.fyi` as its
  alternate name. **A case page is an `Article` about its subject and Meesho**,
  with keywords from its topic and the study's scope, and **his role on that
  work rides on the Article, never the Person**: its `creator` is a schema.org
  `Role` around him, named from the page's Role fact, dated from its Timeline
  when that is a span of years (Mall: Senior Product Designer, 2022–2023).
  **The Person carries no dated titles**, because the Mall role overlaps the
  CV's Lead Product Designer since April 2022, and two titles at one employer
  for one period read as a contradiction (which title held in 2022–2023 is
  Uttham's to confirm). `author` stays the plain Person, which is what Google
  reads. A tool page is a `CreativeWork` about its subject; each has a
  two-step `BreadcrumbList`. validator.schema.org reported no errors and no
  warnings on all five pages (2026-10-03).
- **What will and won't rank, honestly** (searched 2026-10-03, before the site
  was indexed): **his full name and "Udatthu" are winnable within weeks of
  indexing** — today only a ZoomInfo listing and dictionary pages answer them.
  **"Meesho Mall case study" and "Meesho product card case study" are
  winnable**: the first returns news coverage and students' concept redesigns,
  the second only Meesho's own card-holder listings, and no first-hand
  designer's case study ranks for either. "Product designer Meesho" and "design
  lead Meesho" are Meesho's own job ads and job boards; he can appear beside
  them, not above them. **Bare "Uttham" is unreliable**: engines fold it into
  "Uttam" (Uttam Kumar and other Wikipedia pages) and the Sanskrit word; the
  domain helps, but expect months, not weeks. **Generic "product designer",
  "design manager" and "product designer Bangalore portfolio" will not rank**:
  Coursera, Glassdoor, job boards and portfolio directories own them, and the
  site names no city. The biggest lever left is visible text, which is his to
  write: a short line carrying his name, role and Meesho (options proposed
  2026-10-03, not applied).
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
**Strategy runs in two blocks** (Uttham, 2026-10-03: "the other 2 things in remove
what"; "bring the last two things here"): "Remove what slows them down" holds the
Card framework (we optimised and grouped the information: multiple prices and
offers, consideration tags; the detailed study is in the full case study) and
**Seller titles** (they weren't adding value, so they were replaced; what took
their place comes under "Add what helps them decide"), and "Add what helps them
decide" holds the staggered feed, list or grid by category, swipeable images and
the delivery date, in that order. Block 2 has no row on the facts that replaced
the titles yet: he said he will talk about that under value additions.

**The hero runs end to end; the two columns start under it** (Uttham,
2026-10-03: "the title section from glance to decsion can be end to end of
viewport. along with tole and timeline(do this change for all teaser pages)").
On all four CaseTeaser pages the back link, the title, the dek and the facts
span the page's grid lines (the container, the edges the header stands on), and
the reading column and the sticky phone begin below them, so the card can never
reach the hero. **The title takes the whole width** (balanced); **the dek keeps
the reading column's measure** (it ends where the reading column ends), so a
long AI-page dek still reads; **the facts are one row between dashed rules
drawn line to line**, each its label over its value, the ones before the last
at their own width from the left line and **the last standing exactly over the
phone's columns** (Timeline, or Year on the tool pages), from 768px. A long
fact (over 60 characters: Value added) takes what the row leaves and wraps; on
the 8-column tablet grid it drops under the short ones at the full width,
because beside Tool it ran to seven lines. Phones keep the stacked label |
value rows.

**The phone stays to the very end, centred** (Uttham, 2026-10-03: "now the out
come section also should scroll and the phone should be sticky to the right for
both the case studies"; "so the phone preview always stays and is center
aligned"). It used to scroll away under Outcome, because the page ended a whole
`--section-y` plus "More cases" below the reading's last card, more than the
room under the centred card. Now **"More cases" / "More tools" is the reading
column's last item, and the page ends exactly the room the centred card has
under it** (a `--content-gap` plus half the sticky box's spare height,
`--ct-give`) below it: through Outcome, the gate card or the full study and the
way on, the card never leaves its place, and at the last pixel its foot is level
with the last row (measured 2026-10-03 on all four pages at 1440×900, 1280×720,
1024×768 and 768×1024: 0–0.2px apart, the same room above and below the card).
On a tablet in portrait that room is ~200–230px of empty page under the last
row, the price of a centred card. The card's height comes from a
ResizeObserver (`--ct-card-h`, the small script after the main one), not a
formula: the old one, on the panel, resolved its width against the viewport and
gave back 88px of a 768×1024 tablet's 214. Without the script it falls back to
the tallest card, which is a laptop's.

**Meesho Mall is the same teaser**, from `src/data/mall-case.ts`, reworked on
2026-10-02 from his notes: Role Senior Product Designer, 2022–2023; where it
started (competitive, better-quality alternatives for shoppers who seek quality,
and a quiet hint that the first launch found the go-to-market); v2 as the bold
version that followed; the research before the v3 launch, with its sticky note;
v3; what happened. (Since the 2026-10-05 storyline the chapters are Where it
started, When bold wasn't enough, Before v3: what shoppers told us, v3: sell
brands, not Mall — its groups Decide what Mall is, Make it noticeable, Be
understood where decisions happen and **Differentiated experience** (Uttham,
2026-10-05: the order confirmation's delight comes after the decision, so it
has a group of its own, where his other such changes will join it in the full
study) — and What happened, and each quote is a row of cards, one per insight;
see "Case teasers tell a story" below.) **v3 shows one landing page** (2026-10-03: "just one landing
page (remove the second landing page section, we will not talk about it in
preview)"): the row for returning shoppers, its alt, card title and clip are out
of `mall-case.ts`, and its files stay, unused (see the `mall-case` README); and
the sub-group once called "Be found" is **"Make it noticeable"** ("rename the be
found terminology across to something like making it noticeable"). **Its full case study is behind the same gate**, built from
his own deck chapters (git `09893d8^`): no colleague names, no team-lead claims,
no numbers. **Uttham supplies every case-page screen** (2026-10-02: "the existing
screens you have put are all bad for projects remove them and ask me I will give
all of them"): they go in `src/assets/plp/` and `src/assets/mall-case/`, named by
state, listed with their card titles in `screens.titles`; until one exists the
phone borrows the previous screen, and with none at all the build shows "Screen
coming soon" — **unless the borrowed screen would be the wrong evidence and one
of his exports is the right one**, which `screens.map` then names (2026-10-04
audit, "I want you to judge whether we are showing right infor and images": the
product cards' Cash price shows `before`, whose cards carry the cash price in its
own row, under its own title, instead of the swipe clip; Bigger images for
fashion came out of the study on 2026-10-04, "remove this"). `src/assets/mall/` is the Mall
deck's own exports, kept only for the homepage tile.

**The teaser pages run on the homepage spacing ladder, stepped up for reading**
(Uttham: "make sure there is lot of spacing … it should match that system"):
`--section-y` between sections (the bus-discovery reference's 160px), `--ct-head`
(32) from a heading to its text, `--ct-sub` (48–64) to a sub-group and above its
heading, `--ct-para` (24) between paragraphs, rows padded `--space-6` — one rung
up on 2026-10-02 ("the texts are closely placed making it too textual").
**A block of rows or steps is one region** (Uttham, 2026-10-03: "the divider at
the end of the last item?? the sectioning and association is not clear, lets
make them more obvious and clear"): the rows share one faint band of the sheet
stock (`--ct-block-bg`, `--paper-1` at 55% on the board, `--radius-sm`, inset
`--card-padding` at the sides, no border or shadow), and **the dashed rule runs
only between rows — never above the first or under the last**, where it read as
a divider closing the block against the next heading. **Two levels only**: the
section stays open paper and the band is the one region inside it (the gate and
prompt cards and the sticky note are their own objects, never nested in it).
**The sub-group heading sits outside its band, one `--ct-tie` (16) over it** —
a third or less of the `--ct-sub` above the heading — and its lead line a
`--space-2` under the heading, `--ct-tie` over the band. **Three levels of
type**: section heading `--text-h3`, sub-group heading `--text-body-lg` (≥1.5×
apart at every width; at `--text-h4` they were 1.3× and read as one level),
then the rows' own 16–17px labels inside the band. The row being read keeps its
amber bar, now on the band's left edge; the slideshow and hover hold are
unchanged. **Each
block of rows or steps plays as a slideshow** (2026-10-02: "the preview runs
these 4 slideshows, accordingly the highlight changes in the left … in all the
blocks"): once the reading reaches a block showing two or more different
screens, the phone runs through them a beat (2.6s) each and the row it shows
takes the highlight; hovering a row holds it, and **a pointer resting on a
point's text or on the preview stops the animation** (2026-10-03: "on hover of
a point text or the preview stop the animation"): no beat moves on, a pan or a
clip pauses where it is, and it all carries on when the pointer leaves; reduced motion keeps the
scroll-driven pick, row by row inside a block too, and hover holds nothing
there. **A row with several screens plays them in turn**
(`screens.map` to a list — the Mall tab: its modal, then its PiP), the card's
title following the file shown; with reduced motion **the reading shares the
row out among them** — the reading line passing from the row's top to its foot
shows each in turn — so no screen he supplied is out of reach. **A beat never takes
a screen away before it has finished** — a page pans its round trip, a clip
plays and holds 1.2s — and **rows that share a screen hand it on as it is**,
with no new fade, pan or replay (a row that borrows a list of screens carries
on from the one showing). The table is in `docs/design-tokens.md`; never drop these pages back
to `--section-y-sm`. **Every teaser page navigates by a rail of scroll points,
each title a tooltip** (Uttham, 2026-10-02: "the sticky notes as scroll points in
l2 is weird lets do the one you initially made but the active or hover state show
these as tooltips" — this retires the 2026-10-01 book-style bookmarks). A tick
per section and per sub-group heading, fixed and vertically centred in the right
gutter (a sub-group's tick shorter, the one being read longer and in
`--ink-900`), the full study and its blocks joining once it is open; a click
jumps. **Only one title shows at a time, as a small paper tooltip left of its
tick**: the current tick's, or the hovered or keyboard-focused one's instead.
It fades, never slides. **A tooltip names its tick in a few words** (2026-10-03:
"please truncate these"): the heading's lead-in before its colon ("Before v3: what
shoppers told us" → "Before v3"; the page title → "From doubt to desire"), the
whole heading when it has none; the link's accessible name keeps the full
heading. **A tooltip never covers the card** (2026-10-03: the current tick's lay
~49px over the phone at 1280×720): the script measures the gutter between the
card's right edge and the rail (`--pt-room`), and a tooltip is never wider than
what that leaves left of its tick, less a `--space-2` of air. A title that misses
by a `--space-1` or less borrows that much of the air (`--pt-give`) rather than
lose its last letters; a longer one ends in an ellipsis; and where the gutter
cannot hold `--space-8` of a cut title the tooltip stays off (`data-tip-off`).
**A cut or hidden title is still named on hover** by the link's own `title` (the
browser's tooltip), and the tick, its length and its accessible name (the whole
heading) still say where the reader is. Measured 2026-10-03 on all four
CaseTeaser pages (the two cases and both AI Space pages): no tooltip touches the
card at any width from 768px up; at 1440 the longest titles keep ~117px, at 1280
~90px (on the product cards, whose device is Mall's size since 2026-10-04,
Problem, Strategy and Outcome stand whole 102–107px clear of the device at
1440×900 and 71–77px at 1280×720, and the page title is cut with its ellipsis
8px clear), and **below ~1200px the centred card leaves the gutter too narrow for a
word** (58px at 1024, 24px at 768), so only the ticks show there — on hover the
browser's tooltip, on keyboard focus only the ring and the accessible name.
Left-aligning the card in its columns at 900–1199px would hand the gutter its
spare width (~26px at 1024, still short of most titles), and a tablet has none
to give; how to make room is Uttham's call. The
rail is ≥768px only, since on phones the mini player
owns the right edge. **A page can limit its rail** (`rail` on the page's data;
2026-10-02: "the scroll stepper should also have limited things, outcome,
strategy, problem, title"): the product cards keep only the top of the page (its
title), Problem, Strategy and Outcome — no sub-group ticks, no full-study ticks.

**Progressive reading: only the part the phone shows is in full ink** (Uttham,
2026-10-03: "can we do progressive loading of teaser pages, before the image on
the right updates sometimeas content comes, ex v2 and v3 both content exsited in
a viewport and then the screen is only showing v2, this is leading to
confusion"). The reading is cut into **parts**: a section that carries a state
(all of it); a block of rows or steps with its h3 and lead (one part, so a
playing slideshow lights the whole block and the row on show keeps its amber
bar); a section's **intro** — its h2 and the text before its first block —
which **comes up with that block's first screen, held still** until the block
itself is reached; and a section with no state anywhere (the product cards'
Problem, every section of the prototype page), which keeps the nearest earlier
screen and comes up by its place. **The text and the phone change on one
trigger: a part's heading crossing the reading line, 40% down the screen — the
rail's own line**, so rail, text and phone move together. **Parts not yet
reached step back to `--ct-dim-ahead` (0.45), parts read to `--ct-dim-read`
(0.6)**: opacity only, nothing hidden or moved, headings still ~3 : 1 ahead and
~4.5 : 1 read on the board; read text is muted too, because two parts in one
screen must never both be in full ink. A section's h2 stays in ink while any
part of its section is shown; the amber bar shows only in the shown part;
whatever has the focus is in ink; the hero and facts are never dimmed; no
script, no dimming. A part comes up on `--dur-4` `--ease-enter` (a screen's
arrival) and steps back on `--dur-3`; reduced motion, at once; the first
lighting on load does not fade. **Why the line moved**: the old band picked the
trigger whose centre was nearest the middle tenth of the screen, so a section
with a state switched as its heading entered at 55% while one whose first
trigger sat under an intro switched only when that row reached the middle — on
Mall at 1440×900, "v3: sell brands, not Mall" had risen to 30% of the screen
before the phone left v2. Measured 2026-10-03, Mall at 1440×900 and 1280×720,
the product cards and both AI pages at 1440×900, 768×1024 and 375×812 (mini
player): at every switch the heading coming into ink stood at 34–40% of the
screen (the spread is the test pane's sparse frames, not the line) and the
phone was showing that part's state. A clip's screen can still trail its text by its
cue (a frame or two preloaded, 1.5s at most), as before.

**The teaser pages settle into a part** (Uttham, 2026-10-03: "and some
magnetic scroll to these also shuold be implemented", then "improve magnetic
scroll strength on home page, and bring it on l2 pages as well"). `section-snap.js`
takes the page's resting places from `provideRestingPlaces()` — each part's
heading on the reading line, a pixel past it — and a wheel gesture that rests
**within 22% of a screen short of one** eases on to it (0.6s, a damped curve
with no bounce), so the reader never stops with the next heading just under
the line and the phone still on the last screen; a gesture down the page that
**overshoots the part just entered by up to 10% of a screen settles back onto
it**, the heading on the line. The pull back can only ever reach the nearest
place behind the rest — the one the reader has just crossed — so the phone keeps
the screen they scrolled to and never flips back to the one before; **scrolling
up there is no pull back** (a rest just short of a landing has left that part,
and settling onto it would flip the phone to the screen just left); and, as on
the homepage, **never back past where the gesture began**, so a notch away from
a part is never undone. **Neither reach covers more than 35% of the gap** between
a place and its neighbour (two parts can stand 180px apart: an intro and its
first block), so at least 30% of every gap is free to stop in and a long
section's body never pulls. Until the second note it was forward only and 12%,
on 0.8s. Touch, keys, rail and nav jumps, reduced motion, an open dialog (the
enlarged screen), the live phone enlarged on a phone and a focused field (the
password) never snap.

**The phone stands on the page, centred in its columns** (Uttham, 2026-10-03:
"Remove the glass behind the phone preview across"; "so the phone preview always
stays and is center aligned horizontally"). From 768px the device is as tall as
the screen allows (`--ct-pane-h`, ≤`--ct-pane-max` 720px, less one
`--card-padding` of air above and below and the title's slot) or as wide as its
columns allow, and **nothing stands behind it** — no glass, no bolts, no card
background, border or shadow. `.ct-pane` is only the box holding the title and
the device, the device's width, **centred in its columns on every page**, notes
or not (the notes stand outside it, on its left; see "His boards become phone
screens" below). **The phone block is centred in the visible height under the
header** while it sticks: `.ct-pane` is the sticky element, its top inset the
header, a `--content-gap` and half of what the block leaves of `100dvh` (so a
tablet browser's sliding address bar never piles the spare height under it;
2026-10-02: "less spacing on top than bottom"), and `.ct-panel` runs the whole
height of the reading as its container (`pointer-events: none`, so only the
block itself is "the preview" for the hover hold). **The block carries a title above the phone** naming what it
shows (`screens.titles`, one short line per state; a state that borrows an
earlier screen borrows its title): **one line in a slot of its own height**
(`--text-body-lg` × `--lh-statement`), weight 600 in `--ink-900`, one `--space-4`
over the device; a long title ends in an ellipsis and keeps its whole text as
the element's title. It is centred, not set left: the handset is symmetrical and
its top corners are deeply rounded, so a title on the device's left edge hangs
past the curve and reads off-centre. The mini player on phones has none. **A
screen's alt and title are its file's own entry first**, then the first state
showing it that has one, so a row that borrows another state's file can never
blank them (Mall's v3-labels did, 2026-10-03); the build warns on a screen with
no alt.

**The screens stand in a realistic handset of one constant size** (Uttham,
2026-10-03: "can you create a realisitic phone mock that renders this a,so the
title and spacings of this card can be optimised"; "all the aspect ratio should
be fixed for this card, and the content inside … everything should have constant
height and width for the l2 preview page"; "fixed phone size I meant").
`CaseDevice.astro` draws it in CSS, no images and no brand marks, as **an
Android handset of the Pixel / OnePlus kind** (2026-10-03: "instead of iphone
lets use oneplus or pixel phone"): a graphite body with an even bezel, an
Android status bar (the clock at the left, a punch-hole camera in the middle,
Wi-Fi, signal and battery at the right) **above** the screenshot and a
gesture-bar strip **below** it, both inside the bezel and never over the
export's own top row (the exports carry no status bar of their own), and the
power key and volume rocker both on the right edge. **It stands on the page
itself** (2026-10-03: "Remove the glass behind the phone preview across"; this
retires the same day's glass card and its four bolts, and with them the
bolt-sized inset), and
**its title above the device is handwritten** — Caveat in ink at 1.35 ×
`--text-body-lg`, weight 700 (2026-10-04: "use handwritten title format for
headings above the phone"; it was General Sans 600 from "the title on the can
be more bigger"). Every length is a share of the
display's width, `--ct-device-screen` (`--ct-device-k-*`: bezel 0.03, status bar
0.12, home strip 0.10, display corner 0.10); the body's corner is exactly the
display's plus the bezel, depth is the paper's own layered shadows, and the
display has a 1px `oklch(0 0 0 / 0.1)` edge; each side key is the band's width
plus at least a pixel, so it stands proud even in the 112px mini player. **The
status bar and home strip take the colour of the screen edge they meet**, read
from each export at build time (`src/lib/screen-edges.ts`, rules in
`src/lib/edge-colour.ts`), so strip and screenshot read as one display. **A clip's
strips follow its frames from a timeline read once, frame by frame, with the same
rule** (`npm run clip-edges` → `src/data/clip-edges.json`; macOS, it decodes with
AVFoundation; run it after adding or replacing a clip, or the clip keeps its
still's colours and the build says so) — **never from a `<canvas>` in the
browser**, which hands Chromium's BT.709 video over darker than a Mac shows it:
sampled live, the splash's strips read #6524fd against the #7028fc on screen for
the whole clip (2026-10-03). On a platform that shows the clips darker than a
Mac does, a clip and its own still differ by that shade; the strips follow the
still. **On a given
viewport the device and its 1 : 2 display never change size**: the display's
width is the columns (less a `--space-1` each side for the keys) or the block's
tallest height over the handset's proportions, whichever binds, set once per
viewport — **never the notes**: a page with notes takes exactly the device a page
without them does (2026-10-04, "do whatever is correct"; this retires the
device up to a tenth smaller that made the notes' room) — and no state, beat,
clip, board or title enters the sum, so a short screen shrinks the device once,
never per state. Measured 2026-10-04 at 1920×1080 / 1600×900 / 1440×900 /
1366×768 / 1280×720 / 1024×768 / 768×1024: display 268.4 / 268.4 / 269 / 237.8 /
219.1 / 248.3 / 224.1px wide on **both** case pages, equal to the tenth of a
pixel (Resona, with no title slot, was 288 at 1440×900 on 2026-10-03), the device
centred in its columns to the pixel, the same gap above the title as under the
device while it sticks, and in the 112px mini player at 375×812; one size
through every state and beat sampled.

**Nothing on the phone is ever cropped or stretched** (Uttham, 2026-10-03: "when
I give big images I dont want you to just paste them or crop them abruptly making
its content gone (this is for all images you are using)"). **A 1 : 2 screen
fills the display to the pixel** (1080×2160, 1440×2880, 360×720, the 1088×2176
clips, the splash and its 720×1440 clip); **a shorter one fits its width on its
own top and bottom edge colours**, centred — **unless one edge is patterned and
the other flat: then it stands against the patterned edge and all the fill falls
on the flat one**, where it is the screen's own colour (the 9 : 16 order
confirmation's top is a field of stars over a flat purple foot, so it stands at
the top: centred, the stars stopped in a hard line ~30px under the status bar,
on a flat band that read as a picture laid on purple; flat means one colour
covers ≥90% of the edge, `anchorFor`; 2026-10-03, review of the handset —
**his brief said "centre vertically", so this is Uttham's to confirm**); **a page capture taller
than 1 : 2 stands at the display's width and pans**: a hold at the top, an eased
glide to its foot, a hold, and back, looping while it is shown; with reduced
motion it does not move but scrolls by hand, **its "Scroll ↓" chip in the home
strip**, never on the screenshot, until the foot is in view. (The splash looked
"weird" in the old frameless 1 : 2 card because it opens on an all-white screen
with only its logo: with no status bar, home strip or bezel it read as an empty
white slab, not a phone. It is 1 : 2 to the pixel in the handset.) **A reference
board** (width ÷ height above 0.62) dropped in as it came **stands in the
device's place** — a mechanism no page uses today, kept for a future board; the
product cards' four boards are composed into phone screens instead (next
paragraph): whole, on
the card's paper, never wider or taller than the device, **starting where the
device's top edge stands, one `--space-3` under the title, its "Click to enlarge"
chip under it ("Tap" on touch) and the spare paper below** (centred in the
footprint, a wide board floated 117–235px from the title naming it); the whole
footprint opens it in the dialog, and the card keeps its size (this retires the
2026-10-03 card that widened to its column for a board). **A board, or the device
coming back after one, arrives only once what it replaces has faded**
(`--dur-2`), so a chip never stands over the incoming screen or board. **An empty phone** — a state with no screen
and nothing earlier to borrow, Mall's v1-tag until he supplies it — shows one
quiet line in the middle of its white display, "Screen coming soon" in the build
and the state's name on the dev server, fading in only once the last screen has
faded out, and at its own scale in the mini player; a state that borrows a screen
only logs `[case] No screen yet` to the console. **A
file with a clip (`screens.videos`) plays it once from its first frame each
time its screen arrives, then settles on its still** (the poster, optimised
like any screen — for the order confirmation, whose clip ends mid-transition,
the confirmed frame); clips load only as their rows near the reading, wait
while the phone cannot be seen, and with reduced motion never play. **A clip
never opens on its still**, which is its ending: its screen arrives only once
the clip's first frame is ready, the screen before (and its title) staying up
until then — a frame or two when preloaded, 1.5s at most on a slow line, past
which the still stands in and the clip plays on its next arrival. (The Mall landing's composed clip came off with its row on 2026-10-03 and was
deleted on 2026-10-04, "if it is not used delete it"; git history keeps it and
its script.) **The product cards' swipeable-images clip is composed** (Uttham, 2026-10-03: "Swipeable images in the prototype please mock by
moving images, it only there on one card, I want to move it for other 1 or 2
products atleast . find similar images from the product repo"):
`scripts/plp-swipe-clip.mjs` builds `public/media/plp/swipe.mp4` and its
poster `src/assets/plp/swipe.png` from his `scroll.png` — a 1 : 2 window that
pans gently down the capture and back, in which **three cards swipe their
picture one at a time and back** (a critically damped spring, no bounce; the
dot for the page on show darkens, moves and fades back): his yellow kurti to a
red one, a kurti in another colour, and two catalogue kurtis to their own back
views. **Its feed is eight different kurtis, not his one yellow kurti eight
times** (2026-10-04; see "His boards become phone screens" below): six cards'
picture boxes carry the prototype's catalogue kurtis, everything else in the
capture is his pixels, and **the first and last frames are the same**, so the
poster opens and closes it (`src/assets/plp/README.md` has the row). A new
or replaced clip needs `npm run clip-edges` on macOS so the
handset's strips follow its frames. The mini
player is the same handset at 112px, by the same fit rules — except that with
reduced motion a page capture stands whole in its display (at its height, on its
edge colours), since no "Scroll ↓" chip reads at that size and a tap opens it in
the dialog to scroll. **Its full-size
dialog is never wider than the card's phone, only taller** (Uttham, 2026-10-03:
"for some contents outside l2 you can increase the phone size but not the width,
it should look relaistic wherever it can"): one width for every screen, the
column's largest display (`--ct-device-screen-max`, ~268px) or what the page
allows; a page capture gets a handset's 19.5 : 9 display there and scrolls by
hand (by wheel and trackpad too: the dialog is outside the smooth scroll,
`data-lenis-prevent`, and the page behind it is locked), its chip in the home
strip; a clip plays from its first frame; a board opens whole on a paper card.
**No close control ever sits over the device** (or the board's card): the
dialog's × stands in a row of its own above it, right-aligned, a `--space-2`
clear, its height taken out of the device's budget (`--ct-zoom-close`), and the
mini player's × stands the same `--space-2` above the handset (2026-10-03, review:
on the corner they hid the battery and broke the body's outline). **At the end of the reading the device's foot lands level with the last card on
the left** (Uttham, 2026-10-03: "these two should be aligned at bottom before
both start scrolling down"): the sticky block's margin gives back the air under
the device (`margin-bottom: -card-padding`), and it sticks until its margin box
meets the panel's foot, which is the reading's foot. (It had been the panel that
stuck, with a negative margin of half its spare height; that margin cannot read
the columns' width — a cqw on the panel names an outer container, and Chrome
places a sticky box with a `%` margin resolved against the whole grid — so
wherever the columns set the device's size, a tablet or a page whose notes take
room, the foot missed: 23px on the product cards at 1440×900 in a first try.)
Measured 2026-10-03: 0px at 1440×900 on the product cards and Resona, and at
768×1024 on Mall. **The page then ends exactly the room the centred block has
under it** (a `--content-gap`, half the spare height, `--ct-give` from the
block's measured height `--ct-card-h`, and the block's air under the device), so
the phone never leaves its place, through Outcome, the gate card or the full
study and "More cases" to the very end. **The live phone on the AI Space pages stands in the same
handset** (Uttham, 2026-10-03: "in ai cards the phone preview is missing add
that", "I meant in teaser pages"): the running tool fills the display's 1 : 2
row, so the prototype is handed a 360 × 720 viewport (it had 360 × 780 in the
old 9 : 19.5 frame) and lays out with its app bar under the status bar and its
bottom bar over the gesture strip; Resona gets 320 × 640, still follows the
reading, and its status bar takes its app bar's pink wash. The iframe is built
once in the handset and never moved, so growing the mini player in place on a
phone (the same handset at a phone's own size, its display at most 360px wide,
the × row above it) never reloads it.

**His boards become phone screens, and their words become notes** (Uttham,
2026-10-03: "in meesho product cards images, I gave the whole dump I want you to
show the final version only, that is relevant for it, when I gave 4 product
cards I want you to place thme in a mbile grid and explain not use as it is,
similarly for framework the framework card should comeinside the image, and the
wordings outside as you did on home page, please make it cohesive and clean and
amazing, dont just throw all the things as I gave"). On the product cards the
four reference boards (`src/assets/plp/boards/`) are never shown raw:
`scripts/plp-compose.mjs` (`npm run plp-compose`) builds 1080 × 2160 screens
from his own pixels, and the page shows those. **The final version only**: the
list view without its grid control or variant labels; the winning date card
(Fast and its day count) in the new feed, in place of the same kurti's card,
among cards with no date. **Cards in a mobile grid**: the four title variants
as the feed's own 2 × 2, at its column width, each at its own height, the feed
carrying on below them. **The framework card inside the phone**, large on the
feed with no search bar or filter row (2026-10-03: "remove the search and
filter bar"), centred in the screen, its dashed zone boxes and labels gone (only
the dash pixels are cleared; the timer pill's foot, hidden under one, is
restored from its own top edge, mirrored). The title and date screens take
`after.png`'s search bar and filter row as their chrome; the list has its own.
Lanczos, never sharpened; the effective upscale on the page is ×1.5 for the
title, date and list screens (the boards are 1× renders) and none for the
framework card. **No composed screen repeats one product photo** (Uttham,
2026-10-04: "In the first project teaser, the images are repititive can we use
other images to make the image output realistic take it from prototype
porject"): where a board or his Kurti capture shows one yellow kurti on card
after card, those cards' picture boxes take other kurtis from the realistic
prototype's own catalogue — public catalogue photos its bundle already
references, listed with their crops in `scripts/plp-photos.mjs` and fetched
once into `.clip-work/` (untracked). In the title grid the seller's-title card
keeps his yellow kurti and the one- and two-fact cards show a teal and a grey
kurti; in the swipe clip's feed six of eight cards change. **Only the picture
box changes** — his words, chips, prices, ratings, edges, hearts and dots stay
his — and **a card takes only a photo its words are true of** (every chip on
these cards reads "Kurti" or "Cotton"). The list view keeps his i12 in row 1
and takes three other wireless earbuds from meesho.com's own listings for rows
2–4 (2026-10-04, "go to meesho.com and take images from there"), and **each row
carries its own realistic prices** (2026-10-05: "can you randomise the price
values realistic ones, for both UPI and cash prices"): price, struck MRP, a
discount worked out from the two, and a cash price a little above the UPI one,
painted in Mier B02 at the board's sizes and colours before the upscale (the
plp README has the figures; without the font installed the script leaves
`list.png` alone). The date screen and the framework card had no
repeats and are unchanged. **The words outside, as on the homepage**: handwritten notes
(`screens.notes` in `src/data/plp-case.ts`, per screen file, `y` a share of
that screen's height, priority order, no numbers), the tiles' Caveat in ink
straight on the page **left of the device** — every one of these screens sets
its content against its left edge, and that side faces the reading. **Each
note's line starts inside the screen, on the thing it names** (Uttham,
2026-10-03: "the pointers should have the origins from inside so it is easy to
understand what point we are highlighting"): a dot at (`x`, `y`), shares of the
display's width and height, on the element or in the card's margin just left of
it, and a thin ink line on a paper halo from the dot out across the bezel to the
words. **Every dot is read off the export's own pixels** (2026-10-03: "In card
framework the arrows and the dots are not matching please fix them"): on a big
element's left end, clear of its text (the framework's picture, chips and
rating), or touching a line of text or a mark from the card's margin (the price,
the FAST mark, a title). The mismatch was the CSS, not only the numbers: the
notes' box is a container, and the dot's `x` × `--ct-device-screen` re-read the
display's width against that box (its `100cqw`), so every dot sat at about a
quarter of its `x` — 22–43px left of its element, outside the product card, at
1440×900. The notes now read the display's width as a registered length,
`--ct-annot-screen`, set on `.ct-pane`; measured after: every dot at its (`x`,
`y`) to 0.0001 of the screen, every line ending on its dot and starting 5px
right of its words. **The words stand at `ty`** (default `y`), spread down the column so
close zones still get generous room between their notes ("I want the spacing to
be generous here"); the line takes its length and angle from `hypot()` and
`atan2()`. Never words over the screen, never between the device and its title.
The framework's notes are his labels word for word (Product comprehension,
Comprehension, Price, Quality, Fast programme); the others are DRAFT wording,
his to set. **The notes never move or shrink the phone** (Uttham, 2026-10-03:
"so the phone preview always stays and is center aligned horizontally"; "fixed
phone size I meant"; 2026-10-04, "do whatever is correct"): the device is
centred in its columns at the size it has on Mall, and the notes take the room
it leaves on its left **and reach on into the grid gutter, to one `--space-4`
short of the reading column's right edge** (`--ct-annot-reach`, the gutter less
`--space-4`) — the rows' bands run that column's full width, so that edge is
where the reading ends, and no note ever stands over it. (This retires the
2026-10-03 device up to a tenth smaller that made their room, and before it the
notes column that stood the card at its columns' left edge.) That room is one
size per viewport, so no state changes it. **The notes' type gives way before
the phone does**: a share of the display's width (`--ct-annot-k`, 0.072), made
smaller where the room holds less than the longest word beside its line
(`--ct-annot-need`, 6.6em), never under `--ct-annot-floor` (14px); where even
that does not fit, the notes are off (a container query on the box at 6.5em).
Measured 2026-10-04 on the product cards: the notes show at 1920×1080, 1600×900
and 1440×900 (17.7px type, the box 117px), 1366×768 (17.1px) and 1280×720
(15.8px), and down to about 1200px wide on a laptop (14.4px at 1200×800);
1024×768 (a 66px box) and tablets drop them. At every size the box stands
exactly 16px clear of the reading's bands and the nearest letter 18–31px; every
dot at its (`x`, `y`) to 0.01px and every line ending on its dot, so the
framework's five dots still sit on the picture, the first chip's left end, the
price's ₹, the rating pill's left end and the FAST mark. A screen's notes fade
with it; the mini player and the dialog show none.

**The phone preview stands on the page, with nothing behind it** (Uttham,
2026-10-03: "Remove the glass behind the phone preview across"), on every teaser
page and in the mini player; the handset is the object. This retires the glass
card of earlier the same day ("for phone preview use glass background") and the
paper card of 2026-10-01 — never put a pane, card or bolts back behind it. The AI
prompt panel stays on the paper card (`--paper-1`, `--line-1`, `--radius-sm`,
`--shadow-rest`, `--card-padding`), the prompt in the sheet's recessed well
(`--paper-2`).

**The AI Space tool pages are one-pagers, not teasers** (Uttham, 2026-10-02:
"for AI space cards, there is no need to have teaser, just a one pager only" —
he then chose to keep the layout and drop the word). Everything is on the page,
nothing is gated, and the page is about **explaining his work** ("just this page
is all about explaining my work"). They borrow the case studies' layout
(2026-10-01: "the right side is running preview as we did for the project case
studies"): `/ai/<slug>` renders `CaseTeaser` in live mode with `frame="phone"`: **the left column is
the white-label guide and the sticky phone runs the tool itself**, in the
case pages' handset (the tool fills its display). Left, in order (2026-10-02): the page's headline and summary as the hero
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
state. **It is used there and only there** (Uttham, 2026-10-03: "dont give link
of real prototye let the prototype be interactable there only, and give callout
on top that it is interactable"): nothing on the page links out to
`/proto/feed-ux` (`tool.visit` is only the preview's source; `ai-pages.ts` no
longer passes it as the page's `visit`), and **a callout over the handset says
it can be used** — `callout` in `tools.ts`, a small paper chip in the title's
slot with an amber touch mark, "Try it — tap and scroll" (a label, his to
reword), never over the screen and not in the mini player. Measured 2026-10-03:
a tap on a card opens its product page inside the phone and the wheel scrolls
the app, not the page. On phones
a live phone opens full size *in place* on a tap (moving an iframe into the
dialog would reload it), centred under the header over a dimmed page; × or the
page shrinks it, a second × hides it. A page whose last part (or, for reduced
motion's row-by-row pick, its last row) cannot scroll up to the reading line
lets the line slide down over the last half screen, so they still drive the
phone; a page where everything reaches the line never takes that path.

**Every tool page ends on "More tools", as a case page ends on "More cases"**
(Uttham, 2026-10-03: "and similar to projects at the end give entry points for
next ones in ai prototype also"), **a small section in the reading column with
a chevron per row** ("the more case section can be just a small section with
chevron and takes the column width of the content it should not flow into the
column of the phone preview, so the phone preview always stays"): one
`--section-y` under the last section, the label a `--ct-tie` over the rows,
which stand on open paper **between dashed rules — one over the first row and
one under each, the column's width** (Uttham, 2026-10-05: "give this the dotted
line effect not the card effect", on every page with the list; until then it
stood on the faint band, which the blocks of rows inside a page keep), each row
its title, its line and a chevron that nudges on hover; it never reaches the phone's columns, and the sticky card stands beside
it to the end. **It is the same component, `CaseIndex` with `compact`**, passed
in CaseTeaser's `more` slot (`end` keeps the old full-width ruled index for a
case page without the teaser layout): cases pass their studies, tools pass rows
built from `tools.ts` only — the name and the card's line (`what`), nothing
written for it; every other tool with a page, in the homepage's card order,
linking to `/ai/<slug>`. The label names what the rows are, as "More cases"
does, and the homepage section calls them tools ("Tools I build so the team
moves faster."). On phones the page's end marker leads the block, so the mini
player steps away as it arrives. On Resona **its last part, What you get,
reaches the reading line without help**; its last row stops ~85px under the
line at 1440×900 (re-measured 2026-10-03 against the 40% line, with the block
in the column), so the line still slides over the block for reduced motion's
row-by-row pick; the block itself holds no trigger, so the phone never changes
as it scrolls in.

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

## Case teasers tell a story, and a story change is previewed first

**Both case teasers run as a storyline, not a list of action items** (Uttham,
2026-10-04: "the teaser today just looks like action items we did, there is no
l2 reasons or no drama or storyline"; approved 2026-10-05: "Now make these
changes and update the git and website"). The product cards: two jobs →
too full and too empty → make room, then spend it → enough to say yes. Mall:
from doubt to desire — the quiet tag that did not explain Mall, bold that was
not enough, homes, v3, trusted. **Each row is his line, then at most one
reason, labelled "Why this design:"** (a row's `why`); **a quote with several
insights is one card per insight** (`kind: 'quotes'`, 2026-10-05: "when you
have multiple insights create multple cards"); **a sentence moved up from the
full study leaves it** (move, don't copy), and his corrections flow into the
full study wherever it said the same thing. The Mall research finding is his:
**few recognised Mall without nudges, and those who did took it for a nearby
mall** — never "the name already worked". **v3's badge is "A purple badge people can trust and notice"**, so the
Lucknow card's "Purple colour means Mall" pays off a colour the text names.
**The v2 badge failed on legibility:
the tick spoiled the Mall text, the contrast was poor and the letter "l"
confused people** (2026-10-05); trust
and notice are what worked in v3 ("I wanted to say it worked on v3").

**A storyline or copy rewrite is built on a separate preview first**
(2026-10-04: "dont touch the original, create seperate preview, then we will
merge it"): its own worktree and dev server, with `PREVIEW_MARKS` on in
`src/lib/rich.ts` and `preview: true` on the page's data, so every proposed
line is marked by where it comes from (`[[new:ID|…]]` yellow, `[[full:ID|…]]`
blue, `[[slot:ID|…]]` grey) under a legend banner, and a verbatim awaiting
consent shows as a green note. **On main the switch is off and no marker is
left in the data**: the merge strips them, drops the flag and keeps the
preview's notes file out of the public repo.

## Uttham's copy is Uttham's

**When he supplies the words for a card, section or chapter, use them** — fix
grammar and add the bold highlights, nothing else (Uttham, 2026-09-21).
Compressing his sentences to fit a layout changed what they meant. If the copy
does not fit, change the layout or ask; do not paraphrase it shorter.

**The site speaks in the first person** (Uttham, 2026-10-05, after a
colleague's review: "there are so many grammatical errors and tone difference,
some in first person and some in third person, please make everything first
person"). Narration about him is "I", "my", "me" — alt texts and labels too
("Me on my bike") — and **team work stays "we"**, so the pod's work is never
claimed as his alone. His name stays where it is a name: the wordmark, page
titles, SEO and JSON-LD, the hidden h1. Shopper verbatims, the copyable prompts
and the running tools' own UI keep their own voice. **The site writes British
English** (colour, programme, kick-off).

**No copy ships without a grammar and tone check** (Uttham, 2026-10-05: "add
the grammatical and tone thing in your rules, so that we dont end up in these
situations for this project in future"). Before any new or changed line goes
live — a row, label, why line, alt text, note, full-study paragraph, his own
supplied words included — read it once more for: **person** (I for him, we for
the team, never "Uttham"/"he"/"his" in narration, no verbless "Argued…" lines
that hide who acted); **grammar** (agreement, articles, run-ons and comma
splices, a "they" or "it" with nothing to point to); **one tense per passage**;
**British spelling**; **curly quotes, en dashes for ranges, em dashes for
breaks**; and **a meaning that does not depend on an order or a claim he did not
make** (2026-10-05: a tagline that read as a fixed sequence, "it can happen
either ways"). Fixing his words stays grammar-only; where a fix would need new
words, ask him.

**The homepage tells one story, in one image** (Uttham, 2026-10-06: the
landing message and How I lead "look seperated and disjointed in context"; he
chose option R from a preview). The hero says where I work — **the busy
intersections where shoppers’ needs cross business goals** — the caption beside
the traffic scene names three jobs (setting direction, deciding how we ship,
**building faster, smoother roads for people and AI agents**), How I lead takes
the road image in **all three** principles, each decoded by its tagline ("Know
who’s on the road, two layers down." / "Read the map and walk the street." /
"Build smoother, faster roads with AI."), and Contact closes it: "If our roads
cross". **A metaphor runs through every principle or none** ("bringing it just
for third principle is bad"), and no line may lean on it so hard that its
tagline cannot decode it. "At Meesho" stays out of the hero for now ("lets park
Meesho here").

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
