# One section per screen — 2026-10-01

Uttham: "in one viewport so many elements are there, I want to just show one section" — then, the
same day, on Contact: "the whole contact section should be in one viewport, let's remove the
paragraph section for the How I lead section" — and on the bar above it all: "the header top nav
should always be end to end".

Cause: plans/016 asked the first section to *peek* into the hero's fold, plans/018 gave that
boundary a small step, and plans/023 gave it its own token (`--section-y-hero`) and recorded the
peek as the test every future spacing change had to pass. So the first screen showed the hero *and*
the top of Projects by design, and every later boundary showed the tail of one section under the
head of the next. That is the "so many elements" he was looking at.

## Implemented

- **The screen contract.** Every top-level section is one screen with its content centred in it.
  The hero is `min-height: 100svh` and sits under the fixed header, so it adds `--header-height`
  to its top pad; `#work`, `#ai` and `#contact` are `min-height: calc(100svh - var(--header-height))`.
  Taller content grows the section from its top pad down — nothing clips, nothing overlaps. On
  phones the hero is taller than the screen, so min-height and centring do nothing there.
- **`--section-pad: calc(var(--section-y) / 2)`.** Each section pads half a section gap top and
  bottom (48 / 56 / 70 / 73 / 79 / 80px at ≤872 / 1024 / 1280 / 1324 / 1440 / ≥1455). Two
  neighbours' pads meet at the boundary, so content-to-content is never less than one
  `--section-y`, plus the shorter section's centring slack. No section owns the whole gap any
  more, so none can double it. This replaces plans/023's `padding-block: var(--section-y) 0`
  model ("one gap on top, none at the bottom") and the per-section top-gap figures that followed
  from it.
- **`--section-y-hero` retired.** There is no fold for Projects to peek into, so it takes a normal
  section gap like every other section. `--section-y` itself is unchanged
  (`clamp(96px, 11vw, 160px)`, on `vw` as plans/023 fixed it); the ladder is four rungs — between
  sections → heading to its content → card inset → within a card — and the hero is not a rung.
- **One landing rule for every nav jump.** `section[id] { scroll-margin-top: var(--header-height) }`,
  Contact included; its old `--header-height + --content-gap` override let a strip of the AI Space
  cards show under the header after a jump, and is gone.
- **Centring is block-level `align-content: center`**, not flex or grid, chosen so the children keep
  normal flow — their widths and their collapsing margins (the ruler's 12px into the How-I-lead
  sheet's 32px) are exactly what they were. Needs Chrome/Edge 123+, Firefox 125+ or Safari 17.4+;
  an older browser top-aligns, which is the old layout. The hero's `align-content` works everywhere
  because the hero is a grid.
- **Contact fits one screen.** The three principles keep a title and a tagline each; the body
  paragraphs came out at Uttham's request (his cut, not a compression). The contact notes sit in
  one row and the bike photo is sized to the screen rather than to its column. Exact sizes are
  still being tuned and are deliberately not recorded here yet.
- **Header end to end.** `.site-header__inner` is `width: 100%; padding-inline: var(--margin-side)`,
  no longer capped to `--container-max`. Recorded here because the contract leans on
  `--header-height`, which is untouched: 76px, 96px at ≤900 and ≤640, 92px at ≤360. Above ~1350px
  the bar's edges and the sections' 1200px column visibly differ; that is what "end to end" asks
  for.
- **Same day, recorded in CLAUDE.md (Motion), listed here so the day is in one place:** the hero
  portrait is grey at rest on fine pointers and shakes-and-develops to colour on hover
  (`InstaxFrame develop`, durations in `docs/design-tokens.md`); the hi! sticker now overlaps
  ~40% of the print's top-right corner and rides the same shake. The contact bike photo stays
  still.

## Verification

**Measured in the browser** (Chrome, dev server) on 2026-10-01, after the contact rebuild, the
pill-row removal and the badge removal. Content budget = `100svh − --header-height − --section-y`.
Section content = the ruler's top edge to the bottom of the section's last child.

| | 1280×720 | 1280×800 | 1324×967 | 1440×900 | 1920×1080 |
| --- | --- | --- | --- | --- | --- |
| Budget | 503px | 583px | 745px | 666px | 844px |
| Hero fills the first screen, nothing of Projects visible | ✓ | ✓ | ✓ | ✓ | ✓ |
| Hero content | 503 (at the edge) | 503 | 508 | 521 | 578 |
| **Projects** content vs budget | 703 · +200 | 703 · +120 | **720 · fits** | 736 · +70 | **744 · fits** |
| **AI Space** content vs budget | 862 · +359 | 862 · +279 | 879 · +134 | 895 · +229 | 902 · +58 |
| **Contact** content vs budget | 538 · +35 | **539 · fits** | **683 · fits** | **609 · fits** | **709 · fits** |
| Content-to-content: hero→Projects / Projects→AI / AI→Contact | 141 / 141 / 141 | 181 / 141 / 163 | 277 / 158 / 177 | 231 / 158 / 187 | 343 / 210 / 228 |
| Every gap ≥ one `--section-y` (141 / 141 / 146 / 158 / 160) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Nav jump to #work / #ai / #contact hides the previous section | ✓ | ✓ | ✓ | ✓ | ✓ |
| Header gutters (left wordmark / right nav) | 72 / 72 | 72 / 72 | 74 / 74 | 80 / 80 | 80 / 80 |
| Contact photo width (`--photo-w`) | 170 | 171 | 323 | 248 | 340 |

How the nav-jump row was proven: Lenis smooth-scrolls every jump, so timed probes kept catching it
mid-flight. Instead, each section was checked to have `scroll-margin-top` equal to the header height
(76px) **and** to sit flush against the section before it — which together guarantee the previous
section ends exactly under the header. Real nav clicks at 1440×900 and 1920×1080 confirmed it.

**What does not fit, honestly:** AI Space overflows one screen at every laptop size, and Projects
at 1280–1440. Removing the tiles' pill-and-year row (later the same day) took 53px off every tile and
brought Projects inside the budget at 1324×967 and 1920×1080. The rest is a card-layout decision —
see the debate recommendation, pending with Uttham. Contact misses only at 1280×720, by 35px.

Also confirmed: no horizontal overflow at any size above or at 390×844 and 768×1024; the contact notes
stay on one line at every width (the email included); the hero portrait is greyscale at rest and
develops to colour on hover (shake mid-run, ~46% grey at 300ms, full colour by ~1.8s); the contact
photo is not affected by the develop effect.

## Supersedes

- **plans/016** — the peek ("the first section after the hero sits one small step below it so its
  heading shows inside the first fold") and its 797 / 752 / 707px tops. The one-heading rule, the
  highlighter and the quiet sectioning stand.
- **plans/018** — the hero → Projects `--section-y-sm` step above and below the ruler. The ruler
  itself, the measure and the tokens stand; the rule now sits at the top of each section's content
  box, one `--section-y` below the previous content.
- **plans/023** — `--section-y-hero`, the peek-as-property test with its 87 / 19 / 40px clearances,
  the "one gap on top, 0 at the bottom" padding model and every per-section top-gap figure derived
  from it. What stands from 023: `--section-y` on `vw`, `--head-gap`, `--tape-overhang` at 48px,
  the tape anchored to half its own height, `--card-padding`, and the AI card internals.
- **Not superseded: plans/006** ("no forced full-height fold"). This pass uses `min-height`, not
  `height`, so the hero stays in normal flow and the 1024×600 behaviour is unchanged. The hero
  comment in `index.astro` claims otherwise and should be reworded (reviewer note; not a docs
  change).

Each of 016, 018 and 023 now carries a one-line pointer here under its title.

## Open

- **Projects and AI Space are taller than one laptop screen and do not fit the budget.** The
  contract lets them grow, so nothing breaks, but they break the one-screen promise. Whether to
  shrink their tiles is a layout decision pending with Uttham — not a spacing fix, and not a copy
  cut (CLAUDE.md: "take it out of the layout, not out of the copy").
- **Tall screens add slack.** A section shorter than its budget is centred, and that slack sits on
  no rung, so the between-section gap grows past `--section-y` as the viewport grows (hundreds of
  pixels at 1920×1080 for a short section). Recorded in CLAUDE.md as a known cost; if it reads as
  too much blank paper, the lever is a height- or aspect-gated `min-height`, not a smaller
  `--section-y`.
- **The hero is at the edge of its budget at 1280×720 and 768×1024.** Which side it lands on
  depends on whether the lead wraps to three or four lines; if it overflows it grows a few px past
  `100svh` and sits up to ~19px above true centre. Measure the lead's line count in the browser.
- **Contact is still being tuned.** The decision is recorded (title + tagline, notes in one row,
  photo sized to the screen); at the time of writing `.note-row` was still a column and the photo
  `min(100%, 420px)` in `index.astro`, and Contact's estimated height exceeded its budget at
  1280×720 and 1440×900. The pixel values go into `docs/design-tokens.md` when they settle.
- **`InstaxFrame`'s default variant still has a CSS hover lift** (rotate toward true, translate
  −3px, `--shadow-lift`, commented as "the one exception to the no-hover-motion rule, 2026-09-20").
  CLAUDE.md now says the hero develop is the one exception and the contact bike photo stays still,
  so either that lift comes out in a src pass or the rule gains a second, named exception. Flagged,
  not forced.
- **The footer moved down** with Contact's new bottom pad. Nobody has looked at whether
  `--section-pad + --section-y-sm` above the footer rule is the right amount.
- **The auto-memory files outside the repo** (`memory/spacing-rhythm-ladder.md`,
  `memory/design-sanity-rules.md` item 10, the `MEMORY.md` index line) still teach five rungs, the
  hero boundary and the peek as Uttham's wish. They are not in this tree and were not touched here;
  the next session that loads them should bring them to four rungs and one section per screen.
