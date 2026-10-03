// The v3 Mall landing, alive: the clip for the 'v3-landing-active' row on
// /work/meesho-mall (Uttham, 2026-10-03: "v3 landing active is v3 landing
// page. that has the brands and brand cards, you can animate and scroll
// them"; "make sure that both the horizontal cards scroll for product cards
// is just a small peek, not full animation").
//
// One take, 8 s at 30 fps, that ends on its first frame:
//   - the brand-logo wall drifts as three seamless vertical loops (each
//     column's own tiles, duplicated; constant speed with a soft start and
//     stop, alternate directions; each column travels exactly one loop);
//   - the brand cards row peeks: it eases left 40 pt, holds, and a critically
//     damped spring brings it back to exactly 0;
//   - the page scrolls (a short drag, then iOS-style deceleration) until the
//     Newly Launched row is on screen, that row peeks the same way, and the
//     page scrolls back to the top.
//
// WHAT IT IS MADE OF. The first screen is Uttham's own export,
// src/assets/mall-case/v3-landing-new.png, so the clip opens and closes on it.
// Everything the export does not show comes from renders of his layers in his
// Figma file (the "Mall Landing Page" frame on the "Design Review 06 Mar 2024"
// page), exported at 3x into .clip-work/layers/ (untracked):
//
//   page-tall.png      the 360x3160 "Mall Landing Page" frame (node 662:66307),
//                      PNG at 3x: the page below the export's fold
//   stars.svg          the star-pattern vector in its intro (662:66309), SVG
//   tile-vaseline.jpg  image fill of "Vaseline - jpeg 0" (662:66403)
//   tile-nivea.png     image fill of "nivea-me.com - png" (662:66393)
//   tile-garnier.png   image fill of "Garnier India - png" (662:66385)
//   boat-photo.png     image fill of "image 1944" in the boAt card (662:66780)
//   nl-pattern.png     the Newly Launched section's star pattern group
//                      (709:85833) at 3x, which renders over the section fill
//
// (With the Figma MCP: download_assets on each node, defaultScale 3; the
// image fills are the `rawImages` of the same call.)
//
// The export is a later revision of that frame (no pill on the logo, "Top
// Quality", "# TOP" tags, a lavender intro with a purple blob), so a few
// things it hides are rebuilt from what it shows and from his layers:
//   - the plate under the logo tiles: the export's own pixels where the
//     plate shows, shadows divided out; under the tiles, a fit of the
//     lavender ground, the blob's fill and his star vector (which sits where
//     it sits in the Figma intro, to within a pixel or two at 1x), and a
//     smooth guess at the blob's lower edge between the gaps it shows through;
//   - the tiles clipped at the wall's top and bottom: his tile images on the
//     tile's white rounded square (they match the visible parts to ~0.5/255);
//   - the boAt card past the screen edge: the Nivea card's paper, the boAt
//     card's own mirrored edge, its photo from the raw image (registered on
//     the visible part, colour-matched), and the tail of its label set from
//     the label's own E and the S of "# TOP FACEWASH";
//   - the third Newly Launched card past its clip: the first card's image and
//     the second card's tags and text, which are the same component.
// Below the fold the page is his Figma frame, whose Popular Brands photos
// differ from the export's; the five-point sliver of them above the bottom
// nav crossfades to the frame's while the page is still and back before the
// end, so the first and last frames stay the export's.
//
// Run:   node scripts/mall-landing-clip.mjs            (frames + still; --still-only, --at=1.2,3.5 to inspect)
//        swift scripts/frames-to-mp4.swift .clip-work/frames public/media/mall-case/v3-landing-active.mp4
// Writes .clip-work/frames/f0000.png… (720x1440), the poster
// src/assets/mall-case/v3-landing-active.png (1080x2160, = first = last
// frame), and .clip-work/check/ (a frame strip and the t=0 difference).

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = path.join(ROOT, '.clip-work');
const LAYERS = path.join(WORK, 'layers');
const FRAMES = path.join(WORK, 'frames');
const CHECK = path.join(WORK, 'check');
const EXPORT = path.join(ROOT, 'src/assets/mall-case/v3-landing-new.png');
const STILL = path.join(ROOT, 'src/assets/mall-case/v3-landing-active.png');
const W = 1080, H = 2160; // 3x
const OUT_W = 720, OUT_H = 1440;
const FPS = 30, DUR = 8, NF = DUR * FPS; // frames 0..NF inclusive; frame NF is frame 0 again
const ONLY = process.argv.includes('--still-only');

// ----------------------------------------------------------------- loading
async function rgb(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
const need = (f) => { const p = path.join(LAYERS, f); if (!fs.existsSync(p)) throw new Error(`missing layer ${p} (see the header of this script)`); return p; };
const E = await rgb(EXPORT);
const F = await rgb(need('page-tall.png'));
if (E.w !== W || E.h !== H) throw new Error('the export should be 1080x2160');
const FIG_DY = 3; // below the cards row the Figma frame sits 1 pt (3 px) lower than the export

// ------------------------------------------------------------ small helpers
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
function rrMask(w, h, R, ss = 4) { // anti-aliased rounded rectangle coverage
  const m = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let c = 0;
    for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
      const px = x + (sx + 0.5) / ss, py = y + (sy + 0.5) / ss;
      const cx = clamp(px, R, w - R), cy = clamp(py, R, h - R);
      if ((px - cx) ** 2 + (py - cy) ** 2 <= R * R) c++;
    }
    m[y * w + x] = c / (ss * ss);
  }
  return m;
}
function blur(src, w, h, sigma) { // separable gaussian, zero outside
  const rad = Math.ceil(sigma * 3), k = []; let ks = 0;
  for (let i = -rad; i <= rad; i++) { const v = Math.exp(-(i * i) / (2 * sigma * sigma)); k.push(v); ks += v; }
  const tmp = new Float32Array(w * h), out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0; for (let i = -rad; i <= rad; i++) { const xx = x + i; if (xx >= 0 && xx < w) s += src[y * w + xx] * k[i + rad]; } tmp[y * w + x] = s / ks; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0; for (let i = -rad; i <= rad; i++) { const yy = y + i; if (yy >= 0 && yy < h) s += tmp[yy * w + x] * k[i + rad]; } out[y * w + x] = s / ks; }
  return out;
}
function solve(A, b) { // gaussian elimination with partial pivoting
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}
function lstsq(rows, ys, nOut) { // rows: feature arrays; ys: target arrays (nOut)
  const n = rows[0].length, coef = [];
  for (let o = 0; o < nOut; o++) {
    const A = Array.from({ length: n }, () => new Array(n).fill(0)), b = new Array(n).fill(0);
    for (let i = 0; i < rows.length; i++) { const f = rows[i], v = ys[i][o]; for (let p = 0; p < n; p++) { b[p] += f[p] * v; for (let q = 0; q < n; q++) A[p][q] += f[p] * f[q]; } }
    coef.push(solve(A, b));
  }
  return coef;
}
async function imgDataUri(file) { const b = fs.readFileSync(file); return `data:image/${file.endsWith('.jpg') ? 'jpeg' : 'png'};base64,${b.toString('base64')}`; }

// ======================================================= 1. the logo wall
// Geometry in the export (3x): the wall is the intro's right 160 pt, rows
// 165..765 (the export's intro starts at 55 pt). Columns at x 633/801/969;
// tile y in intro points, as his Figma cluster has them.
const CL = { x0: 600, y0: 165, x1: 1080, y1: 765 };
const CW = CL.x1 - CL.x0, CH = CL.y1 - CL.y0;
const T = 144, TR = 24; // tile 48 pt, radius 8 pt
const SH = { sigma: 18, dy: 21, a0: 0.072 }; // drop shadow fitted on his tile render (black, ~7%)
const COLS = [
  { x: 633, dir: -1, period: 280 * 3, tiles: [[-36, 'r:vaseline'], [20, 'e'], [76, 'e'], [132, 'e'], [187, 'r:garnier']] },
  { x: 801, dir: +1, period: 224 * 3, tiles: [[-12, 'r:nivea'], [44, 'e'], [100, 'e'], [156, 'r:garnier']] },
  { x: 969, dir: -1, period: 282 * 3, tiles: [[-30, 'r:nivea'], [28, 'e'], [84, 'e'], [140, 'e'], [196, 'r:garnier']] },
];
const tileY = (yi) => (55 + yi) * 3;
const TM = rrMask(T, T, TR);
// shadow sprite: alpha of black, tile at (SP, SP) inside
const SP = 60, SWW = T + 2 * SP, SHH = T + 2 * SP + SH.dy;
const shadowSprite = (() => {
  const big = new Float32Array(SWW * SHH);
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) big[(y + SP) * SWW + x + SP] = TM[y * T + x];
  const b = blur(big, SWW, SHH, SH.sigma), out = new Float32Array(SWW * SHH);
  for (let y = 0; y < SHH; y++) for (let x = 0; x < SWW; x++) { const yy = y - SH.dy; out[y * SWW + x] = yy >= 0 ? SH.a0 * b[yy * SWW + x] : 0; }
  return out;
})();
// tile sprites: Float32 RGB + coverage. Export tiles: the export's pixels
// (white in the anti-aliased ring). Rebuilt: his image on the white square,
// then the export's pixels wherever the tile shows at t=0.
async function rebuiltTile(kind) {
  const spec = { vaseline: ['tile-vaseline.jpg', 0, 144], garnier: ['tile-garnier.png', 0, 144], nivea: ['tile-nivea.png', 14.4, 115.2] }[kind];
  const uri = await imgDataUri(need(spec[0]));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${T}" height="${T}"><defs><clipPath id="c"><rect width="${T}" height="${T}" rx="${TR}"/></clipPath></defs><rect width="${T}" height="${T}" fill="#fff"/><image xlink:href="${uri}" x="${spec[1]}" y="${spec[1]}" width="${spec[2]}" height="${spec[2]}" preserveAspectRatio="none" clip-path="url(#c)"/></svg>`;
  const { data } = await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return data;
}
const tileSprites = [];
for (const col of COLS) for (const [yi, src] of col.tiles) {
  const ty = tileY(yi), rgbT = new Float32Array(T * T * 3);
  let base = null; if (src.startsWith('r:')) base = await rebuiltTile(src.slice(2));
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    const i = y * T + x, ex = col.x + x, ey = ty + y;
    const shown = ex >= CL.x0 && ex < CL.x1 && ey >= CL.y0 && ey < CL.y1;
    for (let k = 0; k < 3; k++) {
      let v = base ? base[i * 3 + k] : 255;
      if (shown && TM[i] >= 0.999) v = E.data[(ey * W + ex) * 3 + k];
      rgbT[i * 3 + k] = TM[i] >= 0.999 ? v : 255; // the ring is the tile's white paper
    }
  }
  tileSprites.push({ col, yi, rgb: rgbT });
}

// --- the plate: shadow-divided export pixels where the plate shows, a fitted
// model under the tiles
const tileCov = new Float32Array(CW * CH), keep = new Float32Array(CW * CH).fill(1);
for (const col of COLS) for (const [yi] of col.tiles) {
  const tx = col.x - CL.x0, ty = tileY(yi) - CL.y0;
  for (let y = Math.max(0, ty - SP); y < Math.min(CH, ty - SP + SHH); y++) for (let x = Math.max(0, tx - SP); x < Math.min(CW, tx - SP + SWW); x++) {
    keep[y * CW + x] *= 1 - shadowSprite[(y - ty + SP) * SWW + (x - tx + SP)];
    const lx = x - tx, ly = y - ty;
    if (lx >= 0 && lx < T && ly >= 0 && ly < T) tileCov[y * CW + x] = Math.max(tileCov[y * CW + x], TM[ly * T + lx]);
  }
}
const Pobs = new Float32Array(CW * CH * 3), vis = new Uint8Array(CW * CH);
for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
  const i = y * CW + x; vis[i] = tileCov[i] < 0.002 ? 1 : 0;
  for (let k = 0; k < 3; k++) Pobs[i * 3 + k] = E.data[((y + CL.y0) * W + x + CL.x0) * 3 + k] / keep[i];
}
// star coverage from his vector, placed as in the Figma intro: (-80.84, -6) pt
const starM = await (async () => {
  const svg = fs.readFileSync(need('stars.svg'), 'utf8');
  const paths = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  const tx = -80.8427734375 * 3 - CL.x0, ty = (55 - 5.9991302490234375) * 3 - CL.y0;
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><rect width="100%" height="100%" fill="#000"/><g transform="translate(${tx} ${ty}) scale(3)">${paths.map((d) => `<path d="${d}" fill="#fff"/>`).join('')}</g></svg>`;
  const { data } = await sharp(Buffer.from(doc)).greyscale().raw().toBuffer({ resolveWithObject: true });
  return Float32Array.from(data, (v) => v / 255);
})();
const lumO = (i) => (Pobs[i * 3] + Pobs[i * 3 + 1] + Pobs[i * 3 + 2]) / 3;
const lab = new Uint8Array(CW * CH); // 1 blob, 2 lavender
for (let i = 0; i < CW * CH; i++) if (vis[i]) { const l = lumO(i); lab[i] = l < 170 ? 1 : l > 190 ? 2 : 0; }
const interior = (v, r) => { const o = new Uint8Array(CW * CH); for (let y = r; y < CH - r; y++) for (let x = r; x < CW - r; x++) { let ok = lab[y * CW + x] === v; for (let d = -r; ok && d <= r; d++) if (lab[(y + d) * CW + x] !== v || lab[y * CW + x + d] !== v) ok = false; o[y * CW + x] = ok ? 1 : 0; } return o; };
const nyy = (y) => y / CH - 0.5, nxx = (x) => x / CW - 0.5;
const blobF = (x, y, m) => { const u = nyy(y), v = nxx(x); return [1, u, u * u, u * u * u, v, u * v, m, m * u, m * v, m * u * v, m * u * u, m * v * v]; };
const lavF = (x, y) => { const u = nyy(y), v = nxx(x); return [1, u, u * u, v, u * v, v * v]; };
function fitModel(mask, feat) {
  const rows = [], ys = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { const i = y * CW + x; if (!mask[i]) continue; rows.push(feat(x, y, starM[i])); ys.push([Pobs[i * 3], Pobs[i * 3 + 1], Pobs[i * 3 + 2]]); }
  const coef = lstsq(rows, ys, 3);
  return (x, y, m) => { const f = feat(x, y, m); return coef.map((c) => c.reduce((s, v, k) => s + v * f[k], 0)); };
}
const blobModel = fitModel(interior(1, 4), blobF), lavModel = fitModel(interior(2, 4), lavF);
// the blob's lower edge (export page coords, 3x): seen where the plate shows,
// a smooth guess between. Hermite spans with the slopes the visible parts have.
const EDGE = (() => {
  const seen = [];
  for (let x = 0; x < CW; x++) for (let y = 300; y < CH - 1; y++) {
    const a = y * CW + x, b = a + CW; if (!vis[a] || !vis[b]) continue;
    const la = lumO(a), lb = lumO(b); if (la < 180 && lb >= 180) seen.push([x + CL.x0, y + (180 - la) / (lb - la) + 0.5 + CL.y0]);
  }
  const at = (x0, x1) => { const p = seen.filter(([x]) => x >= x0 && x <= x1); return p.reduce((s, [, y]) => s + y, 0) / p.length; };
  const slope = (x0, x1) => (at(x1 - 2, x1 + 2) - at(x0 - 2, x0 + 2)) / (x1 - x0);
  // circle through the right lobe's visible arc, continued to its side
  const lobe = { cx: 963, cy: at(960, 966) - 70.1, r: 70.1 };
  const spans = [
    { x0: 632, y0: at(630, 634), m0: slope(620, 632), x1: 779, y1: at(778, 781), m1: slope(779, 791) },
    { x0: 800, y0: at(798, 801), m0: slope(788, 800), x1: 947, y1: at(946, 949), m1: slope(947, 956) },
    { x0: 1025, y0: lobe.cy + Math.sqrt(lobe.r ** 2 - 62 ** 2), m0: -62 / Math.sqrt(lobe.r ** 2 - 62 ** 2), x1: 1080, y1: 650, m1: -0.2 },
  ];
  const ys = new Float32Array(CW).fill(NaN);
  for (const [x, y] of seen) { const i = Math.round(x) - CL.x0; if (i >= 0 && i < CW) ys[i] = Number.isNaN(ys[i]) ? y : Math.max(ys[i], y); }
  for (let x = CL.x0; x < CL.x1; x++) {
    const i = x - CL.x0;
    const s = spans.find((p) => x > p.x0 && x < p.x1);
    if (s) { const L = s.x1 - s.x0, t = (x - s.x0) / L, t2 = t * t, t3 = t2 * t; ys[i] = (2 * t3 - 3 * t2 + 1) * s.y0 + (t3 - 2 * t2 + t) * s.m0 * L + (-2 * t3 + 3 * t2) * s.y1 + (t3 - t2) * s.m1 * L; }
    else if (x >= 1010 && x <= 1025) ys[i] = lobe.cy + Math.sqrt(Math.max(0, lobe.r ** 2 - (x - lobe.cx) ** 2));
  }
  for (let i = 0; i < CW; i++) if (Number.isNaN(ys[i])) { // left of the wall the edge runs off the region; hold the nearest
    let j = i; while (j < CW && Number.isNaN(ys[j])) j++; ys[i] = j < CW ? ys[j] : ys[i - 1];
  }
  return ys;
})();
const Pmodel = new Float32Array(CW * CH * 3);
for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
  const i = y * CW + x, py = y + CL.y0;
  const b = clamp(EDGE[x] - py + 0.5, 0, 1); // blob coverage, anti-aliased vertically
  const B = blobModel(x, y, starM[i]), L = lavModel(x, y, 0);
  for (let k = 0; k < 3; k++) Pmodel[i * 3 + k] = b * B[k] + (1 - b) * L[k];
}
// feathered merge: seen pixels stay the export's, the model takes over within 6 px of a tile
const dist = new Float32Array(CW * CH).fill(1e9);
for (let i = 0; i < CW * CH; i++) if (!vis[i]) dist[i] = 0;
for (let pass = 0; pass < 2; pass++) for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) { // two-pass chamfer
  const yy = pass ? CH - 1 - y : y, xx = pass ? CW - 1 - x : x, i = yy * CW + xx, d = pass ? 1 : -1;
  const nb = [[xx + d, yy], [xx, yy + d], [xx + d, yy + d], [xx - d, yy + d]];
  for (const [nx, ny] of nb) if (nx >= 0 && nx < CW && ny >= 0 && ny < CH) dist[i] = Math.min(dist[i], dist[ny * CW + nx] + (nx !== xx && ny !== yy ? 1.414 : 1));
}
const PLATE = new Float32Array(CW * CH * 3);
let modelErr = 0, modelN = 0;
for (let i = 0; i < CW * CH; i++) {
  const w = clamp(dist[i] / 6, 0, 1);
  for (let k = 0; k < 3; k++) { PLATE[i * 3 + k] = w * Pobs[i * 3 + k] + (1 - w) * Pmodel[i * 3 + k]; if (vis[i]) { modelErr += Math.abs(Pobs[i * 3 + k] - Pmodel[i * 3 + k]); modelN++; } }
}
const PLATE_MODEL_MAD = modelErr / modelN;

// ================================================ 2. the brand cards row
// Rows 765..1713 move as one: the row's ground is a vertical gradient, the
// same at every x, so sliding it is sliding the cards over it. Extended to
// x 1200 (the row frame's 400 pt) with the boAt card's hidden end.
const BAND = { y0: 765, y1: 1713, w: 1200 };
const BH = BAND.y1 - BAND.y0;
const band = new Uint8Array(BAND.w * BH * 3);
// the boAt photo fills rows 876..1413 edge to edge (a 1 pt white line above
// it, row 1414 half covered); the label bar is rows 804..872
const NIV = 36, BOAT = 624, PHOTO_TOP = 876, PHOTO_BOT = 1414;
const ePx = (x, y, k) => E.data[(y * W + x) * 3 + k];
for (let y = BAND.y0; y < BAND.y1; y++) for (let x = 0; x < W; x++) for (let k = 0; k < 3; k++) band[((y - BAND.y0) * BAND.w + x) * 3 + k] = ePx(x, y, k);
// boAt photo: his raw image, registered on the visible part (scale 1.872 of
// the raw pixel, origin 365.32/659.66 in page px) and colour-matched to the
// export's (a linear fit, MAD ~3)
const photo = await (async () => {
  const s = 1.872, ox = 365.32, oy = 659.66;
  const size = Math.round(564 * s);
  const meta = await sharp(need('boat-photo.png')).metadata();
  const R = await sharp(need('boat-photo.png')).removeAlpha().resize(Math.round(meta.width * s), Math.round(meta.height * s), { kernel: 'lanczos3' }).raw().toBuffer();
  const rw = Math.round(meta.width * s);
  const at = (x, y, k) => R[((y - Math.round(oy)) * rw + (x - Math.round(ox))) * 3 + k];
  // colour fit on the visible photo
  const rows = [], ys = [];
  for (let y = 940; y < 1380; y += 2) for (let x = 780; x < 1076; x += 2) { rows.push([1, at(x, y, 0) / 255, at(x, y, 1) / 255, at(x, y, 2) / 255]); ys.push([ePx(x, y, 0) / 255, ePx(x, y, 1) / 255, ePx(x, y, 2) / 255]); }
  const coef = lstsq(rows, ys, 3);
  let err = 0; rows.forEach((f, i) => { for (let c = 0; c < 3; c++) err += Math.abs(coef[c].reduce((a, v, j) => a + v * f[j], 0) - ys[i][c]) * 255; });
  return { size, px: (x, y) => { const f = [1, at(x, y, 0) / 255, at(x, y, 1) / 255, at(x, y, 2) / 255]; return coef.map((c) => clamp(Math.round(c.reduce((a, v, j) => a + v * f[j], 0) * 255), 0, 255)); }, mad: err / rows.length / 3 };
})();
// text rows of the label, and a purple column clear of any letter
const TXT0 = 815, TXT1 = 860, PURPLE_COL = NIV + 494;
for (let y = BAND.y0; y < BAND.y1; y++) for (let x = W; x < BAND.w; x++) {
  let src;
  const inPhoto = y >= PHOTO_TOP && y < PHOTO_BOT, halfPhoto = y === PHOTO_BOT;
  if (x >= 1164) src = [1199 - x, y]; // past the card: the Nivea card's left margin, mirrored (ground + shadow)
  else if (inPhoto || halfPhoto) src = null; // the photo runs to the card's edge, as on its left
  else if (x >= 1152) src = [BOAT + (1163 - x), y]; // the card's own left edge, mirrored: border, corners
  else if (y >= TXT0 && y < TXT1) src = [PURPLE_COL, y]; // label bar, clear of letters
  else src = [x - (BOAT - NIV), y]; // the Nivea card's paper at the same place
  const o = ((y - BAND.y0) * BAND.w + x) * 3;
  if (src) for (let k = 0; k < 3; k++) band[o + k] = ePx(src[0], src[1], k);
  else { const c = photo.px(x, y); for (let k = 0; k < 3; k++) band[o + k] = halfPhoto ? Math.round((c[k] + 255) / 2) : c[k]; }
}
// the label's tail: the rest of its last E (from its first E, 899..915) and an
// S from "# TOP FACEWASH" (456..473), one letter-gap after the E
for (let y = TXT0; y < TXT1; y++) {
  for (let x = 1080; x <= 1088; x++) for (let k = 0; k < 3; k++) band[((y - BAND.y0) * BAND.w + x) * 3 + k] = ePx(899 + (x - 1072), y, k);
  for (let x = 1092; x <= 1109; x++) for (let k = 0; k < 3; k++) band[((y - BAND.y0) * BAND.w + x) * 3 + k] = ePx(456 + (x - 1092), y, k);
}

// ============================================ 3. the Newly Launched row
// In the Figma frame: the row frame clips at x 24..1056, cards at 24/498/972,
// rows 4794..5475; no shadows on the dark section. The section's pattern
// (nl-pattern.png) starts 16 px below the section top (3966).
const NL = { x0: 24, x1: 1056, y0: 4794, y1: 5475, cards: [24, 498, 972], cw: [450, 450, 420], R: 9 };
const NLH = NL.y1 - NL.y0;
const pat = await rgb(need('nl-pattern.png'));
const PAT_Y = 3966 + 16;
const nlPlate = new Float32Array(W * NLH * 3);
for (let y = 0; y < NLH; y++) for (let x = 0; x < W; x++) for (let k = 0; k < 3; k++) nlPlate[(y * W + x) * 3 + k] = pat.data[((NL.y0 + y - PAT_Y) * W + x) * 3 + k];
const fPx = (x, y, k) => F.data[(y * W + x) * 3 + k];
const nlCards = NL.cards.map((cx, ci) => {
  const cw = NL.cw[ci], m = rrMask(cw, NLH, NL.R), rgbC = new Float32Array(cw * NLH * 3), a = new Float32Array(cw * NLH);
  for (let y = 0; y < NLH; y++) for (let x = 0; x < cw; x++) {
    const i = y * cw + x, gx = cx + x, gy = NL.y0 + y;
    let src = null;
    if (gx < NL.x1) src = [gx, gy];
    else if (ci === 2) { const lx = x; src = y < 399 ? [NL.cards[0] + lx, gy] : [NL.cards[1] + lx, gy]; } // same component: image of card 1, tags and text of card 2
    if (!src) { a[i] = 0; continue; }
    a[i] = m[i];
    for (let k = 0; k < 3; k++) {
      const v = fPx(src[0], src[1], k), p = nlPlate[(y * W + Math.min(W - 1, src[0])) * 3 + k];
      rgbC[i * 3 + k] = m[i] > 0.05 ? clamp((v - (1 - m[i]) * p) / m[i], 0, 255) : 255;
    }
  }
  return { cx, cw, rgb: rgbC, a };
});

// ============================================================ 4. the page
// Static page in export coordinates: the export above row 1980, his frame
// (3 px up) below. The sliver 1980..1998 is blended between the two.
const S_MAX = 1218 * 3; // scroll that brings the Newly Launched section on screen
const VIEW0 = 165, VIEW1 = 1998; // under the app bar, over the bottom nav
const SEAM = 1980;
const PAGE_H = VIEW1 + S_MAX + 4;
const PAGE = new Uint8Array(W * PAGE_H * 3);
for (let y = 0; y < PAGE_H; y++) {
  const src = y < SEAM ? E.data.subarray(y * W * 3, (y + 1) * W * 3) : F.data.subarray((y + FIG_DY) * W * 3, (y + FIG_DY + 1) * W * 3);
  PAGE.set(src, y * W * 3);
}
const NL_PAGE_Y = NL.y0 - FIG_DY; // the row in page coords

// ======================================================== 5. the timeline
const t2 = (f) => f / FPS;
// logo drift: one loop per column, constant speed in the middle, a soft
// start from the still and a soft stop on it
const logoProgress = (() => {
  const a = 0.6 / DUR, b = 0.9 / DUR, N = 4000, cum = new Float64Array(N + 1);
  const v = (u) => (u < a ? smooth(u / a) : u > 1 - b ? smooth((1 - u) / b) : 1);
  for (let i = 1; i <= N; i++) cum[i] = cum[i - 1] + v((i - 0.5) / N) / N;
  return (t) => { const u = clamp(t / DUR, 0, 1), x = u * N, i = Math.floor(x); const c = i >= N ? cum[N] : cum[i] + (cum[i + 1] - cum[i]) * (x - i); return c / cum[N]; };
})();
// a peek: a critically damped spring (damping 1, no overshoot) carries the
// row 40 pt left, it holds, and a second one brings it back from wherever it
// is to exactly 0
const PEEK = 40 * 3, PEEK_LEN = 1.3;
function peek(t, t0) {
  const wOut = 16, wBack = 13, tBack = t0 + 0.4 + 0.3, tEnd = t0 + PEEK_LEN;
  if (t <= t0 || t >= tEnd) return 0;
  const crit = (x0, w, s) => x0 * (1 + w * s) * Math.exp(-w * s); // from x0 toward 0, starting at rest
  const out = (s) => -PEEK + crit(PEEK, wOut, s);
  if (t < tBack) return out(t - t0);
  return crit(out(tBack - t0), wBack, t - tBack);
}
// a scroll: a short finger drag (constant acceleration), then the iOS-style
// glide (an ease-out that ends at rest), joined with no jump in velocity
function scrollProg(t, t0, dur) {
  const Td = 0.3, Tm = dur - Td, k = 3.5;
  const xr = (k / Tm) / (2 / Td + k / Tm); // share covered while the finger is down
  const s = t - t0;
  if (s <= 0) return 0;
  if (s >= dur) return 1;
  if (s < Td) return xr * (s / Td) ** 2;
  return xr + (1 - xr) * (1 - (1 - (s - Td) / Tm) ** k);
}
const P1 = 0.5, SC1 = { t0: 1.9, dur: 1.9 }, P2 = 3.9, SC2 = { t0: 5.3, dur: 1.9 };
function state(t) {
  const sc = scrollProg(t, SC1.t0, SC1.dur) - scrollProg(t, SC2.t0, SC2.dur);
  const sliver = smooth((t - 1.0) / 0.6) * (1 - smooth((t - 7.3) / 0.5));
  return { t, scroll: sc * S_MAX, logo: logoProgress(t), peek1: peek(t, P1), peek2: peek(t, P2), sliver };
}

// ===================================================== 6. rendering a frame
// The page rows [p0, p1) with everything that moves on the page drawn in.
// `blur` gives each row's horizontal motion over the shutter: [from, to].
function renderPage(st, p0, p1, blur) {
  const rows = p1 - p0, buf = new Uint8Array(W * rows * 3);
  buf.set(PAGE.subarray(p0 * W * 3, p1 * W * 3));
  const R = (py) => (py - p0) * W * 3; // row offset in buf
  // the sliver of Popular Brands photos above the nav: the export's <-> his frame
  if (st.sliver < 1) for (let py = Math.max(SEAM, p0); py < Math.min(VIEW1, p1); py++) for (let x = 0; x < W * 3; x++) { const i = R(py) + x; buf[i] = Math.round(st.sliver * buf[i] + (1 - st.sliver) * E.data[py * W * 3 + x]); }
  // the logo wall
  if (CL.y1 > p0 && CL.y0 < p1) {
    const pl = Float32Array.from(PLATE), inst = [];
    for (const col of COLS) {
      const off = (col.dir * col.period * st.logo) % col.period;
      for (const s of tileSprites) if (s.col === col) for (const n of [-1, 0, 1]) {
        const y = tileY(s.yi) - CL.y0 + off + n * col.period;
        if (y > -T - SP - SH.dy && y < CH + SP) inst.push({ s, x: col.x - CL.x0, y });
      }
    }
    for (const { x, y } of inst) { // shadows fall on the plate; sprite row r lands at y - SP + r
      const y0 = Math.floor(y), fy = y - y0;
      for (let r = 0; r <= SHH; r++) {
        const yy = y0 - SP + r; if (yy < 0 || yy >= CH) continue;
        for (let c = 0; c < SWW; c++) {
          const xx = x - SP + c; if (xx < 0 || xx >= CW) continue;
          const a = (r < SHH ? shadowSprite[r * SWW + c] : 0) * (1 - fy) + (r > 0 ? shadowSprite[(r - 1) * SWW + c] : 0) * fy;
          if (a <= 0) continue;
          const i = (yy * CW + xx) * 3; pl[i] *= 1 - a; pl[i + 1] *= 1 - a; pl[i + 2] *= 1 - a;
        }
      }
    }
    for (const { s, x, y } of inst) { // then the tiles, premultiplied, between two sprite rows
      const y0 = Math.floor(y), fy = y - y0;
      for (let r = 0; r <= T; r++) {
        const yy = y0 + r; if (yy < 0 || yy >= CH) continue;
        for (let c = 0; c < T; c++) {
          const xx = x + c; if (xx < 0 || xx >= CW) continue;
          const mb = r < T ? TM[r * T + c] : 0, ma = r > 0 ? TM[(r - 1) * T + c] : 0;
          const a = mb * (1 - fy) + ma * fy; if (a <= 0) continue;
          const i = (yy * CW + xx) * 3;
          for (let k = 0; k < 3; k++) {
            const pm = (r < T ? s.rgb[(r * T + c) * 3 + k] * mb : 0) * (1 - fy) + (r > 0 ? s.rgb[((r - 1) * T + c) * 3 + k] * ma : 0) * fy;
            pl[i + k] = pm + (1 - a) * pl[i + k];
          }
        }
      }
    }
    for (let py = Math.max(CL.y0, p0); py < Math.min(CL.y1, p1); py++) { const y = py - CL.y0; for (let x = 0; x < CW; x++) for (let k = 0; k < 3; k++) buf[R(py) + (x + CL.x0) * 3 + k] = clamp(Math.round(pl[(y * CW + x) * 3 + k]), 0, 255); }
  }
  // the brand cards row: slides as one (its ground is the same at every x);
  // a box over the shutter's travel for motion blur
  if ((blur.p1[0] !== 0 || blur.p1[1] !== 0) && BAND.y1 > p0 && BAND.y0 < p1) {
    const da = -blur.p1[0], db = -blur.p1[1], lo = Math.min(da, db), hi = Math.max(da, db), cum = new Float64Array((BAND.w + 1) * 3);
    for (let py = Math.max(BAND.y0, p0); py < Math.min(BAND.y1, p1); py++) {
      const y = py - BAND.y0;
      for (let x = 0; x < BAND.w; x++) for (let k = 0; k < 3; k++) cum[(x + 1) * 3 + k] = cum[x * 3 + k] + band[(y * BAND.w + x) * 3 + k];
      const C = (u, k) => { u = clamp(u, 0, BAND.w - 1e-6); const i = Math.floor(u); return cum[i * 3 + k] + (u - i) * band[(y * BAND.w + i) * 3 + k]; };
      const P = (u, k) => { u = clamp(u, 0, BAND.w - 1.000001); const i = Math.floor(u), f = u - i; return band[(y * BAND.w + i) * 3 + k] * (1 - f) + band[(y * BAND.w + i + 1) * 3 + k] * f; };
      for (let x = 0; x < W; x++) for (let k = 0; k < 3; k++) {
        const v = hi - lo < 0.5 ? P(x + (lo + hi) / 2, k) : (C(x + hi + 0.5, k) - C(x + lo + 0.5, k)) / (hi - lo);
        buf[R(py) + x * 3 + k] = clamp(Math.round(v), 0, 255);
      }
    }
  }
  // the Newly Launched row: cards slide over the section's pattern, which stays
  if ((blur.p2[0] !== 0 || blur.p2[1] !== 0) && NL_PAGE_Y + NLH > p0 && NL_PAGE_Y < p1) {
    const n = clamp(Math.ceil(Math.abs(blur.p2[1] - blur.p2[0]) / 2), 1, 16);
    const ds = Array.from({ length: n }, (_, j) => -(n === 1 ? (blur.p2[0] + blur.p2[1]) / 2 : blur.p2[0] + (blur.p2[1] - blur.p2[0]) * j / (n - 1)));
    for (let py = Math.max(NL_PAGE_Y, p0); py < Math.min(NL_PAGE_Y + NLH, p1); py++) {
      const y = py - NL_PAGE_Y;
      for (let x = NL.x0; x < NL.x1; x++) {
        let sr = 0, sg = 0, sb = 0;
        for (const d of ds) {
          let r = nlPlate[(y * W + x) * 3], g = nlPlate[(y * W + x) * 3 + 1], b = nlPlate[(y * W + x) * 3 + 2];
          for (const c of nlCards) {
            const lx = x + d - c.cx; if (lx < 0 || lx >= c.cw - 1) continue;
            const i0 = Math.floor(lx), f = lx - i0, ia = y * c.cw + i0, ib = ia + 1;
            const a = c.a[ia] * (1 - f) + c.a[ib] * f; if (a <= 0) continue;
            const pm = (k) => c.rgb[ia * 3 + k] * c.a[ia] * (1 - f) + c.rgb[ib * 3 + k] * c.a[ib] * f;
            r = pm(0) + (1 - a) * r; g = pm(1) + (1 - a) * g; b = pm(2) + (1 - a) * b;
          }
          sr += r; sg += g; sb += b;
        }
        const o = R(py) + x * 3; buf[o] = clamp(Math.round(sr / n), 0, 255); buf[o + 1] = clamp(Math.round(sg / n), 0, 255); buf[o + 2] = clamp(Math.round(sb / n), 0, 255);
      }
    }
  }
  return buf;
}
// A frame: the app bar and the bottom nav stay; the window between them shows
// the page at the scroll. Motion blur is a 126-degree shutter (open 0.35 of a frame): each row is the
// page averaged over the scroll's travel while the shutter is open.
let cumBuf = null;
function frameAt(t) {
  const st = state(t), half = 0.175 / FPS, ends = t <= 0 || t >= DUR;
  const a = ends ? st : state(t - half), b = ends ? st : state(t + half);
  const Sa = a.scroll, Sb = b.scroll, lo = Math.min(Sa, Sb, st.scroll), hi = Math.max(Sa, Sb, st.scroll);
  const p0 = Math.max(0, Math.floor(VIEW0 + lo) - 1), p1 = Math.min(PAGE_H, Math.ceil(VIEW1 + hi) + 2);
  const strip = renderPage(st, p0, p1, { p1: [a.peek1, b.peek1], p2: [a.peek2, b.peek2] });
  const frame = new Uint8Array(W * H * 3);
  frame.set(E.data.subarray(0, VIEW0 * W * 3), 0);
  const WW = W * 3, rows = p1 - p0;
  if (Math.abs(Sb - Sa) < 0.75) { // still or slow: sample at the scroll, between rows
    for (let y = VIEW0; y < VIEW1; y++) {
      const u = y + st.scroll - p0, i = Math.floor(u), f = u - i, j = Math.min(rows - 1, i + 1);
      if (f < 1e-6) frame.set(strip.subarray(i * WW, (i + 1) * WW), y * WW);
      else for (let x = 0; x < WW; x++) frame[y * WW + x] = Math.round(strip[i * WW + x] * (1 - f) + strip[j * WW + x] * f);
    }
  } else { // a box over the rows that pass while the shutter is open
    if (!cumBuf || cumBuf.length < (rows + 1) * WW) cumBuf = new Float64Array((rows + 1) * WW);
    for (let x = 0; x < WW; x++) cumBuf[x] = 0;
    for (let r = 0; r < rows; r++) for (let x = 0; x < WW; x++) cumBuf[(r + 1) * WW + x] = cumBuf[r * WW + x] + strip[r * WW + x];
    const C = (u, x) => { u = clamp(u, 0, rows - 1e-6); const i = Math.floor(u); return cumBuf[i * WW + x] + (u - i) * strip[i * WW + x]; };
    const s0 = Math.min(Sa, Sb), s1 = Math.max(Sa, Sb);
    for (let y = VIEW0; y < VIEW1; y++) {
      const u0 = y + s0 - p0 + 0.5, u1 = y + s1 - p0 + 0.5;
      for (let x = 0; x < WW; x++) frame[y * WW + x] = clamp(Math.round((C(u1, x) - C(u0, x)) / (u1 - u0)), 0, 255);
    }
  }
  frame.set(E.data.subarray(VIEW1 * WW), VIEW1 * WW);
  return frame;
}

// ========================================================== 7. write out
fs.mkdirSync(FRAMES, { recursive: true });
fs.mkdirSync(CHECK, { recursive: true });
const f0 = frameAt(0);
await sharp(f0, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 9 }).toFile(STILL);
// t=0 against the export
{
  let sum = 0, max = 0, over = 0; const BS = 30, bw = W / BS, blocks = new Float64Array(bw * (H / BS));
  for (let i = 0; i < W * H; i++) { let d = 0; for (let k = 0; k < 3; k++) d += Math.abs(f0[i * 3 + k] - E.data[i * 3 + k]); d /= 3; sum += d; if (d > max) max = d; if (d > 10) over++; blocks[Math.floor(Math.floor(i / W) / BS) * bw + Math.floor((i % W) / BS)] += d; }
  const worst = [...blocks.keys()].sort((p, q) => blocks[q] - blocks[p]).slice(0, 4).map((i) => `(${(i % bw) * BS},${Math.floor(i / bw) * BS}) ${(blocks[i] / BS / BS).toFixed(1)}`);
  const report = { mad: +(sum / (W * H)).toFixed(3), max: +max.toFixed(0), over10pct: +(100 * over / (W * H)).toFixed(3), worst30pxBlocks: worst, plateModelMadOnSeenPixels: +PLATE_MODEL_MAD.toFixed(2), boatPhotoColourFitMad: +photo.mad.toFixed(2) };
  fs.writeFileSync(path.join(CHECK, 't0-vs-export.json'), JSON.stringify(report, null, 2));
  console.log('t=0 vs export:', report);
  const diff = Buffer.alloc(W * H * 3); for (let i = 0; i < W * H * 3; i++) diff[i] = clamp(128 + 4 * (f0[i] - E.data[i]), 0, 255);
  await sharp(diff, { raw: { width: W, height: H, channels: 3 } }).resize(540).png().toFile(path.join(CHECK, 't0-diff.png'));
}
const AT = process.argv.find((a) => a.startsWith('--at='));
if (AT) { // inspect single moments at full size: --at=1.2,3.5
  for (const t of AT.slice(5).split(',').map(Number)) await sharp(frameAt(t), { raw: { width: W, height: H, channels: 3 } }).png().toFile(path.join(CHECK, `at-${t.toFixed(2)}.png`));
} else if (!ONLY) {
  for (const f of fs.readdirSync(FRAMES)) if (f.endsWith('.png')) fs.unlinkSync(path.join(FRAMES, f));
  const strip = [];
  for (let f = 0; f <= NF; f++) {
    const t = t2(f);
    const fr = f === 0 || f === NF ? f0 : frameAt(t);
    const name = path.join(FRAMES, `f${String(f).padStart(4, '0')}.png`);
    await sharp(fr, { raw: { width: W, height: H, channels: 3 } }).resize(OUT_W, OUT_H, { kernel: 'lanczos3' }).png({ compressionLevel: 1 }).toFile(name);
    if (f % 12 === 0) strip.push(await sharp(fr, { raw: { width: W, height: H, channels: 3 } }).resize(180, 360).png().toBuffer());
    if (f % 30 === 0) process.stdout.write(`frame ${f}/${NF}\n`);
  }
  const cols = 7, rowsN = Math.ceil(strip.length / cols);
  await sharp({ create: { width: cols * 186, height: rowsN * 366, channels: 3, background: '#222' } })
    .composite(strip.map((input, i) => ({ input, left: (i % cols) * 186 + 3, top: Math.floor(i / cols) * 366 + 3 })))
    .png().toFile(path.join(CHECK, 'strip.png'));
  console.log(`wrote ${NF + 1} frames to ${path.relative(ROOT, FRAMES)}, the still to ${path.relative(ROOT, STILL)}`);
}
