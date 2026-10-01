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

## Later the same day: the tool card loses its answers

Uttham: "remove the explanation on the main AI space cards to optimise content, these
descriptions can be in l2 page".

- The three "how it helps" lines left the homepage card. They now sit on `/ai/<slug>` under
  "How it helps", between the intro and "What you get". They are rendered from the same
  `tools.ts` `helps` array, so the words are unchanged.
- **The card opens the guide.** Nothing on the card linked to `/ai/<slug>`; the action row had
  been cut to the copy button on Uttham's word. So the title's link stretches over the whole
  sheet, as a case card is one link. Only the controls rise above it — the copy button, and the
  prototype's well with `pointer-events: none` everywhere but its phone (a size container is its
  own stacking context, so the phone alone could not rise). Every bit of paper and glass that is
  not a control opens the guide.
- **The copy block is centred against the phone's glass well**, 12px above the phone's own
  centre, because the phone starts 24px down the well. It holds the name, its line and the
  action, 16px from line to action. With the answers gone, a bottom-pinned action left 209–260px of
  bare paper under the line.
- Measured at 1280×800: AI Space is 571 against a 583 budget, so it **fits** (it was 38px over).
  The block's centre sits 0px from the well's centre. Hit-testing confirms the click targets:
  the title, lead, Resona phone and blank paper go to the guide; "Copy the prompt" copies; the
  prototype phone opens the prototype.
- **Favicon:** the header avatar, cropped square to the head — `favicon.ico` (16/32/48) and
  `favicon-192.png` transparent, `apple-touch-icon.png` opaque on `--paper-1` (#FFFFFF). Linked
  in `Base.astro`.
- Reviewed by a six-lens workflow with a skeptic per lens. Confirmed and fixed: dead click zones
  from lifting whole rows, a `:has()` sharing a selector list with the copy button, a square
  focus ring, stale comments and docs, and the touch icon's retired paper hex.

## Open

- **1280×720** runs over in all three sections; this is the screen-contract cost plans/024
  already records.
