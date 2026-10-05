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
//            the feed carrying on below them; the board shows one kurti three
//            times, so the one-fact and two-fact cards take two other kurtis
//            from the realistic prototype's catalogue (scripts/plp-photos.mjs;
//            Uttham, 2026-10-04: "the images are repititive … take it from
//            prototype porject"), their words, prices and chrome untouched
//   list     list view by category: the list-view screen only (the grid
//            control and the variant labels dropped), each row with its own
//            prices (the board repeats one set on all four)
//   date     dates on fast deliveries: the winning card only (Fast and a day
//            count), in the new feed in place of the same kurti's card, so it
//            stands among cards that are not fast and carry no date
//
// Re-runnable: the boards are the source, the outputs are overwritten; the
// catalogue photos are fetched once into .clip-work/ (untracked) when missing.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { PHOTOS, EARBUDS, photoFile } from './plp-photos.mjs';

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

// A catalogue photo in a board card's picture box. On the titles board each
// card (180 × 254 with its 1px #EAEAF2 edge) holds its picture at x 2–177,
// y 1–177, with a white column either side of it and a white row under it,
// and a wishlist heart over its top right: an opaque white disc 24px across,
// centred at (158.25, 20), its outlined heart within 10px of the centre. The
// photo is scaled (cover) straight into that box at the card's composed size,
// so it is the catalogue's own pixels rather than a 1× render scaled up. The
// white column and row beside it are the board's white again (scaling had
// left the old photo's tint in their first pixels, a faint line against a
// white-backed photo). The heart goes back over it: its disc drawn white at
// its own size, so its rim blends with the new photo, and its icon the
// board's own pixels, scaled with the card and cut round inside the disc.
// Everything outside the box — the words, chips, price, rating and edges —
// stays the board's.
const BOX = { x0: 2, x1: 178, y0: 1, y1: 178 };
const HEART = { cx: 158.25, cy: 20, r: 12, icon: 10.5 };
const withPhoto = async (c, photo) => {
  const s = c.scale;
  const left = Math.round(BOX.x0 * s), top = Math.round(BOX.y0 * s);
  const right = Math.round(BOX.x1 * s), foot = Math.round(BOX.y1 * s);
  const width = right - left, height = foot - top;
  const pic = await sharp(await photoFile(photo))
    .extract(photo.crop)
    .resize(width, height, { fit: 'cover', kernel: KERNEL })
    .removeAlpha()
    .png()
    .toBuffer();
  const white = { r: 255, g: 255, b: 255 };
  const gap = Math.ceil(s); // the board's 1px white column / row, scaled
  const cx = HEART.cx * s, cy = HEART.cy * s;
  const hl = Math.floor(cx - HEART.r * s - 2), ht = Math.floor(cy - HEART.r * s - 2), side = Math.ceil(2 * HEART.r * s + 4);
  const disc = Buffer.from(`<svg width="${side}" height="${side}"><circle cx="${cx - hl}" cy="${cy - ht}" r="${HEART.r * s}" fill="#fff"/></svg>`);
  const region = await sharp(c.buf).extract({ left: hl, top: ht, width: side, height: side }).ensureAlpha().png().toBuffer();
  const mask = Buffer.from(`<svg width="${side}" height="${side}"><circle cx="${cx - hl}" cy="${cy - ht}" r="${HEART.icon * s}" fill="#fff"/></svg>`);
  const icon = await sharp(region).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  const buf = await sharp(c.buf)
    .composite([
      { input: pic, left, top },
      { input: await rect(gap, foot + gap - top, white), left: right, top },
      { input: await rect(right + gap - left, gap, white), left, top: foot },
      { input: disc, left: hl, top: ht },
      { input: icon, left: hl, top: ht },
    ])
    .png()
    .toBuffer();
  return { ...c, buf };
};

// ---- titles: the four cards in a 2 × 2 grid ---------------------------------
// titles.png (978 × 478): four cards 180px wide with their 1px #EAEAF2 edge, at
// x 100, 295, 490 and 698; the three kurtis 254px tall from y 100, the Dove
// card 278px. In the board's order, read as a feed reads: the seller's title
// and one fact on the first row, two facts and the Ad · Mall card on the
// second. Each card is scaled to the feed's column (×2.98) at its own height;
// cards in a column abut, so their edges make the feed's gutter. Under them the
// feed carries on with the next cards from after.png, the orange and the black
// kurti, as a feed does below the fold.
// On the board the three kurti cards share one photo, the yellow kurti, which
// in a feed reads as one product repeated (Uttham, 2026-10-04: "the images are
// repititive"). The seller's-title card keeps his yellow kurti; the one-fact
// card ("Kurti") takes the prototype's teal printed anarkali and the two-fact
// card ("Kurti", "Cotton") its grey-and-white printed A-line — kurtis, so
// every chip stays true, in colours apart from the yellow beside them and the
// orange and black below.
{
  const src = `${BOARDS}/titles.png`;
  const kurti = (x) => ({ left: x, top: 100, width: 180, height: 254 });
  const [title, oneBoard, twoBoard, mall] = await Promise.all([
    card(src, kurti(100), COL_W),
    card(src, kurti(295), COL_W),
    card(src, kurti(490), COL_W),
    card(src, { left: 698, top: 100, width: 180, height: 278 }, COL_W),
  ]);
  const one = await withPhoto(oneBoard, PHOTOS.teal);
  const two = await withPhoto(twoBoard, PHOTOS.grey);
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

// ---- the list rows' prices --------------------------------------------------
// On the board all four list rows carry one set of prices: ₹384 over ₹420
// struck and "7% off" on the green UPI chip, "₹410 with CASH" under it. Each
// row now shows its own, varied on Uttham's request (2026-10-05: "can you
// randomise the price values realistic ones, for both UPI and cash prices"):
// budget earbuds, the UPI price under a struck MRP, the discount worked out
// from the two, and the cash price a little above the UPI one, as his board
// has it. Fixed here rather than drawn at random, so a re-run gives the same
// screen.
const LIST_PRICES = [
  { upi: 312, mrp: 399, cash: 334 }, // row 1, the i12 pair
  { upi: 587, mrp: 799, cash: 619 }, // row 2, the white pair (out of stock)
  { upi: 268, mrp: 299, cash: 285 }, // row 3, the black pair
  { upi: 673, mrp: 999, cash: 711 }, // row 4, the gaming pair
];
const offOf = (p) => Math.round((100 * (p.mrp - p.upi)) / p.mrp);

// The figures are redrawn on the board's own 1× crop, before the ×3 scale, so
// they pass through the same Lanczos as every other letter on the screen and
// are exactly as soft. The board sets Mier B, Meesho's typeface, at 15/16 of
// its sizes: the UPI price 15px Demi #353543; the MRP 11.25px Book #8B8BA3,
// struck by a 0.75px line from its origin to its advance; the discount
// 11.25px Book #038D63; the cash price 11.25px Demi #616173, then "with CASH"
// in Book. Sizes, origins and the strike were fitted to his pixels (each run
// rendered 8× over, averaged down, and matched to 1/8px), and the gaps between
// runs are his: 4.54px after the price, 4.46px after the MRP, 2.71px after the
// cash price. Coordinates are the 360 × 720 crop's, for row 1; the other rows
// are the same block 138, 276 and 432px lower. Under the figures his
// background goes back first: the chip's colour column by column (its gradient
// runs left to right, so each column is one colour from its top edge to its
// foot, read from the chip's rows above and below the text), and white under
// the cash line. "UPI" and the chip's right end are not touched.
// Needs Mier B02 installed (macOS: ~/Library/Fonts); librsvg finds it through
// fontconfig, and the script checks the face it got by one advance.
const ROW_DY = [0, 138, 276, 432];
const PRICE_LINE = { x0: 142, x1: 300, y0: 157, y1: 174, chipRows: [156, 157, 158, 159, 160, 172, 173, 174, 175] };
const CASH_LINE = { x0: 142, x1: 300, y0: 178, y1: 196 };
const RUN = {
  upi: { weight: 600, size: 15, ink: '#353543', x: 144, y: 172 },
  mrp: { weight: 400, size: 11.25, ink: '#8B8BA3', gap: 4.54, y: 171, strike: { top: 167.875, height: 0.75, trim: 0.125 } },
  off: { weight: 400, size: 11.25, ink: '#038D63', gap: 4.46, y: 171.125 },
  cash: { weight: 600, size: 11.25, ink: '#616173', x: 144, y: 191.125 },
  cashWords: { weight: 400, size: 11.25, ink: '#616173', gap: 2.71, y: 191.125, text: 'with CASH' },
};
const svgText = (text, run, x, y, k, anchor = 'start') =>
  `<text x="${x * k}" y="${y * k}" font-family="Mier B02" font-weight="${run.weight}" font-size="${run.size * k}" fill="${run.ink ?? '#000'}" text-anchor="${anchor}">${text}</text>`;
// a run's advance as librsvg lays it out: the run set from a point and set to
// end at it, and the distance between the two inks' centroids
const advanceOf = async (text, run) => {
  const k = 16, half = Math.ceil(run.size * text.length) * k, h = Math.ceil(run.size * 2) * k;
  const centroid = async (anchor) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${2 * half}" height="${h}">${svgText(text, run, half / k, run.size * 1.5, k, anchor)}</svg>`;
    const { data, info } = await sharp(Buffer.from(svg)).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
    let mass = 0, moment = 0;
    for (let i = 0; i < data.length; i++) { mass += data[i]; moment += data[i] * (i % info.width); }
    return moment / mass;
  };
  return ((await centroid('start')) - (await centroid('end'))) / k;
};
// repaints the four rows' prices into the crop's raw pixels, in place
const repriceList = async (px, info) => {
  const ch = info.channels;
  const idx = (x, y) => (y * info.width + x) * ch;
  const K = 8;
  for (const [row, dy] of ROW_DY.entries()) {
    const p = LIST_PRICES[row];
    // his background, back under both lines
    const L = PRICE_LINE;
    for (let x = L.x0; x <= L.x1; x++) {
      const chip = [0, 1, 2].map((c) => {
        const v = L.chipRows.map((y) => px[idx(x, y + dy) + c]).sort((a, b) => a - b);
        return v[v.length >> 1];
      });
      for (let y = L.y0 + dy; y <= L.y1 + dy; y++) for (let c = 0; c < 3; c++) px[idx(x, y) + c] = chip[c];
    }
    for (let y = CASH_LINE.y0 + dy; y <= CASH_LINE.y1 + dy; y++)
      for (let x = CASH_LINE.x0; x <= CASH_LINE.x1; x++) for (let c = 0; c < 3; c++) px[idx(x, y) + c] = 255;
    // the runs, laid out as his are
    const upi = `₹${p.upi}`, mrp = `₹${p.mrp}`, off = `${offOf(p)}% off`, cash = `₹${p.cash}`;
    const mrpX = RUN.upi.x + (await advanceOf(upi, RUN.upi)) + RUN.mrp.gap;
    const mrpW = await advanceOf(mrp, RUN.mrp);
    const offX = mrpX + mrpW + RUN.off.gap;
    const offEnd = offX + (await advanceOf(off, RUN.off));
    if (offEnd > 318) throw new Error(`list row ${row + 1}: "${off}" would reach the UPI tag`);
    const wordsX = RUN.cash.x + (await advanceOf(cash, RUN.cash)) + RUN.cashWords.gap;
    // drawn 8× over a box from the price line's top to the cash line's foot,
    // then averaged down to the crop's pixels and laid over his background
    const box = { x: L.x0, y: L.y0 + dy, w: L.x1 - L.x0 + 1, h: CASH_LINE.y1 - L.y0 + 1 };
    const t = (text, run, x, y) => svgText(text, run, x - box.x, y + dy - box.y, K);
    const s = RUN.mrp.strike;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${box.w * K}" height="${box.h * K}">${[
      t(upi, RUN.upi, RUN.upi.x, RUN.upi.y),
      t(mrp, RUN.mrp, mrpX, RUN.mrp.y),
      `<rect x="${(mrpX - box.x) * K}" y="${(s.top + dy - box.y) * K}" width="${(mrpW - s.trim) * K}" height="${s.height * K}" fill="${RUN.mrp.ink}"/>`,
      t(off, RUN.off, offX, RUN.off.y),
      t(cash, RUN.cash, RUN.cash.x, RUN.cash.y),
      t(RUN.cashWords.text, RUN.cashWords, wordsX, RUN.cashWords.y),
    ].join('')}</svg>`;
    const { data: hi, info: hiInfo } = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let y = 0; y < box.h; y++) for (let x = 0; x < box.w; x++) {
      let a = 0; const c3 = [0, 0, 0];
      for (let j = 0; j < K; j++) for (let i = 0; i < K; i++) {
        const o = ((y * K + j) * hiInfo.width + x * K + i) * 4, al = hi[o + 3];
        a += al; for (let c = 0; c < 3; c++) c3[c] += al * hi[o + c];
      }
      if (!a) continue;
      const n = K * K * 255, o = idx(box.x + x, box.y + y);
      for (let c = 0; c < 3; c++) px[o + c] = Math.round(px[o + c] * (1 - a / n) + c3[c] / n);
    }
  }
};

// ---- list: the list-view screen alone ---------------------------------------
// list.png (981 × 963): two phone crops under purple variant labels; the list
// view is x 521–880, y 164–884 inside its 1px #CECEDE frame. Its rows 164–883
// are exactly 1 : 2 (360 × 720), scaled ×3; the frame's foot (row 884) is
// redrawn at the bottom, so nothing is stretched. Its prices are each row's
// own (above); without Mier B02 the screen is left as it was last composed.
list: {
  const crop = await sharp(`${BOARDS}/list.png`)
    .extract({ left: 521, top: 164, width: 360, height: 720 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  // Mier B02 Book sets "₹420" at 11.25px 26.415px wide; any other face misses
  const probe = await advanceOf('₹420', RUN.mrp);
  if (Math.abs(probe - 26.415) > 0.05) {
    console.warn(`list.png not written: librsvg did not find Mier B02 ("₹420" set ${probe.toFixed(3)}px wide, not 26.415)`);
    report.list = 'skipped: Mier B02 not installed';
    break list;
  }
  await repriceList(crop.data, crop.info);
  const buf = await sharp(crop.data, { raw: { width: crop.info.width, height: crop.info.height, channels: crop.info.channels } })
    .resize({ width: W, height: H, kernel: KERNEL })
    .png()
    .toBuffer();
  // Rows 2–4 show three different earbuds, not his one i12 photo four times
  // (Uttham, 2026-10-04: "the images are repititive … go to meesho.com and
  // take images from there"). Each row's photo is a 409px square at x 0–408
  // (rows at y 714, 1154, 1659); only that square changes. His wishlist heart
  // (a 245-white disc, radius 35, centred at x 348) and row 2's OUT OF STOCK
  // label are put back from his own pixels, and row 2's photo takes the same
  // white wash his out-of-stock row has.
  const BOX = 409;
  const rowsOut = [
    { photo: EARBUDS.white, top: 714, heart: 776, wash: 0.45 },
    { photo: EARBUDS.black, top: 1154, heart: 1190 },
    { photo: EARBUDS.gaming, top: 1659, heart: 1658 },
  ];
  const disc = Buffer.from(`<svg width="76" height="76"><circle cx="38" cy="38" r="35.5" fill="#fff"/></svg>`);
  const layers = [{ input: buf, left: 0, top: 0 }];
  for (const r of rowsOut) {
    // the square the row shows: the photo's top 88%, centred, so the listing
    // stamp meesho.com prints in each photo's bottom-left corner stays out
    const file = await photoFile(r.photo);
    const { width: pw, height: ph } = await sharp(file).metadata();
    const side = Math.min(pw, Math.round(ph * 0.88));
    const square = { left: Math.round((pw - side) / 2), top: 0, width: side, height: side };
    layers.push({ input: await sharp(file).extract(square).resize({ width: BOX, height: BOX, kernel: KERNEL }).png().toBuffer(), left: 0, top: r.top });
    if (r.wash) layers.push({ input: await sharp({ create: { width: BOX, height: BOX, channels: 4, background: { r: 255, g: 255, b: 255, alpha: r.wash } } }).png().toBuffer(), left: 0, top: r.top });
    const heart = await sharp(buf).extract({ left: 348 - 38, top: r.heart - 38, width: 76, height: 76 }).composite([{ input: disc, blend: 'dest-in' }]).png().toBuffer();
    layers.push({ input: heart, left: 348 - 38, top: r.heart - 38 });
  }
  const pill = Buffer.from(`<svg width="370" height="76"><rect x="1" y="1" width="368" height="74" rx="16" fill="#fff"/></svg>`);
  layers.push({ input: await sharp(buf).extract({ left: 20, top: 880, width: 370, height: 76 }).composite([{ input: pill, blend: 'dest-in' }]).png().toBuffer(), left: 20, top: 880 });
  layers.push({ input: await rect(W, 3, FRAME), left: 0, top: FOOT });
  await save('list', layers);
  // on the board: the first row's middle at y 330, the third row's chips at 580
  report.list = {
    scale: '3.000',
    'first row': at((330 - 164) * 3),
    'third row': at((580 - 164) * 3),
    prices: LIST_PRICES.map((p) => `₹${p.upi} ₹${p.mrp} ${offOf(p)}% off UPI · ₹${p.cash} with CASH`),
  };
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
  // The card alone on the feed, no search bar or filter row (Uttham,
  // 2026-10-03: "remove the search and filter bar"): 940px wide (×1.73 — the
  // board renders it at the feed's own density, so on the page it is shown no
  // larger than its pixels), 70px of feed either side, centred in the screen.
  const width = 940;
  const big = await card(clean, { left: 0, top: 0, width: info.width, height: info.height }, width);
  const left = Math.round((W - width) / 2);
  const top = Math.round(3 + (FOOT - 3 - big.height) / 2);
  // saved as framework.png (the cleanup state maps to it): a new name, so no
  // browser keeps showing the earlier composition with the search bar
  await save('framework', [{ input: big.buf, left, top }, ...(await frame())], FEED);
  // where each note's line starts: on the element it names, or in the card's
  // white margin just left of it (board coordinates), as shares of the screen
  const pt = (x, y) => ({ x: ((left + (x - box.left) * big.scale) / W).toFixed(3), y: at(top + (y - box.top) * big.scale) });
  report.cleanup = {
    scale: big.scale.toFixed(3),
    cleared,
    mirrorOff,
    touching,
    'Product comprehension (on the left kurti)': pt(700, 540),
    'Comprehension (left of the chips)': pt(638, 858),
    'Price (left of the price)': pt(638, 926),
    'Quality (left of the rating)': pt(638, 1057),
    'Fast programme (left of the delivery line)': pt(638, 1124),
  };
}

console.log(JSON.stringify(report, null, 2));
