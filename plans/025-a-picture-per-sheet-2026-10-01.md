# A picture per sheet — 2026-10-01

Follows plans/024's open item: Projects and AI Space were taller than one laptop screen.

## What was tried first, and reversed

A debate the same day recommended **two doorways and a stage**: one sheet per section, the two
items' copy side by side as clickable titles, and one glass stage showing the selected item's
picture. Uttham approved the rule change ("lets change that rule to 3"). On seeing it he asked:
"why we are having image of one card, we should have for both". It was reversed before it was
committed. **Never one shared stage for several cards** — CLAUDE.md now says so.

In the same message: "the washi tape is so tightly spaced with the product card". On a phone
the tape sat on the title.

## Implemented

- **Two taped sheets per section, each with its own picture**, each its own magnetic tile again
  (motion.js is back to the verbatim tuning; the width scaling added for the one wide sheet is
  gone with it).
- **`--sheet-in`** — the content height a sheet gets on a laptop (≥1024px) so its section is one
  screen: budget − `--sec-chrome` − the sheet's padding and border, clamped 360–480px.
  `--sec-chrome` is the ruler's 12px + one line of the heading sentence + `--head-gap` +
  `--tape-overhang`.
- **Case sheets stack** (title, lead, well, action). The sheet is exactly `--sheet-in` tall and
  the well takes what the copy leaves, so the Mall phone and the product-cards cover grow with
  the screen. The cover is sized to fit the well, never cropped, and sits as a card on the pane.
- **Tool sheets set the copy on the left and the phone on the right** wherever the sheet is
  ≥540px wide (a container query on the reveal wrapper). The phone column is
  `clamp(220px, 40cqw, 280px)`. The phone is as tall as the well, so it takes a handset's
  proportions (about 0.45 width per height), not a fixed 9/15. Below 540px a tool sheet stacks
  like a case sheet. The AI row drops to one sheet per line below a 1104px container.
- **Tape clearance.** `--tape-bite: 18px` (the 35px-tall turned strip, half on the paper) and
  `--sheet-top: max(--card-padding, --tape-bite + --space-4)`. Every taped sheet's title is
  16.5px below the tape at every width (was 0px on a phone, 11px at 1280).
- **The short-screen heading fold is gone.** The stage layout hid the section sentence under
  790px of height with `display: none`, which also took the h2 out of the accessibility tree.
  Nothing folds now.
- **Contact, same pass** (Uttham: "it looks like block of 4 cards, I want the image to be more
  focussed, while the 3 CTAs retain their clickability"):
  - The notes are two lines (the label and its arrow, then the address).
  - They sit at their own size and are not stretched across the leftover glass.
  - The photo reserve was re-measured: 285px and 1.23, not 400px and 1.07.
  - The print sits `--space-4` in from the right edge, so it clears the bolts by 18–21px.
    The full-size print had left 15px, against the 16px owed.

## Verification

Measured in Chrome on the dev server. Content runs from the section's first child to its last.
The budget is `100svh − --header-height − --section-y`.

| | 1024×768 | 1280×720 | 1280×800 | 1324×967 | 1440×900 | 1920×1080 |
| --- | --- | --- | --- | --- | --- | --- |
| Budget | 579 | 503 | 583 | 745 | 666 | 844 |
| **Projects** content | **567 ✓** | 536 · +33 | **571 ✓** | **658 ✓** | **654 ✓** | **668 ✓** |
| **AI Space** content | 1098 · one sheet per row | 621 · +118 | 621 · +38 | **658 ✓** | **654 ✓** | **668 ✓** |
| **Contact** content | **540 ✓** | 514 · +11 | **563 ✓** | **669 ✓** | **642 ✓** | **677 ✓** |
| AI phone width | 225 | 190 | 190 | 197 | 202 | 202 |
| Contact photo (`--photo-w`) | — | — | 242 | 340 | 309 | 340 |
| Heading → sheet / tape above sheet / tape → title | 72 / 16.5 / 16.5 at every size, also 375×812 and 768×1024 | | | | | |

Also confirmed:

- No horizontal overflow at 375, 768, 965, 1024, 1280, 1440 or 1920px.
- No contact address wraps at any of those widths.
- The tilt runs on each sheet at its own 4° / 2.5°.
- The production build passes (5 pages).

## Open

- **AI Space is 38px over at 1280×800.** The copy is Uttham's and stays whole, and the phone keeps
  its floor. The levers left are the heading sentence or a narrower phone; neither was taken.
- **1280×720** runs over in all three sections; this is the screen-contract cost plans/024
  already records.
