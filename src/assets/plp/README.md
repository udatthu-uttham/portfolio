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
| `titles` | Seller titles, then Facts in place of the title | Facts in place of the title | composed: the four title variants as a 2 × 2 feed grid, the feed carrying on below; the seller's-title card keeps his yellow kurti, the one-fact and two-fact cards carry the prototype's teal and grey kurtis, so the grid is not one kurti three times |
| `stagger` | Staggered feed (block 2) | A staggered feed | a feed with staggered columns, each card at its natural height |
| `list` | List or grid by category (block 2) | List view by category | composed: the list-view screen only (earphones as rows: his i12 in row 1, three meesho.com earbuds in rows 2–4, each row with its own prices) |
| `swipe` (state `scroll`; its clip is `public/media/plp/swipe.mp4`) | Swipeable images | More views and variations | composed clip: his Kurti feed capture (`scroll.png`), six of whose eight yellow kurtis are the prototype's other kurtis; the first card swipes to a red kurti, the black and ivory ones to their own back views, and back, the dots following; `swipe.png` is the clip's first and last frame |
| `date` | Delivery date | Dates on fast deliveries | composed: the winning card (Fast and its day count) in the new feed, among cards with no date |
| `after` | Outcome | The new card | the new product card |

Full case study only: `cash` (The cash-price row), not exported yet. Until his `cash.png` comes, the state maps
to `before`, whose cards carry the cash price in its own row under the UPI
price, under its own title, The cash-price row (2026-10-04 audit: it had
borrowed the swipe clip); when the file arrives, drop `cash: 'before'` from
`screens.map`. Bigger images for fashion (`bigimg`) came out of the study on
2026-10-04 ("remove this"). The other blocks reuse the
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

**No screen repeats one product photo** (Uttham, 2026-10-04: "In the first
project teaser, the images are repititive can we use other images to make the
image output realistic take it from prototype porject"). Where his boards and
his Kurti capture show one yellow kurti on card after card, the composed
screens put other kurtis in those cards' picture boxes, from the realistic
prototype's own catalogue: public Meesho catalogue photos its bundle
(`public/proto/feed-ux/assets/index-*.js`) already references, listed with
their crops in `scripts/plp-photos.mjs` and fetched once into
`.clip-work/plp-photos/` (untracked) when missing. Only the picture box
changes: his words, chips, prices, ratings, edges, hearts and dots stay his,
and every chip on those cards ("Kurti", "Cotton") is true of a kurti. The
titles grid's seller's-title card keeps his yellow kurti; its one-fact card
shows the teal anarkali (5038838) and its two-fact card the grey-and-white
A-line (5037151). The date screen (one yellow kurti among a shirt, a hair oil,
a bedsheet and two other kurtis) and the framework card were not repetitive and
are unchanged. The list view's rows came later from meesho.com (below).

**The swipeable-images clip** (Uttham, 2026-10-03: "Swipeable images in the
prototype please mock by moving images, it only there on one card, I want to
move it for other 1 or 2 products atleast . find similar images from the
product repo"). `scripts/plp-swipe-clip.mjs` (`node scripts/plp-swipe-clip.mjs`,
macOS) builds `public/media/plp/swipe.mp4` (720 × 1440, 30 fps, 9 s, H.264,
moov first, ~800 KB) and its poster `swipe.png` (1080 × 2160) from `scroll.png`,
his 1080 × 2820 Kurti feed capture: a 1 : 2 window that pans gently down the
page and back, in which three cards swipe their picture one at a time — the
first card (row 1, left) while the window is at the top, then the right card
of row 2 and the left card of row 3 once it has panned to the foot — each
sliding to a second picture and back on a critically damped spring (no
bounce), the dot for the page on show darkening as the swipe begins, moving to
the second dot as the picture passes halfway and fading back at rest. **The
feed is eight different-looking cards** (2026-10-04, above): his capture shows
the yellow kurti on all eight, so six take the prototype's other kurtis — row 1
right the teal anarkali, row 2 the grey-and-white A-line and the black
anarkali (5037149), row 3 the ivory print (5041199) and the short
green-and-navy kurti (5040548), row 4 left the red A-line (5047403) — and the
first card and row 4 right keep his yellow kurti (they share a window only as
row 1's last 60px over row 4's heads at the foot). Only each 528 × 531 picture
box changes, below the chrome and above the foot rule; his dots pill goes back
on as his own pixels, and his heart as his own pixels re-tinted to the new
photo (its disc is about 80% white over the picture, its rim read off his
pixels). **The second pictures**: his yellow kurti swipes to the red A-line, a
kurti in another colour; the black anarkali and the ivory print swipe to their
own back views, more of the same product. All photos are cropped square — the
model's head in, the corner stamp out — and scaled to the card's own box. The
clip's first and last frames are the same, so the poster is both what the clip
opens on and what it settles on (reduced motion shows the poster alone). After
re-rendering, run `npm run clip-edges` so the handset's strips follow its
frames. `scroll.png` stays as the clip's source; it is not shown on its own
once the `scroll` state maps to `swipe`.

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

`after-tile.png` is the homepage tile's copy of `after.png` (2026-10-04): the carousel dots moved from the third product (the yellow kurti) to the foot of the fourth's photo (the bedsheet), beside the tile's "Scrollable" note, so its arrow meets them; the kurti's photo is filled in where the dots were. The case page keeps `after.png` as he exported it.

The list view's rows 2–4 (2026-10-04): three different wireless earbuds from meesho.com's own listings (`EARBUDS` in `scripts/plp-photos.mjs`; "go to meesho.com and take images from there") instead of his i12 photo four times; row 1 keeps his i12. Only each row's 409px photo square changes, cropped above the listing stamp in each photo's corner; his hearts, row 2's OUT OF STOCK label and its white wash are kept.

The list view's prices (2026-10-05, Uttham: "can you randomise the price values realistic ones, for both UPI and cash prices"): each row has its own price, struck MRP, discount and cash price instead of his board's one ₹384 / ₹420 / ₹410 four times — ₹312 / ₹399 / 22% off / ₹334 with CASH, ₹587 / ₹799 / 27% / ₹619, ₹268 / ₹299 / 10% / ₹285, ₹673 / ₹999 / 33% / ₹711; the discount is worked out from the two prices and cash is the UPI price plus ₹17–38. `plp-compose.mjs` paints them onto the board's 1× crop before the ×3 upscale, so they are as soft as every other letter, in Mier B02 (Meesho's face, installed on his Mac) at the board's own sizes and colours, after refilling the green chip column by column from the clean rows around the old text; "UPI" and everything else is his. Without Mier B02 installed the script warns and leaves `list.png` as it is.
