// Composes four of the product-cards case study's phone screens from Uttham's
// own boards (Uttham, 2026-10-03: "in meesho product cards images, I gave the
// whole dump I want you to show the final version only, that is relevant for
// it, when I gave 4 product cards I want you to place thme in a mbile grid and
// explain not use as it is, similarly for framework the framework card should
// comeinside the image, and the wordings outside as you did on home page,
// please make it cohesive and clean and amazing, dont just throw all the
// things as I gave").
//
//   node scripts/plp-compose.mjs        (npm run plp-compose)
//
// Sources, never shown raw on the page: src/assets/plp/boards/ (his reference
// boards) and src/assets/plp/after.png (his new feed, for the app's chrome and
// the feed around a card). Output: src/assets/plp/<state>.png, 1080 × 2160 —
// the exports' own 1 : 2, so each fills the case page's phone exactly. Every
// pixel is his: cards are only placed, scaled (Lanczos, no sharpening) and, on
// the framework card, cleared of the board's dashed zone boxes (only the dash
// pixels; card content is never painted). The words that were on the boards
// become handwritten notes beside the phone (`screens.notes` in
// src/data/plp-case.ts); this script prints where each note's zone lands, as a
// fraction of its screen's height.
//
//   cleanup  the card framework: the card alone, large, on the feed under the
//            app's search bar and filter row, its zone boxes and labels gone
//   titles   facts in place of the title: the four cards in a 2 × 2 feed grid,
//            the feed carrying on below them
//   list     list view by category: the list-view screen only (the grid
//            control and the variant labels dropped)
//   date     dates on fast deliveries: the winning card only (Fast and a day
//            count), in the new feed in place of the same kurti's card, so it
//            stands among cards that are not fast and carry no date
//
// Re-runnable: the boards are the source, the outputs are overwritten.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const DIR = `${root}src/assets/plp`;
const BOARDS = `${DIR}/boards`;
const W = 1080;
const H = 2160;
const KERNEL = 'lanczos3';

// The new feed's geometry (after.png, 1080 × 2160, measured 2026-10-03): a 3px
// frame all round (#CECEDE), the search bar and the Sort / Category / Price /
// Filters row in rows 0–305 (the row's foot rule at 304–305), then two columns
// of cards: x 3–538 and 541–1076, a 2px rule (#CECEDE) at 539–540 between them.
const FRAME = { r: 206, g: 206, b: 222 };
const FEED = { r: 234, g: 234, b: 242 }; // #EAEAF2, the feed between cards (the cards' own edge colour)
const CHROME_H = 306;
const COL = [3, 541];
const COL_W = 536;
const FOOT = H - 3; // the frame's bottom rule starts here

const after = () => sharp(`${DIR}/after.png`);
const region = async (src, left, top, width, height) =>
  sharp(src).extract({ left, top, width, height }).png().toBuffer();
// a card cut from a board (its own 1px edge included) and scaled to `width`
const card = async (src, box, width) => {
  const buf = await sharp(src)
    .extract(box)
    .resize({ width, kernel: KERNEL })
    .png()
    .toBuffer();
  const { height } = await sharp(buf).metadata();
  return { buf, height, scale: width / box.width };
};
const rect = (width, height, colour) =>
  sharp({ create: { width, height, channels: 3, background: colour } }).png().toBuffer();
// the export's frame: the 3px rule round the screen, as after.png has it
const frame = async () => [
  { input: await rect(W, 3, FRAME), left: 0, top: 0 },
  { input: await rect(3, H, FRAME), left: 0, top: 0 },
  { input: await rect(3, H, FRAME), left: W - 3, top: 0 },
  { input: await rect(W, 3, FRAME), left: 0, top: FOOT },
];
const save = async (name, layers, background = { r: 255, g: 255, b: 255 }) => {
  await sharp({ create: { width: W, height: H, channels: 3, background } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(`${DIR}/${name}.png`);
};
const at = (y) => (y / H).toFixed(3);
const report = {};

// ---- titles: the four cards in a 2 × 2 grid ---------------------------------
// titles.png (978 × 478): four cards 180px wide with their 1px #EAEAF2 edge, at
// x 100, 295, 490 and 698; the three kurtis 254px tall from y 100, the Dove
// card 278px. In the board's order, read as a feed reads: the seller's title
// and one fact on the first row, two facts and the Ad · Mall card on the
// second. Each card is scaled to the feed's column (×2.98) at its own height;
// cards in a column abut, so their edges make the feed's gutter. Under them the
// feed carries on with the next cards from after.png, the orange and the black
// kurti, as a feed does below the fold.
{
  const src = `${BOARDS}/titles.png`;
  const kurti = (x) => ({ left: x, top: 100, width: 180, height: 254 });
  const [title, one, two, mall] = await Promise.all([
    card(src, kurti(100), COL_W),
    card(src, kurti(295), COL_W),
    card(src, kurti(490), COL_W),
    card(src, { left: 698, top: 100, width: 180, height: 278 }, COL_W),
  ]);
  const row2 = CHROME_H + title.height;
  const leftEnd = row2 + two.height;
  const rightEnd = row2 + mall.height;
  // after.png's next cards: the left column's from its top edge (y 1683, under
  // the 3px gap rule), the right's from its 3px top rule (1807)
  const leftNext = await region(`${DIR}/after.png`, COL[0], 1683, COL_W, FOOT - leftEnd);
  const rightNext = await region(`${DIR}/after.png`, COL[1], 1807, COL_W, FOOT - rightEnd);
  await save('titles', [
    { input: await region(`${DIR}/after.png`, 0, 0, W, CHROME_H), left: 0, top: 0 },
    { input: await rect(2, H, FRAME), left: 539, top: CHROME_H },
    { input: title.buf, left: COL[0], top: CHROME_H },
    { input: one.buf, left: COL[1], top: CHROME_H },
    { input: two.buf, left: COL[0], top: row2 },
    { input: mall.buf, left: COL[1], top: row2 },
    { input: leftNext, left: COL[0], top: leftEnd },
    { input: rightNext, left: COL[1], top: rightEnd },
    ...(await frame()),
  ]);
  // the title line and the chip rows sit 195px into a 254px card on the board
  report.titles = {
    scale: title.scale.toFixed(3),
    'the seller’s title (left, row 1)': at(CHROME_H + 195 * title.scale),
    'two facts (left, row 2)': at(row2 + 194 * two.scale),
  };
}

// ---- list: the list-view screen alone ---------------------------------------
// list.png (981 × 963): two phone crops under purple variant labels; the list
// view is x 521–880, y 164–884 inside its 1px #CECEDE frame. Its rows 164–883
// are exactly 1 : 2 (360 × 720), scaled ×3; the frame's foot (row 884) is
// redrawn at the bottom, so nothing is stretched.
{
  const buf = await sharp(`${BOARDS}/list.png`)
    .extract({ left: 521, top: 164, width: 360, height: 720 })
    .resize({ width: W, height: H, kernel: KERNEL })
    .png()
    .toBuffer();
  await save('list', [{ input: buf, left: 0, top: 0 }, { input: await rect(W, 3, FRAME), left: 0, top: FOOT }]);
  // on the board: the first row's middle at y 330, the third row's chips at 580
  report.list = { scale: '3.000', 'first row': at((330 - 164) * 3), 'third row': at((580 - 164) * 3) };
}

// ---- date: the winning card in the new feed ---------------------------------
// date.png (754 × 522): three variants under purple labels; the winner,
// "Identity + Fast + X day delivery", is x 493–672, y 148–421. after.png's left
// column holds the same yellow kurti (its card at y 921–1685, edge to edge);
// the winner takes that card's place at the feed's column width, and the
// column carries on below it with after.png's next card. Around it the feed is
// after.png's own: the shirt (no date), the hair oil (Fast with its day count),
// the bedsheet (no date) — a date only where delivery is fast.
{
  const winner = await card(`${BOARDS}/date.png`, { left: 493, top: 148, width: 180, height: 274 }, COL_W);
  const top = 921;
  const end = top + winner.height;
  const next = await region(`${DIR}/after.png`, COL[0], 1683, COL_W, FOOT - end);
  await save('date', [
    { input: await after().png().toBuffer(), left: 0, top: 0 },
    { input: winner.buf, left: COL[0], top },
    { input: next, left: COL[0], top: end },
    { input: await rect(W, 3, FRAME), left: 0, top: FOOT },
  ]);
  // the winner's delivery line sits 258px into its 274px card; the shirt
  // card's rating row (no delivery line under it) is at y 878 in after.png
  report.date = { scale: winner.scale.toFixed(3), 'Fast and its day count': at(top + 258 * winner.scale), 'the shirt, no date': at(878) };
}

// ---- cleanup: the framework card, clean and large ---------------------------
// cleanup.png (1599 × 1326): one card, x 622–1165 × y 268–1150 with a 4px edge
// (#F4F4F8 #EAEAF2 #EAEAF2 #F4F4F8), inside five dashed zone boxes with their
// labels and leaders outside it. Only the boxes' horizontal runs cross the card,
// each in the white gap between two of its rows: 813–821 (the picture ends at
// 809, the chips start at 834), 888–893, 1014–1019, 1092–1100 and 1143–1148
// (on the card's own foot edge, 1147–1150). Measured in the dashes' gaps, the
// card under every run is plain white except in one place: the timer pill's
// foot (its outline at 1014, anti-aliased into 1015), which the red run hides
// in stretches. The pill is a rounded rectangle, its outline at 965 and 1014,
// so its foot is restored from its own top edge, mirrored (row y ← 1979 − y);
// the script checks that mirror against the rows the dashes left alone. The
// rest of each run is the card's white again, and its edge is redrawn where a
// run crossed it.
{
  const box = { left: 622, top: 268, width: 544, height: 883 };
  const { data, info } = await sharp(`${BOARDS}/cleanup.png`).extract(box).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const BANDS = [[813, 821], [888, 893], [1014, 1019], [1092, 1100], [1143, 1148]].map(([a, b]) => [a - box.top, b - box.top]);
  const EDGE = [[244, 244, 248], [234, 234, 242], [234, 234, 242], [244, 244, 248]];
  const PILL = { x0: 655 - box.left, x1: 892 - box.left, axis: 1979 - 2 * box.top }; // row y ↔ axis − y
  const idx = (x, y) => (y * info.width + x) * 3;
  // the mirror holds: the pill's foot rows the dashes never reached (1006–1013)
  // against its top rows (966–973)
  let mirrorOff = 0;
  for (let y = 1006 - box.top; y <= 1013 - box.top; y++) {
    for (let x = PILL.x0; x <= PILL.x1; x++) {
      const i = idx(x, y), m = idx(x, PILL.axis - y);
      for (let k = 0; k < 3; k++) mirrorOff = Math.max(mirrorOff, Math.abs(data[i + k] - data[m + k]));
    }
  }
  // nothing of the card's but white (or the picture's faint foot shadow, 249
  // and up) touches a run from above or below, save the pill — checked, not
  // assumed
  const touching = [];
  for (const [a, b] of BANDS) {
    for (const y of [a - 1, b + 1]) {
      if (y >= info.height - 4) continue;
      for (let x = 4; x < info.width - 4; x++) {
        if (y === 1013 - box.top && x >= PILL.x0 && x <= PILL.x1) continue;
        const i = idx(x, y);
        if (Math.min(data[i], data[i + 1], data[i + 2]) < 245) { touching.push(`${x + box.left},${y + box.top}`); break; }
      }
    }
  }
  // a run's rows become what lies either side of it, blended across (white to
  // white, or the picture's faint shadow fading to white under 813–821); on
  // the foot edge, the row above
  let cleared = 0;
  for (const [a, b] of BANDS) {
    const below = b + 1 < info.height - 4 ? b + 1 : a - 1;
    for (let y = a; y <= Math.min(b, info.height - 1); y++) {
      const t = below === a - 1 ? 0 : (y - (a - 1)) / (below - (a - 1));
      for (let x = 4; x < info.width - 4; x++) {
        const i = idx(x, y);
        const inPill = y >= 1014 - box.top && y <= 1019 - box.top && x >= PILL.x0 && x <= PILL.x1;
        const m = idx(x, PILL.axis - y), u = idx(x, a - 1), d = idx(x, below);
        const [r, g, bl] = inPill
          ? [data[m], data[m + 1], data[m + 2]]
          : [0, 1, 2].map((k) => Math.round(data[u + k] + t * (data[d + k] - data[u + k])));
        if (data[i] !== r || data[i + 1] !== g || data[i + 2] !== bl) cleared++;
        [data[i], data[i + 1], data[i + 2]] = [r, g, bl];
      }
      // the card's left and right edges, where a run crossed them
      for (let k = 0; k < 4; k++) {
        const l = idx(k, y), r = idx(info.width - 1 - k, y);
        [data[l], data[l + 1], data[l + 2]] = EDGE[k];
        [data[r], data[r + 1], data[r + 2]] = EDGE[k];
      }
    }
  }
  // the foot edge, 1147–1150, under the last run
  for (let k = 0; k < 4; k++) {
    const y = info.height - 1 - k;
    for (let x = k; x < info.width - k; x++) {
      const i = idx(x, y);
      [data[i], data[i + 1], data[i + 2]] = EDGE[k];
    }
  }
  const clean = await sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toBuffer();
  // keep the clean card at the board's own size too, for checking by eye
  // (not part of the page): run with --keep
  if (process.argv.includes('--keep')) await sharp(clean).toFile(`${BOARDS}/cleanup-card.png`);
  // Large on the feed: the card at 1002px (×1.84 — the board renders it at the
  // feed's own density, so on the page it is shown no larger than its pixels),
  // 36px of feed either side, centred in the feed under the chrome.
  const width = 1002;
  const big = await card(clean, { left: 0, top: 0, width: info.width, height: info.height }, width);
  const left = Math.round((W - width) / 2);
  const top = Math.round(CHROME_H + (FOOT - CHROME_H - big.height) / 2);
  await save(
    'cleanup',
    [
      { input: await region(`${DIR}/after.png`, 0, 0, W, CHROME_H), left: 0, top: 0 },
      { input: big.buf, left, top },
      ...(await frame()),
    ],
    FEED
  );
  // each zone's middle on the board, from its dashed box
  const zone = (y) => at(top + (y - box.top) * big.scale);
  report.cleanup = {
    scale: big.scale.toFixed(3),
    cleared,
    mirrorOff,
    touching,
    'Product comprehension (the picture, 268–812)': zone(540),
    'Comprehension (the chips, 821–888)': zone(855),
    'Price (price and timer, 893–1014)': zone(953),
    'Quality (rating and Trusted, 1019–1092)': zone(1056),
    'Fast programme (delivery, 1100–1143)': zone(1121),
  };
}

console.log(JSON.stringify(report, null, 2));
