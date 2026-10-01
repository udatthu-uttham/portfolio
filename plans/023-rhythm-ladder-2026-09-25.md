# The rhythm ladder — 2026-09-25

> **Superseded 2026-10-01 by [plans/024](024-one-section-per-screen-2026-10-01.md)** on the hero boundary: `--section-y-hero`, the peek test and the "one gap on top, 0 at the bottom" model are retired (four rungs, `--section-pad` at both ends). The `vw` basis, `--head-gap`, the tape anchor and `--card-padding` stand.

Uttham: "the spacing between the sections is very less, all of a sudden the page looks super text
heavy, can we make them more spacious, ignore the peek thing I asked if needed, a very small peek
is enough" — then, on the cards: "some cards are very heavily loaded, add breathing spaces and the
rules to them that we aligned."

Cause: on 2026-09-21 the heading-to-content gap was cut from 72px (24 + 48) to 36px (12 + 24) at
both headings, and the AI Space cards gained three two-line answers each. Together they collapsed
the page's vertical rhythm.

## What the audit turned up

A read of plans/001–022 and `docs/design-tokens.md` found three recorded figures that were already
false before this pass, and one real bug:

- **`--section-y` was the only rhythm token measured in `vh`.** `10vh` needs a 960px-tall viewport
  to clear its own 96px floor, so on every laptop it rendered a flat 96px. The documented
  96–144px range had never once happened.
- **The "small step above *and below* the ruler"** (plans/018, repeated in the tokens doc) does not
  exist in the code. The step below the ruler is `--space-3`, from `SectionRule.astro`.
- **Plans/016's peek measurements** (797 / 752 / 707px) were taken before plans/018 replaced the
  nav-word heading with the ruler-plus-sentence, and were out by 60–80px.
- **The peek's binding case is 1280×800, not 1440×900.** The hero barely shortens between those
  sizes while the viewport loses 100px, leaving 176px of room instead of 255px.

## Implemented

- `--section-y`: `clamp(96px, 10vh, 144px)` → **`clamp(96px, 11vw, 160px)`**. Same floor, a real
  scale step as the cap, and on the same basis as every other rhythm token. 113 / 141 / 158px at
  1024 / 1280 / 1440, up from a flat 96.
- **New `--section-y-hero`: `clamp(64px, 7vw, 96px)`** for the hero → Projects boundary. It used to
  borrow `--section-y-sm`, which is consumed in eight other places; raising that would have moved
  case-page internals nobody complained about.
- **New `--head-gap`: `--space-5`** (24px, was 12px) for a section heading to its own content.
- `--tape-overhang`: 24px → **48px** (`--space-7`). The tape overhangs a sheet by ~16.5px, so 24px
  left 7.5px of paper above it — that is what made the heading look glued to the cards.
- `--card-padding`: **`clamp(16px, 2.2vw, 32px)`**, no longer an alias of `--content-gap`. This
  supersedes plans/006; both ends land on the scale.
- AI card internals: stack gap 12 → 16px (matching a case sheet), answer-line gap 4 → 8px, and the
  answers take `--lh-body` instead of 1.45.
- The washi tape is anchored to half its own height (`translate: 0 -50%`) rather than to the board's
  padding, so retuning the gap above the board can never slide it inside a card again.

## Verification

Measured live at 1440×900 / 1280×800 / 1024×768:

| | 1024×768 | 1280×800 | 1440×900 |
| --- | --- | --- | --- |
| Between sections | 113px | 141px | 159px |
| Hero boundary | 72px | 89px | 96px |
| Heading → first card | 72px | 72px | 72px |
| Projects sentence clear of the fold | 40px | **19px** | 87px |

The peek holds at all three; 1280×800 is the tightest and is what any future raise must be checked
against. Page height grew ~6%.

## Open

AI Space sheets measure 819px against Projects' 660px at 1440. CLAUDE.md requires the two sections
stay within sight of each other and says the difference must come out of the layout, not the copy —
but the remaining levers (a shorter well, fewer answers) both undo something Uttham asked for on
2026-09-21. Flagged, not forced.
