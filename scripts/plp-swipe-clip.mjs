// The swipeable-images screen of the product-cards case study, alive: a clip
// for the 'scroll' row ("Swipeable images", card title "More views and
// variations") on /work/a-line-of-card-height (Uttham, 2026-10-03: "Swipeable
// images in the prototype please mock by moving images, it only there on one
// card, I want to move it for other 1 or 2 products atleast . find similar
// images from the product repo").
//
//   node scripts/plp-swipe-clip.mjs            (macOS: it encodes with
//                                               scripts/frames-to-mp4.swift)
//
// WHAT IT IS MADE OF. The feed is Uttham's own capture, src/assets/plp/
// scroll.png (1080 × 2820, the Kurti results scrolled one row under the search
// bar and filter row), seen through a 1 : 2 window (1080 × 2160) that pans
// gently down the page and back, so the whole capture is seen and the clip
// ends where it began. Three of its cards swipe their picture, one at a time,
// so the eye can follow: the first card (row 1, left) while the window is at
// the top; then, panned to the foot, the right card of row 2 and the left card
// of row 3. Each slides to a second picture and back, the way an iOS paging
// scroll view settles — a critically damped spring, no bounce — and the
// carousel dots under the picture follow: the dot for the page on show darkens
// as the swipe begins, moves to the second dot as the picture passes halfway,
// and fades back once the card is at rest, so the clip's first and last
// frames are the same. The wishlist heart and the dots pill stay put over the
// sliding pictures (the heart is a masked copy of the feed's own pixels; the
// pill is redrawn at its measured geometry only while a card is moving).
//
// A FEED OF DIFFERENT KURTIS (Uttham, 2026-10-04: "In the first project
// teaser, the images are repititive can we use other images to make the image
// output realistic take it from prototype porject"). His capture shows one
// yellow kurti on all eight cards, so six of them take other kurtis from the
// realistic prototype's catalogue (scripts/plp-photos.mjs): row 1 right the
// teal anarkali, row 2 the grey-and-white A-line and the black anarkali, row 3
// the ivory print and the short green-and-navy kurti, row 4 left the red
// A-line. The first card and row 4 right keep his yellow kurti, so the two
// never stand in one window except as row 1's last 60px over row 4's heads at
// the foot. Every card reads "Cotton" over a kurti, so every chip stays true.
// Only each card's 528 × 531 picture box changes, and only below the chrome
// (row 1's boxes run 111px under it) and above the capture's foot rule: the
// dots pill goes back on as his own pixels, cut to its rounded shape, and the
// heart as his own pixels too, re-tinted to the new photo, because its disc is
// about 77% white over the picture (each pixel moves by the change in the
// background under it, times what the disc lets through).
//
// THE SECOND PICTURES, from the same catalogue: the first card (his yellow
// kurti) swipes to the red printed A-line, a kurti in another colour; the
// black anarkali and the ivory print swipe to their own back views — "more of
// the product and the variations it comes in", as the row says. Every photo
// is cropped square, the model's head in and the corner stamp out, and scaled
// to the card's own picture box, never outside it. Under his yellow kurti's
// pill his photo is unknown, so where the sliding picture carries the pill
// away that small patch is filled from its surroundings (its rows
// interpolated from the rows above and below it); the replaced cards' photos
// are whole, so nothing needs filling there.
//
// OUTPUT. Frames are rendered at 1080 × 2160 and encoded at 720 × 1440,
// 30 fps, H.264 with the moov atom first: public/media/plp/swipe.mp4. The
// poster, src/assets/plp/swipe.png (1080 × 2160), is the clip's first frame,
// which is also its last, so the page's still is both what the clip opens on
// and what it settles on. Re-runnable: the capture and the photos are the
// source, the outputs are overwritten; the photos are fetched once into
// .clip-work/plp-photos/ (untracked) when missing. Run `npm run clip-edges`
// afterwards so the handset's strips follow the clip's frames.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PHOTOS as CATALOGUE, photoFile } from './plp-photos.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = `${root}src/assets/plp/scroll.png`;
const POSTER = `${root}src/assets/plp/swipe.png`;
const CLIP_DIR = `${root}public/media/plp`;
const CLIP = `${CLIP_DIR}/swipe.mp4`;
const WORK = `${root}.clip-work/plp-swipe`;
const FRAMES = `${WORK}/frames`;
const ENCODER = `${root}scripts/frames-to-mp4.swift`;

const FPS = 30;
const W = 1080, H = 2160; // the window: the exports' own 1 : 2
const OUT_W = 720, OUT_H = 1440; // the encode
const BITRATE = 600_000; // the encoder lands 15–25% over this: ~9 s in 800–860 KB
const KERNEL = 'lanczos3';

// ---- the capture's geometry (measured 2026-10-03) ---------------------------
// A 3px frame rule (#CECEDE) all round; the search bar and the Sort / Category /
// Price / Filters row in rows 0–299; then two columns of cards on #EAEAF2, with
// 9px gutters between rows. Every card's picture is a 528 × 531 box — x 6–533
// in the left column, 546–1073 in the right (the #EAEAF2 either side of it is
// the card's own edge and the gutter, one colour); the first row's boxes start
// at y 189, their top 111 rows under the chrome (the feed is scrolled), and the
// gutters put the next rows' boxes at y 954, 1719 and 2544 on the left and
// 1014, 1779 and 2544 on the right (measured 2026-10-04); the fourth row runs
// on past the capture's foot rule (rows 2817–2819). Under each picture, 186px
// in and 483px down its box, a white pill, 159 × 30, holds four 22.4 × 12 dots
// (#CECEDE) 35.7 apart; a card with a wishlist heart has it as a 72px disc
// centred 468.5px in and 56.5px down its box, about 77% white over the photo.
const CARD_W = 528, CARD_H = 531;
const PILL = { w: 159, h: 30, dotX: 18.2, dotPitch: 35.7, dotW: 22.4, dotH: 12, dotY: 9 };
const DOT = { rest: [0xce, 0xce, 0xde], on: [0x61, 0x61, 0x73] }; // his dot grey; the icon ink of his heart
const HEART_R = 36;
const CHROME = 300; // rows 0–299: the search bar and filter row, over row 1's boxes
const FOOT_RULE = 2817; // the capture's 3px foot rule starts here
const LEFT = 6, RIGHT = 546;
const box = (x, top) => ({
  x,
  top,
  seen: Math.max(top, CHROME),
  pill: top + 483 + PILL.h <= FOOT_RULE ? { x: x + 186, y: top + 483 } : null,
  heart: top + 56.5 - HEART_R >= CHROME && top + 56.5 + HEART_R <= FOOT_RULE ? { cx: x + 468.5, cy: top + 56.5 } : null,
});

// the feed: a kurti per card, from the prototype's catalogue, or his own
// yellow kurti where `photo` is absent
const FEED = [
  { name: 'row 1 left', ...box(LEFT, 189) },
  { name: 'row 1 right', ...box(RIGHT, 189), photo: CATALOGUE.teal },
  { name: 'row 2 left', ...box(LEFT, 954), photo: CATALOGUE.grey },
  { name: 'row 2 right', ...box(RIGHT, 1014), photo: CATALOGUE.black },
  { name: 'row 3 left', ...box(LEFT, 1719), photo: CATALOGUE.ivory },
  { name: 'row 3 right', ...box(RIGHT, 1779), photo: CATALOGUE.navy },
  { name: 'row 4 left', ...box(LEFT, 2544), photo: CATALOGUE.red },
  { name: 'row 4 right', ...box(RIGHT, 2544) },
];
const feedCard = (name) => FEED.find((c) => c.name === name);

// the three cards that swipe, and the picture each swipes to
const CARDS = [
  { ...feedCard('row 1 left'), to: CATALOGUE.red },
  { ...feedCard('row 2 right'), to: CATALOGUE.blackBack },
  { ...feedCard('row 3 left'), to: CATALOGUE.ivoryBack },
];

// ---- the timeline (seconds) --------------------------------------------------
// One swipe sequence per card: the dot wakes, the picture slides to photo 2,
// holds, slides back, the dot sleeps. Between the top and the foot a pan.
const SWIPE = 0.5, HOLD = 0.6, DOT_IN = 0.13, DOT_OUT = 0.3;
const SEQ = SWIPE + HOLD + SWIPE; // 1.6
const PAN_T = 1.2;
const T = {
  a: 0.25, // row 1 left, at the top
  panDown: 0.25 + SEQ + DOT_OUT, // 2.15
  b: 0.25 + SEQ + DOT_OUT + PAN_T + 0.25, // 3.6
  c: 0.25 + SEQ + DOT_OUT + PAN_T + 0.25 + SEQ + DOT_OUT + 0.1, // 5.6
};
T.panUp = T.c + SEQ + DOT_OUT; // 7.5
const DURATION = T.panUp + PAN_T + 0.3; // 9.0
const FRAMES_N = Math.round(DURATION * FPS);
const PAN = (await sharp(SRC).metadata()).height - H; // 660: what lies under the window

// a critically damped spring from rest to the next page, released with half
// its natural velocity (a flick), settled by SWIPE
const OMEGA = 16;
const spring = (u) => (u <= 0 ? 0 : u >= SWIPE ? 1 : 1 - (1 + 0.5 * OMEGA * u) * Math.exp(-OMEGA * u));
const easeInOut = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// where a card's picture stands (0 = photo 1, 1 = photo 2) and how awake its
// dot is, at time t, for a sequence that starts at s
const stateAt = (t, s) => {
  const u = t - s;
  let p = 0;
  if (u >= 0 && u < SWIPE) p = spring(u);
  else if (u >= SWIPE && u < SWIPE + HOLD) p = 1;
  else if (u >= SWIPE + HOLD && u < SEQ) p = 1 - spring(u - SWIPE - HOLD);
  let dot = 0;
  if (u >= -DOT_IN && u < 0) dot = (u + DOT_IN) / DOT_IN;
  else if (u >= 0 && u < SEQ) dot = 1;
  else if (u >= SEQ && u < SEQ + DOT_OUT) dot = 1 - (u - SEQ) / DOT_OUT;
  return { p, dot: clamp01(dot) };
};
const panAt = (t) => {
  if (t < T.panDown) return 0;
  if (t < T.panDown + PAN_T) return Math.round(PAN * easeInOut((t - T.panDown) / PAN_T));
  if (t < T.panUp) return PAN;
  if (t < T.panUp + PAN_T) return Math.round(PAN * (1 - easeInOut((t - T.panUp) / PAN_T)));
  return 0;
};

// ---- sources -----------------------------------------------------------------
const orig = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const PW = orig.info.width, PH = orig.info.height;
if (PW !== W) throw new Error(`${SRC} is ${PW} wide, not ${W}`);
if (PH < FOOT_RULE + 3) throw new Error(`${SRC} is ${PH} tall; its foot rule was measured at ${FOOT_RULE}`);
const px = (buf, w, x, y) => { const i = (y * w + x) * 3; return [buf[i], buf[i + 1], buf[i + 2]]; };
const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));

// a catalogue photo, cropped square and scaled to the picture box, never
// outside it (the box is 3px short of square, so the cover fit trims that much)
const photoOf = async (photo) =>
  sharp(await photoFile(photo)).extract(photo.crop).resize(CARD_W, CARD_H, { fit: 'cover', kernel: KERNEL }).removeAlpha().raw().toBuffer();

// ---- the feed: a different kurti per card ----------------------------------
// The heart's disc lets about a fifth of the photo through (measured on his
// capture: (250 − 230) / (255 − 230) on its left, (248 − 218) / (255 − 218) on
// its right), its outline is opaque ink (97, 97, 115), and its rim is 1px soft
// at a 36px radius. Over a new photo each pixel moves by the change in the
// backdrop times what the disc lets through there: none of the photo where the
// ink is, a fifth where the disc is white, all of it outside the rim. His
// backdrop under the disc is unknown, so it is taken as the ring round it.
// The rim is read off his pixels instead of the circle: how much white each
// rim pixel carries over the backdrop just outside it, at the same angle,
// is how much it lays over the new photo (a drawn circle's rim sat a fraction
// of a pixel off his and left a faint grey ring on a white photo).
const HEART_A = 0.8;
const RIM = HEART_R - 4; // from here out, the rim's white is read off his pixels
const FILL_SUM = 745, INK_SUM = 309; // the disc's white and the heart's ink, as r + g + b
const ringOf = (heart) => {
  const sum = [0, 0, 0];
  let n = 0;
  for (let y = Math.floor(heart.cy - 47); y <= Math.ceil(heart.cy + 47); y++) {
    for (let x = Math.floor(heart.cx - 47); x <= Math.ceil(heart.cx + 47); x++) {
      const d = Math.hypot(x + 0.5 - heart.cx, y + 0.5 - heart.cy);
      if (d < HEART_R + 3 || d > HEART_R + 10) continue;
      const c = px(orig.data, PW, x, y);
      sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2]; n++;
    }
  }
  return sum.map((v) => v / n);
};
const base = { data: Buffer.from(orig.data), info: orig.info };
const pills = [];
for (const card of FEED) {
  if (!card.photo) continue;
  card.photoData = await photoOf(card.photo);
  // the picture, from under the chrome to the foot rule
  for (let y = card.seen; y < Math.min(card.top + CARD_H, FOOT_RULE); y++) {
    card.photoData.copy(base.data, (y * PW + card.x) * 3, (y - card.top) * CARD_W * 3, ((y - card.top) * CARD_W + CARD_W) * 3);
  }
  // the heart, his pixels re-tinted to the photo now under them
  if (card.heart) {
    const { cx, cy } = card.heart;
    const bg = ringOf(card.heart);
    for (let y = Math.floor(cy - HEART_R - 2); y <= Math.ceil(cy + HEART_R + 2); y++) {
      for (let x = Math.floor(cx - HEART_R - 2); x <= Math.ceil(cx + HEART_R + 2); x++) {
        const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
        if (d > HEART_R + 1.5) continue;
        const his = px(orig.data, PW, x, y);
        const photo = px(card.photoData, CARD_W, x - card.x, y - card.top);
        const i = (y * PW + x) * 3;
        if (d > RIM) {
          // the white this rim pixel carries over the backdrop just outside it
          const out = px(orig.data, PW, Math.floor(cx + (dx / d) * (HEART_R + 4)), Math.floor(cy + (dy / d) * (HEART_R + 4)));
          const white = [0, 1, 2].reduce((s, k) => s + (his[k] - out[k]) / Math.max(1, 255 - out[k]), 0) / 3;
          const w = Math.min(1, Math.max(0, white));
          for (let k = 0; k < 3; k++) base.data[i + k] = clamp255(photo[k] + (255 - photo[k]) * w);
          continue;
        }
        const ink = Math.min(1, Math.max(0, (FILL_SUM - his[0] - his[1] - his[2]) / (FILL_SUM - INK_SUM)));
        const a = HEART_A + (1 - HEART_A) * ink;
        for (let k = 0; k < 3; k++) base.data[i + k] = clamp255(his[k] + (photo[k] - bg[k]) * (1 - a));
      }
    }
  }
  // the dots pill, his pixels, cut to its rounded shape
  if (card.pill) {
    const region = await sharp(orig.data, { raw: { width: PW, height: PH, channels: 3 } })
      .extract({ left: card.pill.x, top: card.pill.y, width: PILL.w, height: PILL.h })
      .ensureAlpha()
      .png()
      .toBuffer();
    const mask = Buffer.from(`<svg width="${PILL.w}" height="${PILL.h}"><rect width="${PILL.w}" height="${PILL.h}" rx="${PILL.h / 2}" fill="#fff"/></svg>`);
    pills.push({ input: await sharp(region).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer(), left: card.pill.x, top: card.pill.y });
  }
}
if (pills.length) {
  const withPills = await sharp(base.data, { raw: { width: PW, height: PH, channels: 3 } }).composite(pills).removeAlpha().raw().toBuffer();
  withPills.copy(base.data);
}

// his yellow kurti's picture box, with the pill filled in from its
// surroundings, so nothing of it rides along with the slide (the one card of
// his that swipes has no heart in view: row 1's are under the chrome)
const boxOf = (card) => {
  const data = Buffer.alloc(CARD_W * CARD_H * 3);
  for (let y = 0; y < CARD_H; y++) orig.data.copy(data, y * CARD_W * 3, ((card.top + y) * PW + card.x) * 3, ((card.top + y) * PW + card.x + CARD_W) * 3);
  const set = (x, y, c) => { const i = (y * CARD_W + x) * 3; data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; };
  const get = (x, y) => px(data, CARD_W, x, y);
  // the pill: every column a straight blend from the row over it to the row under it
  const p = { x: card.pill.x - card.x - 1, y: card.pill.y - card.top - 1, w: PILL.w + 2, h: PILL.h + 2 };
  for (let x = p.x; x < p.x + p.w; x++) {
    const a = get(x, p.y - 1), b = get(x, p.y + p.h);
    for (let y = p.y; y < p.y + p.h; y++) {
      const k = (y - p.y + 1) / (p.h + 1);
      set(x, y, a.map((v, i) => Math.round(v + (b[i] - v) * k)));
    }
  }
  return data;
};

// the heart as the feed's own pixels, cut round: a 77px square about its
// centre, masked to the disc with a soft 1px edge
const heartOf = async (card) => {
  if (!card.heart) return null;
  const left = Math.round(card.heart.cx - 38.5), top = Math.round(card.heart.cy - 38.5), side = 77;
  const cx = card.heart.cx - left, cy = card.heart.cy - top;
  const region = await sharp(base.data, { raw: { width: PW, height: PH, channels: 3 } }).extract({ left, top, width: side, height: side }).ensureAlpha().png().toBuffer();
  const mask = Buffer.from(`<svg width="${side}" height="${side}"><circle cx="${cx}" cy="${cy}" r="${HEART_R + 1}" fill="#fff"/></svg>`);
  const input = await sharp(region).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
  return { input, left, top };
};

// the dots pill, redrawn at its measured geometry, the active dot `on`
// (0 = at rest, 1 = awake) for the page `page`
const pillOf = (page, on) => {
  const c = DOT.rest.map((v, i) => Math.round(v + (DOT.on[i] - v) * on));
  const hex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('');
  const dots = [0, 1, 2, 3].map((k) => `<rect x="${(PILL.dotX + k * PILL.dotPitch).toFixed(1)}" y="${PILL.dotY}" width="${PILL.dotW}" height="${PILL.dotH}" rx="${PILL.dotH / 2}" fill="${k === page ? hex(c) : hex(DOT.rest)}"/>`).join('');
  return Buffer.from(`<svg width="${PILL.w}" height="${PILL.h}"><rect width="${PILL.w}" height="${PILL.h}" rx="${PILL.h / 2}" fill="#fff"/>${dots}</svg>`);
};

for (const card of CARDS) {
  // photo 1: a catalogue photo whole, or his yellow kurti with its pill filled
  card.box = card.photo ? FEED.find((c) => c.name === card.name).photoData : boxOf(card);
  card.next = await photoOf(card.to);
  card.heartLayer = await heartOf(card);
  card.seenRows = card.top + CARD_H - card.seen; // the rows of the box in view
}

// the two pictures side by side, slid left by `shift` px, cut to the box's
// visible rows: photo 1 at -shift, photo 2 right after it
const slideOf = (card, shift) => {
  const rows = card.seenRows, from = card.seen - card.top;
  const out = Buffer.alloc(CARD_W * rows * 3);
  for (let y = 0; y < rows; y++) {
    const sy = from + y;
    for (let x = 0; x < CARD_W; x++) {
      const gx = x + shift; // the position in the two-page strip
      const src = gx < CARD_W ? card.box : card.next;
      const sx = gx < CARD_W ? gx : gx - CARD_W;
      const si = (sy * CARD_W + sx) * 3, oi = (y * CARD_W + x) * 3;
      out[oi] = src[si]; out[oi + 1] = src[si + 1]; out[oi + 2] = src[si + 2];
    }
  }
  return { input: out, raw: { width: CARD_W, height: rows, channels: 3 }, left: card.x, top: card.seen };
};

// ---- the frames ----------------------------------------------------------------
rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(FRAMES, { recursive: true });
mkdirSync(CLIP_DIR, { recursive: true });
const starts = [T.a, T.b, T.c];
let moving = new Set();
for (let i = 0; i < FRAMES_N; i++) {
  const t = i / FPS;
  const pan = panAt(t);
  const layers = [];
  CARDS.forEach((card, k) => {
    const { p, dot } = stateAt(t, starts[k]);
    const shift = Math.round(p * CARD_W);
    if (shift > 0) {
      layers.push(slideOf(card, shift));
      if (card.heartLayer) layers.push({ ...card.heartLayer });
      moving.add(card.name);
    }
    if (shift > 0 || dot > 0) layers.push({ input: pillOf(p >= 0.5 ? 1 : 0, dot), left: card.pill.x, top: card.pill.y });
  });
  for (const layer of layers) layer.top -= pan; // into the window's own coordinates
  // compositing an overlay with alpha gives the result an alpha channel; drop
  // it, so the frame is the three channels its raw wrapper below says it is
  const { data: frame, info } = await sharp(base.data, { raw: { width: PW, height: PH, channels: 3 } })
    .extract({ left: 0, top: pan, width: W, height: H })
    .composite(layers)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const raw = { width: info.width, height: info.height, channels: info.channels };
  const name = `${FRAMES}/frame-${String(i).padStart(4, '0')}.png`;
  await sharp(frame, { raw }).resize(OUT_W, OUT_H, { kernel: KERNEL }).png({ compressionLevel: 1 }).toFile(name);
  if (i === 0) await sharp(frame, { raw }).png({ compressionLevel: 9 }).toFile(POSTER);
  if (i % FPS === 0) process.stdout.write(`\r${i}/${FRAMES_N} frames`);
}
console.log(`\r${FRAMES_N} frames at ${FPS} fps (${DURATION.toFixed(2)} s); cards that swipe: ${[...moving].join(', ')}`);

// first == last, so the poster is both the opening and the closing frame
const files = readdirSync(FRAMES).filter((f) => f.endsWith('.png')).sort();
const first = readFileSync(`${FRAMES}/${files[0]}`), last = readFileSync(`${FRAMES}/${files[files.length - 1]}`);
console.log(`first frame == last frame: ${first.equals(last) ? 'yes' : 'NO'}`);

// ---- the clip ------------------------------------------------------------------
execFileSync('swift', [ENCODER, FRAMES, CLIP, String(FPS), String(BITRATE)], { stdio: 'inherit' });
// AVAssetWriter leaves a `.sb-…` sidecar beside a file it replaced; keep the folder to the clip
for (const name of readdirSync(CLIP_DIR)) if (name.startsWith('swipe.mp4.sb-')) rmSync(`${CLIP_DIR}/${name}`, { force: true });
execFileSync('swift', [ENCODER, '--info', CLIP], { stdio: 'inherit' });
console.log(`poster ${POSTER.replace(root, '')} (${W}×${H}); clip ${CLIP.replace(root, '')} (${OUT_W}×${OUT_H}). Now: npm run clip-edges`);
