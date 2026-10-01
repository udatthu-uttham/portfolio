# Teaser pages: the homepage ladder, stepped up — 2026-10-01

Uttham: "as the reference website shared, make sure there is lot of spacing, use /skiller" — with
the skills uidesign-spacing-system, visualcritique-critique-composition, uidesign-law-of-proximity
and awesome-design-spacious, and "along with our spacing system that we followed on the main page,
it should match that system".

## The reference, measured (bus-discovery, 1440×900)

Each chapter (`.section`) pads 80px top and bottom, so chapters sit 160px apart — exactly the
homepage's `--section-y` at that width. Inside a chapter: heading → its text 18px, intro → what
follows 32–48px.

## Before → after (1440×900)

| Gap | Before | After | Token |
| --- | --- | --- | --- |
| Below the header | 72 | 79 | `--section-pad` |
| Hero → story; section → section | 72 | 158 | `--section-y` |
| Heading → its text | 12 | 24 | `--head-gap` |
| Paragraph → paragraph | 12 | 16 | `--space-4` |
| Lead → rows / note / list / gate; above an h3 | 12–32 | 48 | `--ct-sub` |
| h3 → its rows | 12 | 16 | `--space-4` |
| Row padding / label → line | 16 / 4 | 24 / 8 | `--space-5` / `--space-2` |
| Full-study blocks; story → More cases | 72 | 158 | `--section-y` |

At 375px the steps are 96 / 32 / 24 / 16: `--ct-sub` is `max(--group-gap, --space-6)`, because
`--group-gap` alone is 24 there and left a sub-group heading only 1.5:1 over its rows.

What the skills contributed: the spacing system's "spacious: one step up for reading" (rows 16 →
24, labels 4 → 8) and "scale values only"; proximity's "less space below a heading than above it"
checked at every width; composition's macro whitespace and consistent cadence (every section the
same gap); the spacious preset's 8-point steps (its fonts and colours not taken).

Left as drawn: the phone pane starts beside the first section, not the hero (Uttham's layout), so
the first screen's right half is empty.

## Verification

Measured on the dev server at 1440×900, 1280×800 and 375×812: every gap equals its token (table
above); no horizontal overflow. The Meesho Mall page renders through the same component and gets
the same steps.

## Scroll points (same day)

Uttham: "also implement that section type scroll points, that we see in chatgpt and reference
portfolio in l2 pages, so I can swiftly navigate inside the page". The bus-discovery reference has
only an indicator — ten dots beside its phone, one lit, not clickable; ChatGPT's rail is the
navigable one (ticks on the right edge, the current one longer, names on hover, click to jump).

Built into `CaseTeaser`, so every teaser page has it (both case studies; the AI Space pages through
the same component):

- A fixed rail of ticks in the right gutter, vertically centred, clear of the phone pane (it sits in
  the gutter beside the 1200px container; on the 8-column tablet grid its padding halves so its box
  stops at the container edge). One point per section heading; the eight full-study blocks join once
  the study is unlocked (5 → 13 on the product cards).
- The section being read — the last one whose top has passed 40% of the screen — is marked
  `aria-current="location"`: its tick doubles to 24px and turns ink. That is state, not hover.
- Hover or keyboard focus opens the names on a paper card to the left of the ticks. Closed, the
  names take no room (max-width 0) but stay in the accessibility tree; the rail's padding is the
  same open and closed, so nothing shifts under the pointer (CLAUDE.md: hover is colour and border).
- A click is a plain in-page link: the section lands `--content-gap` below the header
  (`scroll-margin-top`), and the current point follows.
- Section ids are `s-<heading>`, so none can collide with the homepage scrollspy's ids.
- Not on phones (<768px): the gutter is 20px and the floating mini player owns the right edge.

Verified at 1280×800: five points; Strategy current when it is in view; focus opens the card with
every name; clicking Outcome lands its heading at 100px (header 76 + 24) and makes it current; the
rail sits 25–37px from the edge against a 72px gutter. Meesho Mall: its five sections. 768×1024:
ticks 9–21px from the edge, the rail's box at the container edge. 375×812: hidden, no overflow.
