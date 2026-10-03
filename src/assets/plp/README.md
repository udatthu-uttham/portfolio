# Phone screens for the product-cards case study

The sticky phone on `/work/a-line-of-card-height` shows one screen per state.
Drop a Figma export in this folder named after its state and the page picks it
up on the next build — `before.png`, `scan-price.png`, and so on (.png, .jpg or
.webp). A state with no file keeps the previous screen on the phone.

Teaser (2026-10-02), in reading order, with the title the card shows above
the phone. Since 2026-10-03 the Strategy's first block, "Remove what slows them
down", holds Card framework and Seller titles only; the staggered feed and the
list or grid moved under "Add what helps them decide", ahead of Swipeable images
and Delivery date:

| File | Shown at | Card title | What the screen is |
|---|---|---|---|
| `before` | Context | The old card | the old product card in the feed |
| `before-annotated` | Problem | Which team added what | the old card, each element labelled with the team that added it |
| `framework` (state `cleanup`) | Card framework | The card framework | composed: the framework card alone, large, on the feed under the search bar and filter row; its zone labels are notes beside the phone |
| `titles` | Seller titles | Facts in place of the title | composed: the four title variants as a 2 × 2 feed grid, the feed carrying on below |
| `stagger` | Staggered feed (block 2) | A staggered feed | a feed with staggered columns, each card at its natural height |
| `list` | List or grid by category (block 2) | List view by category | composed: the list-view screen only (earphones as rows) |
| `scroll` | Swipeable images | More views and variations | a card whose swipeable images show more of the product and its variations |
| `bigimg` | Bigger images for fashion | Bigger images for fashion | a fashion card with the taller 4:5 image |
| `date` | Delivery date | Dates on fast deliveries | composed: the winning card (Fast and its day count) in the new feed, among cards with no date |
| `after` | Outcome | The new card | the new product card |

Full case study only: `cash` (The cash-price row). The other blocks reuse the
names above. The scan-order screens (`scan-*`) left with that section.

**Composed screens** (Uttham, 2026-10-03: "I gave the whole dump I want you to
show the final version only, that is relevant for it, when I gave 4 product
cards I want you to place thme in a mbile grid and explain not use as it is,
similarly for framework the framework card should comeinside the image, and the
wordings outside as you did on home page"). `cleanup`, `titles`, `list` and
`date` are not his exports as they came: they are 1080 × 2160 phone screens
that `scripts/plp-compose.mjs` (`npm run plp-compose`) builds from his
reference boards in `boards/` and the top of `after.png` (the search bar and
the Sort / Category / Price / Filters row). Final versions only, cards in the
feed's own grid, nothing cropped, stretched or sharpened; the words that were
on a board are handwritten notes beside the phone (`screens.notes` in
`src/data/plp-case.ts`). `boards/` is the script's source and is never shown on
the page (the page globs only this folder's top level). To change one, replace
its board in `boards/` and run the script again; if a card moves, take the
notes' new `y` from what it prints. Effective upscale on the page (1440×900,
2× display): titles and date cards ×1.5 (the boards are 1× renders), the list
×1.5, the framework card ×0.9 (none).

Export phone screens at 1 : 2 (1080 × 2160 is ideal), at 2× or more (≥ 720px
wide), with dummy data only — no Figma links or file keys on the page, and no
status bar: the page's phone mock draws its own (an Android status bar: the clock, the punch-hole camera) above the
screen, and its strips take the colour of each export's top and bottom edge.
The phone is one constant size on the page, its display 1 : 2, and nothing is
ever cropped or stretched (Uttham, 2026-10-03): a 1 : 2 screen fills the
display exactly; a shorter one (9 : 16) fits its width on its own edge colours,
centred, or against its patterned edge when the other is flat; a page capture
taller than 1 : 2 (like `scroll.png`, 1080 × 2820) pans down it and back, or
scrolls by hand with reduced motion, its "Scroll ↓" chip in the phone's home
strip. A file wider than a phone (width ÷ height above 0.62) dropped straight
in here would still be shown as a reference board, whole in the phone's place
with "Click to enlarge" under it — but for this page a board is composed into
a phone screen instead, as above.

On hand (2026-10-03, from Uttham): `before.png` (the old feed) and `after.png` (the new feed).
They also stand side by side, tagged Before and After, in the homepage tile (`tile` in
`src/data/studies.ts`). The earlier cut-outs came off on 2026-10-02.
