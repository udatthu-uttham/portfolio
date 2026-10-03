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
// of row 3. Each slides to a second photo of a similar product and back, the
// way an iOS paging scroll view settles — a critically damped spring, no
// bounce — and the carousel dots under the picture follow: the dot for the
// page on show darkens as the swipe begins, moves to the second dot as the
// picture passes halfway, and fades back once the card is at rest, so the
// clip's first and last frames are his capture to the pixel. Nothing else in
// the capture is touched: the wishlist heart and the dots pill stay put over
// the sliding pictures (the heart is a masked copy of his own pixels; the pill
// is redrawn at its measured geometry only while a card is moving).
//
// THE SECOND PHOTOS come from the realistic prototype's own product
// catalogue — Meesho's public catalogue photos, which its compiled bundle
// (public/proto/feed-ux/assets/) references by address (Uttham, 2026-10-03:
// public, fine to use). Three kurtis, so each card swipes to another kurti:
// a red printed A-line (5047403), a teal printed anarkali (5038838) and a
// grey-and-white printed A-line (5037151). They are fetched into
// .clip-work/plp-swipe/photos/ (untracked) when missing, then cropped square
// — the model's head in, the stamp in the corner out — and scaled to the
// card's own 528 × 531 image box, never outside it. Under the pill and the
// heart his photo is unknown, so where the sliding picture carries them away
// those small patches are filled from their surroundings (the pill's rows
// interpolated from the rows above and below it, the heart's disc from the
// flat background around it); at rest the original pixels show.
//
// OUTPUT. Frames are rendered at 1080 × 2160 and encoded at 720 × 1440,
// 30 fps, H.264 with the moov atom first: public/media/plp/swipe.mp4. The
// poster, src/assets/plp/swipe.png (1080 × 2160), is the clip's first frame,
// which is also its last, so the page's still is both what the clip opens on
// and what it settles on. Re-runnable: the capture and the photos are the
// source, the outputs are overwritten. Run `npm run clip-edges` afterwards so
// the handset's strips follow the clip's frames.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const SRC = `${root}src/assets/plp/scroll.png`;
const POSTER = `${root}src/assets/plp/swipe.png`;
const CLIP_DIR = `${root}public/media/plp`;
const CLIP = `${CLIP_DIR}/swipe.mp4`;
const WORK = `${root}.clip-work/plp-swipe`;
const PHOTOS = `${WORK}/photos`;
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
// at y 189, their top 111 rows under the chrome (the feed is scrolled). Under
// each picture a white pill, 159 × 30, holds four 22.4 × 12 dots (#CECEDE)
// 35.7 apart; a card with a wishlist heart has it as a 72px disc at the top
// right.
const CARD_W = 528, CARD_H = 531;
const PILL = { w: 159, h: 30, dotX: 18.2, dotPitch: 35.7, dotW: 22.4, dotH: 12, dotY: 9 };
const DOT = { rest: [0xce, 0xce, 0xde], on: [0x61, 0x61, 0x73] }; // his dot grey; the icon ink of his heart
const HEART_R = 36;

// the photos: the prototype's catalogue, by product id (public addresses in
// public/proto/feed-ux/assets/index-*.js), each with its square crop
const PHOTO = {
  red: { id: '5047403', url: 'https://images.meesho.com/images/products/5047403/1.jpg', crop: { left: 29, top: 0, width: 1222, height: 1222 } },
  teal: { id: '5038838', url: 'https://images.meesho.com/images/products/5038838/mvhxc.jpg', crop: { left: 0, top: 0, width: 512, height: 512 } },
  grey: { id: '5037151', url: 'https://images.meesho.com/images/products/5037151/1.jpg', crop: { left: 121, top: 0, width: 1850, height: 1850 } },
};

// the three cards that swipe: the picture box, where it is visible from (the
// first row's is partly under the chrome), its pill, its heart (if seen)
const CARDS = [
  { name: 'row 1 left', x: 6, top: 189, seen: 300, pill: { x: 192, y: 672 }, heart: null, photo: PHOTO.red },
  { name: 'row 2 right', x: 546, top: 1014, seen: 1014, pill: { x: 732, y: 1497 }, heart: { cx: 1014.5, cy: 1070.5 }, photo: PHOTO.teal },
  { name: 'row 3 left', x: 6, top: 1719, seen: 1719, pill: { x: 192, y: 2202 }, heart: { cx: 474.5, cy: 1775.5 }, photo: PHOTO.grey },
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
mkdirSync(PHOTOS, { recursive: true });
for (const photo of Object.values(PHOTO)) {
  photo.file = `${PHOTOS}/${photo.id}.jpg`;
  if (existsSync(photo.file)) continue;
  console.log(`fetching ${photo.url}`);
  const res = await fetch(photo.url);
  if (!res.ok) throw new Error(`${photo.url}: ${res.status}`);
  writeFileSync(photo.file, Buffer.from(await res.arrayBuffer()));
}

const base = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const PW = base.info.width, PH = base.info.height;
if (PW !== W) throw new Error(`${SRC} is ${PW} wide, not ${W}`);
const px = (buf, w, x, y) => { const i = (y * w + x) * 3; return [buf[i], buf[i + 1], buf[i + 2]]; };

// a card's picture box as his pixels, with the pill (and the heart) filled in
// from their surroundings, so nothing of them rides along with the slide
const boxOf = (card) => {
  const data = Buffer.alloc(CARD_W * CARD_H * 3);
  for (let y = 0; y < CARD_H; y++) base.data.copy(data, y * CARD_W * 3, ((card.top + y) * PW + card.x) * 3, ((card.top + y) * PW + card.x + CARD_W) * 3);
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
  // the heart: its disc takes the mean of the ring around it
  if (card.heart) {
    const cx = card.heart.cx - card.x, cy = card.heart.cy - card.top;
    const sum = [0, 0, 0]; let n = 0;
    for (let y = Math.floor(cy - 47); y <= Math.ceil(cy + 47); y++) for (let x = Math.floor(cx - 47); x <= Math.ceil(cx + 47); x++) {
      if (x < 0 || y < 0 || x >= CARD_W || y >= CARD_H) continue;
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d >= HEART_R + 3 && d <= HEART_R + 10) { const c = get(x, y); sum[0] += c[0]; sum[1] += c[1]; sum[2] += c[2]; n++; }
    }
    const mean = sum.map((v) => Math.round(v / n));
    for (let y = Math.floor(cy - 40); y <= Math.ceil(cy + 40); y++) for (let x = Math.floor(cx - 40); x <= Math.ceil(cx + 40); x++) {
      if (x < 0 || y < 0 || x >= CARD_W || y >= CARD_H) continue;
      if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= HEART_R + 2.5) set(x, y, mean);
    }
  }
  return data;
};

// the heart as his own pixels, cut round: a 77px square about its centre,
// masked to the disc with a soft 1px edge
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

// the second photo, cropped square and scaled to the box, never outside it
// (the box is 3px short of square, so the cover fit trims that much)
const photoOf = async (card) => sharp(card.photo.file).extract(card.photo.crop).resize(CARD_W, CARD_H, { fit: 'cover', kernel: KERNEL }).removeAlpha().raw().toBuffer();

for (const card of CARDS) {
  card.box = boxOf(card);
  card.next = await photoOf(card);
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
