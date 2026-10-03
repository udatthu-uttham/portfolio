# Phone screens for the product-cards case study

The sticky phone on `/work/a-line-of-card-height` shows one screen per state.
Drop a Figma export in this folder named after its state and the page picks it
up on the next build — `before.png`, `scan-price.png`, and so on (.png, .jpg or
.webp). A state with no file keeps the previous screen on the phone.

Teaser (2026-10-02), in reading order, with the title the card shows above
the phone:

| File | Shown at | Card title | What the screen is |
|---|---|---|---|
| `before` | Context | The old card | the old product card in the feed |
| `before-annotated` | Problem | Which team added what | the old card, each element labelled with the team that added it |
| `cleanup` | Card framework | The card framework | the framework: every case the card carries, in one structure |
| `titles` | Clearer titles | Facts in place of the title | the new card with fact chips where the shop-name title was |
| `stagger` | Staggered feed | A staggered feed | a feed with staggered columns, each card at its natural height |
| `list` | List or grid by category | List view by category | list rows for a considered category |
| `scroll` | Swipeable images | More views and variations | a card whose swipeable images show more of the product and its variations |
| `bigimg` | Bigger images for fashion | Bigger images for fashion | a fashion card with the taller 4:5 image |
| `date` | Delivery date | Dates on fast deliveries | a fast-delivery card with its day count |
| `after` | Outcome | The new card | the new product card |

Full case study only: `cash` (The cash-price row). The other blocks reuse the
names above. The scan-order screens (`scan-*`) left with that section.

Export phone screens portrait (about 9 : 19.5), at 2× or more (≥ 720px wide),
with dummy data only — no Figma links or file keys on the page.

On hand (2026-10-03, from Uttham): `before.png` (the old feed) and `after.png` (the new feed).
They also stand side by side, tagged Before and After, in the homepage tile (`tile` in
`src/data/studies.ts`). The earlier cut-outs came off on 2026-10-02.
