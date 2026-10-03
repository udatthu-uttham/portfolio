// The realistic prototype's catalogue, drawn from code (2026-10-03).
//
// The prototype (public/proto/feed-ux, a compiled bundle with no source here)
// used to show real product photos from Meesho's image server, which sat
// awkwardly with CLAUDE.md's "AI Space previews: synthetic data only". Every
// picture it shows now comes from this file: a product of the right kind —
// a shirt where a shirt was, a pressure cooker where a cooker was — drawn as
// a soft flat-lay on a plain studio backdrop. No photo, person, logo, brand or
// lettering anywhere, so nothing a seller made reaches the page.
//
// scripts/proto-synthetic-images.mjs renders these to 512px WebP under
// public/proto/feed-ux/catalog/ and points the bundle at them. The file names
// (`shirt-03.webp`, …) are the contract: a better picture of the same kind can
// replace any file one for one — say, generated product photos once Uttham
// approves the credits — without touching the bundle again.
//
// Each kind is a pool. `POOLS[kind].size` pictures, each a deterministic
// variation (colour, print, cut) of the kind's drawing, so a feed of forty
// shirts does not show the same shirt twice in a row.

const BACKDROPS = ['#ECEAE6', '#E8ECEF', '#EFE8E3', '#E7ECE7', '#ECE7EE', '#EEEAE1', '#E6EAF0', '#F0ECE6'];

const C = {
  white: '#F4F3EF', sky: '#9CC3E6', navy: '#2E3B63', olive: '#6E7B41', maroon: '#7C2737',
  black: '#2B2B30', mustard: '#D8A535', blush: '#E9AEBB', grey: '#9EA3A8', teal: '#22797A',
  rust: '#B4532F', lavender: '#B9A9DB', mint: '#A9D6BC', beige: '#D9C8A9', denim: '#3F5D8A',
  coral: '#EE806E', emerald: '#1F7C57', magenta: '#B23470', peach: '#F3B89D', cream: '#F2E8D0',
  wine: '#5E1F33', royal: '#2F4FB0', charcoal: '#45474D', tan: '#B98552', brown: '#6B4128',
  red: '#C8333C', pink: '#E86A92', lilac: '#C9B8E8', aqua: '#7FC8C9', sand: '#E6D3B3',
};

// ---------------------------------------------------------------- helpers

function rgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(a, b, t) {
  const A = rgb(a);
  const B = rgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
const dk = (c, t = 0.25) => mix(c, '#000000', t);
const lt = (c, t = 0.25) => mix(c, '#ffffff', t);
const lum = (c) => {
  const [r, g, b] = rgb(c);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
const f1 = (n) => +n.toFixed(1);

// A print colour that reads on the base: light on dark cloth, dark on light.
function accentFor(base, i) {
  const light = [C.cream, '#E9C46A', '#F2B5C4', '#BFD8EE', C.white, C.peach];
  const dark = [C.navy, C.maroon, C.teal, C.rust, C.black, C.magenta, C.emerald];
  const list = lum(base) < 0.5 ? light : dark;
  return list[i % list.length];
}

function flower(x, y, p, petal, centre) {
  let o = '';
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
    o += `<circle cx="${f1(x + Math.cos(a) * p)}" cy="${f1(y + Math.sin(a) * p)}" r="${f1(p * 0.62)}" fill="${petal}"/>`;
  }
  return o + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(p * 0.42)}" fill="${centre}"/>`;
}

// A repeating print, in user space so it keeps its scale across the garment.
function pattern(id, kind, base, acc, s = 1) {
  const open = (w, h) =>
    `<pattern id="${id}" width="${f1(w)}" height="${f1(h)}" patternUnits="userSpaceOnUse"><rect width="${f1(w)}" height="${f1(h)}" fill="${base}"/>`;
  switch (kind) {
    case 'stripe': {
      const w = 16 * s;
      return open(w, w) + `<rect width="${f1(w * 0.32)}" height="${f1(w)}" fill="${acc}"/></pattern>`;
    }
    case 'hstripe': {
      const w = 26 * s;
      return open(w, w) + `<rect width="${f1(w)}" height="${f1(w * 0.42)}" fill="${acc}"/></pattern>`;
    }
    case 'pinstripe': {
      const w = 12 * s;
      return open(w, w) + `<rect width="${f1(1.8 * s)}" height="${f1(w)}" fill="${acc}" opacity=".75"/></pattern>`;
    }
    case 'check': {
      const w = 24 * s;
      return (
        open(w, w) +
        `<rect width="${f1(w / 2)}" height="${f1(w)}" fill="${acc}" opacity=".42"/><rect width="${f1(w)}" height="${f1(w / 2)}" fill="${acc}" opacity=".42"/></pattern>`
      );
    }
    case 'dots': {
      const w = 18 * s;
      return (
        open(w, w) +
        `<circle cx="${f1(w / 4)}" cy="${f1(w / 4)}" r="${f1(2.3 * s)}" fill="${acc}"/><circle cx="${f1((3 * w) / 4)}" cy="${f1((3 * w) / 4)}" r="${f1(2.3 * s)}" fill="${acc}"/></pattern>`
      );
    }
    case 'floral': {
      const w = 42 * s;
      const ctr = lum(acc) > 0.6 ? '#D8A535' : '#F2D58A';
      return open(w, w) + flower(w / 4, w / 4, 5.6 * s, acc, ctr) + flower((3 * w) / 4, (3 * w) / 4, 5.6 * s, acc, ctr) + '</pattern>';
    }
    case 'butta': {
      const w = 30 * s;
      const b = (x, y) =>
        `<path d="M${f1(x)} ${f1(y - 6 * s)} C${f1(x + 5 * s)} ${f1(y - 2 * s)} ${f1(x + 4 * s)} ${f1(y + 5 * s)} ${f1(x)} ${f1(y + 6 * s)} C${f1(x - 4 * s)} ${f1(y + 5 * s)} ${f1(x - 5 * s)} ${f1(y - 2 * s)} ${f1(x)} ${f1(y - 6 * s)} Z" fill="${acc}"/>`;
      return open(w, w) + b(w / 4, w / 4) + b((3 * w) / 4, (3 * w) / 4) + '</pattern>';
    }
    case 'leaf': {
      const w = 34 * s;
      const l = (x, y, a) =>
        `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(7 * s)}" ry="${f1(3 * s)}" fill="${acc}" transform="rotate(${a} ${f1(x)} ${f1(y)})"/>`;
      return open(w, w) + l(w / 4, w / 4, -35) + l(w / 4 + 6 * s, w / 4 + 5 * s, 35) + l((3 * w) / 4, (3 * w) / 4, -35) + l((3 * w) / 4 + 6 * s, (3 * w) / 4 + 5 * s, 35) + '</pattern>';
    }
    case 'chevron': {
      const w = 24 * s;
      const h = 14 * s;
      return open(w, h) + `<path d="M0 ${f1(h * 0.72)} L${f1(w / 2)} ${f1(h * 0.24)} L${f1(w)} ${f1(h * 0.72)}" fill="none" stroke="${acc}" stroke-width="${f1(2.6 * s)}"/></pattern>`;
    }
    default:
      return '';
  }
}

// A fabric: a fill for the cloth plus the <pattern> it needs, if any.
function fabric(id, kind, base, acc, s = 1) {
  if (kind === 'solid') return { def: '', fill: base };
  return { def: pattern(id, kind, base, acc, s), fill: `url(#${id})` };
}

// One cloth or hard-goods piece: the fill, two volume washes and an outline.
function piece(d, fill, base, extra = '', { outline = 0.45 } = {}) {
  return (
    `<path d="${d}" fill="${fill}"/><path d="${d}" fill="url(#volX)"/><path d="${d}" fill="url(#volY)"/>${extra}` +
    `<path d="${d}" fill="none" stroke="${dk(base, 0.45)}" stroke-opacity="${outline}" stroke-width="2" stroke-linejoin="round"/>`
  );
}
const fold = (d, o = 0.09, w = 3) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const shine = (d, o = 0.3, w = 3) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
const floor = (cy, rx, ry = 16) => `<ellipse cx="256" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#floor)"/>`;
// A soft drop shadow under a flat-lay, as if the piece lies on the backdrop.
const drop = (d, dx = 5, dy = 10, o = 0.2) => `<path d="${d}" fill="#000" opacity="${o}" filter="url(#soft)" transform="translate(${dx} ${dy})"/>`;
const clip = (id, d) => `<clipPath id="${id}"><path d="${d}"/></clipPath>`;

const METALS = `
<linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="#8E959C"/><stop offset=".22" stop-color="#E9ECEF"/><stop offset=".5" stop-color="#AEB4BA"/><stop offset=".78" stop-color="#F3F5F7"/><stop offset="1" stop-color="#7F868D"/></linearGradient>
<linearGradient id="gold" x1="0" x2="1"><stop offset="0" stop-color="#9C7A2B"/><stop offset=".25" stop-color="#F1D58A"/><stop offset=".5" stop-color="#B88E3A"/><stop offset=".78" stop-color="#F5E3A8"/><stop offset="1" stop-color="#8C6A22"/></linearGradient>
<linearGradient id="ebony" x1="0" x2="1"><stop offset="0" stop-color="#1E1F22"/><stop offset=".25" stop-color="#4A4C52"/><stop offset=".5" stop-color="#26272B"/><stop offset=".78" stop-color="#55575D"/><stop offset="1" stop-color="#1A1B1E"/></linearGradient>
<linearGradient id="brass" x1="0" x2="1"><stop offset="0" stop-color="#8A6424"/><stop offset=".3" stop-color="#E8C46E"/><stop offset=".55" stop-color="#A97C30"/><stop offset=".8" stop-color="#F0D48E"/><stop offset="1" stop-color="#7C5A1E"/></linearGradient>
<linearGradient id="copper" x1="0" x2="1"><stop offset="0" stop-color="#7A3E1E"/><stop offset=".25" stop-color="#E7A77A"/><stop offset=".5" stop-color="#A9592F"/><stop offset=".78" stop-color="#F0BC93"/><stop offset="1" stop-color="#6E361A"/></linearGradient>
<linearGradient id="wood" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#C08A55"/><stop offset="1" stop-color="#8A5A32"/></linearGradient>`;

function doc(bg, defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs>
<radialGradient id="bg" cx="50%" cy="38%" r="72%"><stop offset="0" stop-color="${lt(bg, 0.55)}"/><stop offset="1" stop-color="${bg}"/></radialGradient>
<radialGradient id="floor" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".24"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="volX" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
<linearGradient id="volY" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<radialGradient id="puff" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>${METALS}
${defs}</defs>${BACKDROP}<g transform="${FRAME}">${body}</g></svg>`;
}

// Drawings are made at whatever size reads best; the renderer measures each
// one on a clear backdrop and fills FRAME with the transform that sets it at
// the same size as the next — about 83% of the tile, like a product photo.
export const FRAME = 'FRAME';
export const BACKDROP = '<rect width="512" height="512" fill="url(#bg)"/>';

const bgOf = (i, k = 0) => BACKDROPS[(i * 3 + k) % BACKDROPS.length];

// ---------------------------------------------------------------- apparel

const SHIRT_LONG =
  'M206 112 L150 132 Q132 140 126 160 L94 330 L136 344 L166 226 L168 410 Q256 436 344 410 L346 226 L376 344 L418 330 L386 160 Q380 140 362 132 L306 112 Q256 136 206 112 Z';
const SHIRT_SHORT =
  'M206 112 L150 132 Q132 140 124 160 L104 236 L150 252 L166 214 L168 410 Q256 436 344 410 L346 214 L362 252 L408 236 L388 160 Q380 140 362 132 L306 112 Q256 136 206 112 Z';

function shirt(i) {
  const cols = [C.white, C.sky, C.navy, C.olive, C.maroon, C.black, C.mustard, C.blush, C.denim, C.teal, C.grey, C.beige, C.rust, C.lavender, C.mint, C.charcoal];
  const prints = ['solid', 'check', 'stripe', 'solid', 'pinstripe', 'check', 'dots', 'solid'];
  const base = cols[(i * 5) % cols.length];
  const acc = accentFor(base, i);
  const fab = fabric('f', prints[i % prints.length], base, acc, 1);
  const d = i % 3 === 2 ? SHIRT_SHORT : SHIRT_LONG;
  const long = d === SHIRT_LONG;
  const btn = lum(base) > 0.6 ? '#CFCAC0' : lt(base, 0.6);
  let b = drop(d);
  b += piece(d, fab.fill, base,
    fold('M166 226 Q180 252 176 284') + fold('M346 226 Q332 252 336 284') + fold('M204 300 Q212 356 206 398', 0.06) + fold('M310 300 Q302 356 308 398', 0.06) +
      (long ? fold('M100 300 L143 314', 0.16, 2) + fold('M412 300 L369 314', 0.16, 2) : fold('M106 228 L152 244', 0.16, 2) + fold('M406 228 L360 244', 0.16, 2)));
  // Inside of the collar, the collar leaves, placket, buttons, pocket.
  b += `<path d="M206 112 Q256 136 306 112 Q298 103 288 101 Q256 117 224 101 Q214 103 206 112 Z" fill="${dk(base, 0.3)}"/>`;
  b += piece('M249 158 L263 158 L263 423 L249 423 Z', fab.fill, base, '', { outline: 0.3 });
  for (const y of [196, 238, 280, 322, 364, 402]) b += `<circle cx="256" cy="${y}" r="4.2" fill="${btn}" stroke="${dk(base, 0.4)}" stroke-opacity=".4"/>`;
  b += piece('M184 198 L230 198 L230 238 L207 246 L184 238 Z', fab.fill, base, '', { outline: 0.35 });
  b += piece('M206 112 Q226 142 254 160 L240 186 Q216 162 196 126 Z', fab.fill, base);
  b += piece('M306 112 Q286 142 258 160 L272 186 Q296 162 316 126 Z', fab.fill, base);
  return doc(bgOf(i), fab.def, b);
}

function tee(i, base, print = 'solid') {
  const d = 'M206 104 Q256 132 306 104 L366 124 L416 192 L374 224 L346 194 L346 418 L166 418 L166 194 L138 224 L96 192 L146 124 Z';
  const acc = accentFor(base, i + 1);
  const fab = fabric('f', print, base, acc, 1.6);
  let b = drop(d);
  b += piece(d, fab.fill, base, fold('M166 194 Q182 214 178 246') + fold('M346 194 Q330 214 334 246') + fold('M104 182 L146 214', 0.16, 2) + fold('M408 182 L366 214', 0.16, 2) + fold('M168 404 L344 404', 0.12, 2));
  b += `<path d="M214 100 Q256 122 298 100 Q256 110 214 100 Z" fill="${dk(base, 0.3)}"/>`;
  b += `<path d="M206 104 Q256 134 306 104" fill="none" stroke="${dk(base, 0.18)}" stroke-width="9" stroke-linecap="round"/>`;
  return doc(bgOf(i, 1), fab.def, b);
}

const KURTI =
  'M220 92 Q256 118 292 92 L330 102 Q348 108 356 126 L394 248 L360 262 L336 190 L342 300 L374 452 Q256 470 138 452 L170 300 L176 190 L152 262 L118 248 L156 126 Q164 108 182 102 Z';

function kurti(i) {
  const cols = [C.magenta, C.royal, C.emerald, C.mustard, C.maroon, C.peach, C.teal, C.white, C.coral, C.lavender, C.black, C.mint];
  const prints = ['floral', 'butta', 'solid', 'leaf', 'dots', 'chevron', 'floral', 'butta', 'stripe', 'leaf'];
  const base = cols[(i * 7) % cols.length];
  const acc = accentFor(base, i + 2);
  const fab = fabric('f', prints[i % prints.length], base, acc, 1);
  const trim = lum(base) < 0.5 ? '#E2B85C' : dk(base, 0.45);
  let b = drop(KURTI);
  let deco = fold('M176 190 Q190 220 186 260') + fold('M336 190 Q322 220 326 260') + fold('M214 300 Q200 380 186 448', 0.07) + fold('M298 300 Q312 380 326 448', 0.07);
  deco += `<g clip-path="url(#kc)"><rect x="100" y="424" width="312" height="50" fill="${trim}" opacity=".9"/><rect x="100" y="420" width="312" height="3" fill="#F3D27A"/>` +
    `<path d="M118 248 L152 262 L158 240 L124 226 Z" fill="${trim}" opacity=".9"/><path d="M394 248 L360 262 L354 240 L388 226 Z" fill="${trim}" opacity=".9"/></g>`;
  b += piece(KURTI, fab.fill, base, deco);
  b += `<path d="M220 92 Q256 118 292 92 Q256 104 220 92 Z" fill="${dk(base, 0.35)}"/>`;
  b += fold('M256 112 L256 150', 0.3, 2);
  // Yoke embroidery: a string of beads around the neck.
  for (let k = 0; k <= 10; k++) {
    const t = k / 10;
    const x = (1 - t) * (1 - t) * 210 + 2 * (1 - t) * t * 256 + t * t * 302;
    const y = (1 - t) * (1 - t) * 100 + 2 * (1 - t) * t * 196 + t * t * 100;
    b += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.2" fill="#F3D27A" stroke="${dk(base, 0.3)}" stroke-opacity=".3"/>`;
  }
  return doc(bgOf(i), fab.def + clip('kc', KURTI), b);
}

function mensKurta(i) {
  const base = [C.cream, C.sky, C.maroon][i % 3];
  const d = 'M216 96 Q256 112 296 96 L334 106 Q352 112 358 132 L392 330 L356 340 L338 214 L340 460 L172 460 L174 214 L156 340 L120 330 L154 132 Q160 112 178 106 Z';
  const fab = fabric('f', 'pinstripe', base, dk(base, 0.08), 0.8);
  let b = drop(d);
  b += piece(d, fab.fill, base, fold('M174 214 Q190 250 184 290') + fold('M338 214 Q322 250 328 290') + fold('M174 404 L174 460', 0.3, 2) + fold('M338 404 L338 460', 0.3, 2) + fold('M124 316 L160 326', 0.15, 2) + fold('M388 316 L352 326', 0.15, 2));
  b += piece('M216 96 Q256 112 296 96 L296 82 Q256 98 216 82 Z', fab.fill, base);
  b += piece('M250 104 L262 104 L262 226 L250 226 Z', fab.fill, base, '', { outline: 0.3 });
  for (const y of [126, 158, 190, 216]) b += `<circle cx="256" cy="${y}" r="4" fill="#C9A24A"/>`;
  return doc(bgOf(i, 2), fab.def, b);
}

// A co-ord set: the top laid over its matching bottom.
const COORD_TOPS = [
  'M214 78 Q256 100 298 78 L330 86 L386 130 Q378 162 350 170 L334 146 L336 222 Q256 232 176 222 L178 146 L162 170 Q134 162 126 130 L182 86 Z',
  'M214 78 Q256 106 298 78 L320 82 Q326 120 346 140 L342 224 Q256 234 170 224 L166 140 Q186 120 192 82 Z',
  'M214 78 Q256 100 298 78 L336 90 L374 150 L344 168 L332 140 L338 268 Q256 280 174 268 L180 140 L168 168 L138 150 L176 90 Z',
];
const COORD_BOTTOMS = [
  { d: 'M196 240 L316 240 L318 262 L366 466 Q330 474 294 466 L256 330 L218 466 Q182 474 146 466 L194 262 Z', band: 'M196 240 L316 240 L318 262 L194 262 Z' },
  { d: 'M200 240 L312 240 L316 262 L326 466 L270 466 L256 316 L242 466 L186 466 L196 262 Z', band: 'M200 240 L312 240 L316 262 L196 262 Z' },
  { d: 'M204 240 L308 240 L310 262 L364 462 Q256 478 148 462 L202 262 Z', band: 'M204 240 L308 240 L310 262 L202 262 Z' },
];

function coord(i) {
  const cols = [C.sky, C.black, C.blush, C.emerald, C.white, C.mustard, C.lilac, C.rust, C.navy, C.mint, C.wine, C.peach, C.teal, C.sand, C.coral, C.olive];
  const prints = ['solid', 'floral', 'check', 'solid', 'stripe', 'dots', 'leaf', 'solid', 'floral', 'chevron'];
  const base = cols[(i * 7) % cols.length];
  const acc = accentFor(base, i + 3);
  const fab = fabric('f', prints[i % prints.length], base, acc, 1);
  const top = COORD_TOPS[i % 3];
  const bot = COORD_BOTTOMS[Math.floor(i / 3) % 3];
  let b = drop(bot.d) + piece(bot.d, fab.fill, base, fold('M226 270 Q232 360 222 460', 0.07) + fold('M286 270 Q280 360 290 460', 0.07));
  b += `<path d="${bot.band}" fill="${dk(base, 0.14)}" opacity=".85"/>`;
  b += drop(top, 4, 8, 0.16) + piece(top, fab.fill, base, fold('M190 150 Q200 180 196 214', 0.07) + fold('M322 150 Q312 180 316 214', 0.07));
  b += `<path d="M214 78 Q256 100 298 78 Q256 90 214 78 Z" fill="${dk(base, 0.35)}"/>`;
  return doc(bgOf(i, 1), fab.def, b);
}

function blouse(i) {
  const base = [C.maroon, C.emerald][i % 2];
  const d = 'M196 150 Q226 176 256 176 Q286 176 316 150 L354 160 L392 214 L360 236 L344 214 L346 300 Q256 316 166 300 L168 214 L152 236 L120 214 L158 160 Z';
  const fab = fabric('f', 'butta', base, '#E2B85C', 0.9);
  let b = `<g transform="translate(256 256) scale(1.28) translate(-256 -232)">${drop(d)}`;
  b += piece(d, fab.fill, base, `<g clip-path="url(#bc)"><path d="M150 296 Q256 316 362 296 L362 330 L150 330 Z" fill="#E2B85C"/><path d="M120 214 L152 236 L160 222 L128 200 Z" fill="#E2B85C"/><path d="M392 214 L360 236 L352 222 L384 200 Z" fill="#E2B85C"/></g>`);
  b += `<path d="M206 152 Q228 196 256 186 Q284 196 306 152 Q284 168 256 170 Q228 168 206 152 Z" fill="${dk(base, 0.35)}"/></g>`;
  return doc(bgOf(i, 3), fab.def + clip('bc', d), b);
}

function sportsBra(i) {
  const d = 'M178 200 Q180 150 204 118 L218 114 Q226 160 256 182 Q286 160 294 114 L308 118 Q332 150 334 200 L342 292 Q256 314 170 292 Z';
  const one = (base, tr) =>
    `<g transform="${tr}">${drop(d)}` +
    piece(d, base, base, `<g clip-path="url(#sb)"><rect x="150" y="262" width="212" height="70" fill="${dk(base, 0.2)}"/></g>` + fold('M180 204 Q218 174 256 212 Q294 174 332 204', 0.16, 2.5)) +
    '</g>';
  let b;
  if (i % 2 === 0) b = `<g transform="translate(256 256) scale(1.3) translate(-256 -212)">${one(C.blush, '')}</g>`;
  else b = one(C.lilac, 'translate(-70 -40) scale(.8) translate(64 120)') + one(C.charcoal, 'translate(70 -40) scale(.8) translate(64 120)') + one(C.aqua, 'translate(0 40) scale(.8) translate(64 120)');
  return doc(bgOf(i, 4), clip('sb', d), b);
}

function trackPants(i, base) {
  const d = 'M196 104 L316 104 L320 132 L338 430 Q340 446 324 446 L282 446 Q268 446 266 432 L256 222 L246 432 Q244 446 230 446 L188 446 Q172 446 174 430 L192 132 Z';
  let b = drop(d);
  b += piece(d, base, base, `<g clip-path="url(#tp)"><rect x="160" y="104" width="200" height="28" fill="${dk(base, 0.18)}"/><rect x="160" y="424" width="200" height="30" fill="${dk(base, 0.18)}"/></g>` +
    `<path d="M194 136 L176 428" stroke="${C.white}" stroke-width="6" opacity=".85"/><path d="M318 136 L336 428" stroke="${C.white}" stroke-width="6" opacity=".85"/>` + fold('M256 140 L256 222', 0.12, 2) + fold('M214 250 Q222 330 214 420', 0.07) + fold('M298 250 Q290 330 298 420', 0.07));
  b += `<path d="M248 118 Q240 150 232 160 M264 118 Q272 150 280 160" stroke="${C.white}" stroke-width="3" fill="none"/>`;
  return doc(bgOf(i, 2), clip('tp', d), b);
}

function jacket(i, base, leather) {
  const d = 'M206 96 Q256 116 306 96 L352 110 Q372 118 380 140 L414 380 L374 392 L350 232 L348 424 L164 424 L162 232 L138 392 L98 380 L132 140 Q140 118 160 110 Z';
  let b = drop(d);
  let deco = fold('M162 232 Q178 262 172 300') + fold('M350 232 Q334 262 340 300');
  if (leather) deco += shine('M190 150 Q182 260 192 400', 0.22, 6) + shine('M330 150 Q338 260 326 400', 0.12, 6) + fold('M190 330 L226 316', 0.25, 3) + fold('M322 330 L286 316', 0.25, 3);
  else deco += `<g clip-path="url(#jk)"><rect x="140" y="402" width="232" height="26" fill="${dk(base, 0.25)}"/><path d="M98 380 L138 392 L142 370 L102 358 Z" fill="${dk(base, 0.25)}"/><path d="M414 380 L374 392 L370 370 L410 358 Z" fill="${dk(base, 0.25)}"/></g>` + fold('M196 320 L222 300', 0.25, 3) + fold('M316 320 L290 300', 0.25, 3);
  b += piece(d, base, base, deco);
  b += `<path d="M256 110 L256 424" stroke="url(#steel)" stroke-width="5"/>`;
  if (leather) b += piece('M206 96 L246 170 L256 112 Z', base, base) + piece('M306 96 L266 170 L256 112 Z', base, base);
  else b += `<path d="M206 96 Q256 116 306 96 L310 84 Q256 106 202 84 Z" fill="${dk(base, 0.25)}"/>`;
  return doc(bgOf(i, 3), clip('jk', d), b);
}

// A saree, hung over a wooden hanger so its border and pallu show.
function saree(i) {
  const cols = [C.magenta, C.royal, C.emerald, C.wine, C.peach, C.teal, C.mustard, C.coral, C.lavender, C.red];
  const base = cols[(i * 3) % cols.length];
  const border = [C.maroon, '#C9A24A', C.navy, C.emerald, C.magenta, '#C9A24A'][i % 6];
  const motif = ['butta', 'dots', 'floral', 'butta', 'leaf'][i % 5];
  const fab = fabric('f', motif, base, '#E9C46A', 0.9);
  const drape = 'M150 124 L362 124 Q368 270 384 452 Q352 464 320 456 Q288 466 256 458 Q224 466 192 456 Q160 464 128 452 Q144 270 150 124 Z';
  let deco = `<g clip-path="url(#sc)"><rect x="336" y="120" width="60" height="360" fill="${border}"/><rect x="336" y="120" width="4" height="360" fill="#F3D27A"/>` +
    `<rect x="100" y="392" width="300" height="80" fill="${border}"/><rect x="100" y="392" width="300" height="4" fill="#F3D27A"/><rect x="100" y="402" width="300" height="2" fill="#F3D27A"/>`;
  for (let x = 140; x < 340; x += 24) deco += flower(x, 430, 4.6, '#F3D27A', border);
  deco += '</g>';
  for (const x of [190, 222, 256, 290, 322]) {
    const dx = (x - 256) * 0.16;
    deco += fold(`M${x} 132 Q${f1(x + dx * 0.4)} 300 ${f1(x + dx)} 456`, 0.1, 4) + shine(`M${x + 7} 132 Q${f1(x + 7 + dx * 0.4)} 300 ${f1(x + 7 + dx)} 456`, 0.16, 3);
  }
  let b = drop(drape, 6, 12, 0.18) + piece(drape, fab.fill, base, deco);
  b += `<path d="M256 82 L256 66 Q256 46 272 46 Q288 46 288 60 Q288 72 276 74" fill="none" stroke="#9AA0A6" stroke-width="5" stroke-linecap="round"/>`;
  b += piece('M256 78 L144 118 Q138 124 146 128 L366 128 Q374 124 368 118 Z', 'url(#wood)', C.tan);
  return doc(bgOf(i, 2), fab.def + clip('sc', drape), b);
}

// ---------------------------------------------------------------- footwear

function shoe(type, base, acc) {
  if (type === 'loafer') {
    const up = 'M110 338 Q104 306 130 290 Q170 280 220 276 Q300 270 360 280 Q420 292 430 318 L434 338 Z';
    return (
      piece(up, base, base, shine('M230 286 Q320 280 400 300', 0.28, 5) + `<path d="M150 330 Q260 322 420 330" fill="none" stroke="${lt(base, 0.3)}" stroke-width="2" stroke-dasharray="6 5"/>`) +
      `<path d="M130 290 Q170 276 240 276 Q220 292 170 296 Q146 298 130 290 Z" fill="${dk(base, 0.5)}"/>` +
      `<path d="M246 282 Q266 302 304 300 Q314 290 308 276" fill="none" stroke="${acc}" stroke-width="7" stroke-linecap="round"/>` +
      piece('M98 338 L438 338 Q446 338 444 348 L440 356 L104 356 Q94 356 98 338 Z', dk(base, 0.45), base)
    );
  }
  if (type === 'derby') {
    const up = 'M108 336 Q102 296 128 276 Q164 262 210 256 Q236 240 262 238 Q320 258 372 272 Q424 288 432 318 L434 336 Z';
    let laces = '';
    for (let k = 0; k < 4; k++) laces += `<path d="M${226 + k * 16} ${250 + k * 6} l14 -12" stroke="${dk(base, 0.5)}" stroke-width="3" stroke-linecap="round"/>`;
    return (
      piece(up, base, base, shine('M300 262 Q370 274 410 296', 0.3, 5) + fold('M210 256 Q240 300 236 336', 0.18, 2)) +
      `<path d="M132 274 Q160 254 206 248 Q196 266 170 272 Q146 276 132 274 Z" fill="${dk(base, 0.55)}"/>` + laces +
      piece('M96 336 L438 336 Q446 336 444 346 L440 352 L104 352 Q94 352 96 336 Z', '#2A2522', '#2A2522') +
      piece('M104 352 L178 352 L176 370 L108 370 Z', '#2A2522', '#2A2522')
    );
  }
  // A plain sneaker: no stripes or swooshes that would read as a brand.
  const up = 'M104 338 Q98 292 124 264 L168 244 Q198 238 214 214 L262 204 Q300 234 356 262 Q414 282 428 314 L432 338 Z';
  let laces = '';
  for (let k = 0; k < 5; k++) laces += `<path d="M${226 + k * 16} ${224 + k * 8} l16 -12" stroke="${lum(base) > 0.6 ? C.charcoal : C.white}" stroke-width="4" stroke-linecap="round"/>`;
  return (
    piece(up, base, base, `<path d="M104 338 Q100 300 124 272 L150 262 Q140 300 150 338 Z" fill="${acc}"/><path d="M360 338 Q352 292 386 276 Q420 286 428 314 L432 338 Z" fill="${dk(base, 0.12)}"/>` + fold('M214 214 Q246 262 250 338', 0.12, 2)) +
    `<path d="M126 262 Q150 236 206 222 Q196 246 168 256 Q146 262 126 262 Z" fill="${dk(base, 0.5)}"/>` + laces +
    piece('M92 338 L436 338 Q446 338 446 350 L444 362 Q440 376 424 376 L104 376 Q86 376 86 358 Q86 338 92 338 Z', C.white, '#B9B4AA', `<path d="M92 356 L444 356" stroke="${acc}" stroke-width="3" opacity=".7"/>`)
  );
}

// Flat sandals read best from above: two soles, a cross strap and a toe loop.
function sandals(i, base) {
  let b = '';
  for (const [cx, flip] of [[188, 1], [324, -1]]) {
    const sole = `M${cx} 120 Q${cx + 46} 120 ${cx + 48} 190 Q${cx + 50} 260 ${cx + 36} 330 Q${cx + 32} 400 ${cx} 404 Q${cx - 32} 400 ${cx - 36} 330 Q${cx - 50} 260 ${cx - 46} 190 Q${cx - 44} 120 ${cx} 120 Z`;
    b += `<g transform="rotate(${-6 * flip} ${cx} 260)">${drop(sole, 4, 8, 0.2)}`;
    b += piece(sole, dk(base, 0.2), base, `<path d="M${cx} 132 Q${cx + 36} 134 ${cx + 38} 192 Q${cx + 40} 260 ${cx + 26} 326 Q${cx + 22} 388 ${cx} 390 Q${cx - 22} 388 ${cx - 26} 326 Q${cx - 40} 260 ${cx - 38} 192 Q${cx - 36} 134 ${cx} 132 Z" fill="${lt(base, 0.18)}"/>`);
    const strap = `M${cx - 50} 214 Q${cx} 194 ${cx + 50} 214 L${cx + 50} 262 Q${cx} 244 ${cx - 50} 262 Z`;
    b += piece(strap, base, base, `<path d="M${cx - 44} 222 Q${cx} 204 ${cx + 44} 222" fill="none" stroke="${lt(base, 0.45)}" stroke-width="2" stroke-dasharray="5 4"/>`);
    b += `<circle cx="${cx - 12 * flip}" cy="156" r="11" fill="none" stroke="${base}" stroke-width="7"/></g>`;
  }
  return doc(bgOf(i), '', b);
}

function shoesPair(i, type, base, acc) {
  if (type === 'sandal') return sandals(i, base);
  const one = shoe(type, base, acc);
  const back = `<g transform="translate(34 -34) scale(.96)">${shoe(type, dk(base, 0.12), dk(acc, 0.12))}</g>`;
  const b = floor(392, 210, 20) + `<g transform="translate(-10 18)">${back}${one}</g>`;
  return doc(bgOf(i), '', b);
}

function shoes(i) {
  const types = ['sneaker', 'sneaker', 'loafer', 'derby', 'sneaker', 'loafer', 'sneaker', 'derby', 'sneaker', 'sandal', 'sneaker', 'loafer'];
  const cols = [C.white, C.navy, C.tan, C.brown, C.black, C.charcoal, C.grey, '#3A2418', C.olive, C.tan, C.sky, C.black];
  const accs = [C.navy, C.white, C.cream, C.cream, C.red, C.tan, C.teal, C.cream, C.mustard, C.cream, C.navy, C.tan];
  return shoesPair(i, types[i % 12], cols[i % 12], accs[i % 12]);
}

// ---------------------------------------------------------------- home

function bedsheetGroup(base, acc, print, withPillows = true) {
  const fab = fabric('f', print, base, acc, 1);
  const pfab = fabric('p', print, base, acc, 0.8);
  let b = '';
  if (withPillows) {
    for (const x of [118, 260]) {
      const d = `M${x + 26} 140 L${x + 108} 140 Q${x + 134} 140 ${x + 134} 166 L${x + 134} 236 Q${x + 134} 262 ${x + 108} 262 L${x + 26} 262 Q${x} 262 ${x} 236 L${x} 166 Q${x} 140 ${x + 26} 140 Z`;
      b += drop(d, 4, 8, 0.14) + piece(d, pfab.fill, base, `<path d="${d}" fill="url(#puff)"/>`);
    }
  }
  const sheet = 'M100 252 Q256 238 412 252 L416 426 Q256 440 96 426 Z';
  b += drop(sheet, 5, 12, 0.18);
  b += piece(sheet, fab.fill, base, `<g clip-path="url(#bs)"><rect x="80" y="392" width="360" height="60" fill="${acc}" opacity=".85"/><path d="M100 252 Q256 238 412 252 L412 280 Q256 268 100 280 Z" fill="#fff" opacity=".2"/></g>` + fold('M100 280 Q256 268 412 280', 0.12, 2));
  return { def: fab.def + pfab.def + clip('bs', sheet), body: b };
}

function bedsheet(i) {
  const cols = [C.cream, C.sky, C.mint, C.blush, C.white, C.lilac, C.sand, C.aqua, C.peach, C.beige];
  const prints = ['floral', 'check', 'leaf', 'butta', 'stripe', 'floral', 'chevron', 'dots', 'leaf', 'floral'];
  const base = cols[(i * 3) % cols.length];
  const acc = [C.maroon, C.navy, C.emerald, C.magenta, C.teal, C.rust, C.royal][i % 7];
  const g = bedsheetGroup(base, acc, prints[i % prints.length]);
  return doc(bgOf(i, 1), g.def, g.body);
}

function diwanSet(i) {
  const g = bedsheetGroup(C.cream, C.maroon, 'butta', false);
  let b = `<g transform="translate(0 -70)">${g.body}</g>`;
  const cfabs = [fabric('c1', 'floral', C.maroon, C.cream, 0.8), fabric('c2', 'solid', C.mustard, C.cream), fabric('c3', 'butta', C.teal, '#E9C46A', 0.8)];
  [120, 206, 292].forEach((x, k) => {
    const d = `M${x + 14} 300 L${x + 86} 300 Q${x + 100} 300 ${x + 100} 314 L${x + 100} 386 Q${x + 100} 400 ${x + 86} 400 L${x + 14} 400 Q${x} 400 ${x} 386 L${x} 314 Q${x} 300 ${x + 14} 300 Z`;
    b += drop(d, 4, 8, 0.16) + piece(d, cfabs[k].fill, k === 1 ? C.mustard : k === 0 ? C.maroon : C.teal, `<path d="${d}" fill="url(#puff)"/>`);
  });
  return doc(bgOf(i, 2), g.def + cfabs.map((f) => f.def).join(''), b);
}

function curtain(i) {
  const base = C.lavender;
  const pleat = `<linearGradient id="pl" x1="0" x2="1"><stop offset="0" stop-color="${lt(base, 0.35)}"/><stop offset=".5" stop-color="${dk(base, 0.08)}"/><stop offset="1" stop-color="${lt(base, 0.35)}"/></linearGradient><pattern id="pp" width="30" height="40" patternUnits="userSpaceOnUse"><rect width="30" height="40" fill="url(#pl)"/></pattern>`;
  let b = '';
  for (const [x0, x1] of [[86, 246], [266, 426]]) {
    const d = `M${x0} 100 L${x1} 100 L${x1 + 4} 462 Q${(x0 + x1) / 2} 470 ${x0 - 4} 462 Z`;
    b += `<path d="${d}" fill="url(#pp)" opacity=".72"/><path d="${d}" fill="none" stroke="${dk(base, 0.3)}" stroke-opacity=".35" stroke-width="2"/>`;
  }
  b += `<path d="M66 96 L446 96" stroke="url(#steel)" stroke-width="9" stroke-linecap="round"/><circle cx="62" cy="96" r="11" fill="url(#steel)"/><circle cx="450" cy="96" r="11" fill="url(#steel)"/>`;
  for (let x = 92; x <= 420; x += 30) b += `<circle cx="${x}" cy="98" r="7" fill="none" stroke="#9AA0A6" stroke-width="3"/>`;
  return doc(bgOf(i, 5), pleat, b);
}

function speaker(i) {
  let b = floor(410, 150, 16);
  const box = 'M166 180 L346 180 Q376 180 376 210 L376 370 Q376 400 346 400 L166 400 Q136 400 136 370 L136 210 Q136 180 166 180 Z';
  let grain = '';
  for (let y = 196; y < 396; y += 22) grain += `<path d="M140 ${y} Q200 ${y - 6} 256 ${y + 2} Q320 ${y + 8} 372 ${y}" fill="none" stroke="#5A3A1E" stroke-opacity=".14" stroke-width="2"/>`;
  b += piece(box, 'url(#wood)', C.tan, grain);
  b += `<circle cx="256" cy="292" r="80" fill="#3A3634"/><circle cx="256" cy="292" r="72" fill="url(#mesh)"/><circle cx="256" cy="292" r="80" fill="none" stroke="#C9A24A" stroke-width="3" opacity=".7"/>`;
  for (const x of [222, 256, 290]) b += `<rect x="${x - 10}" y="168" width="20" height="12" rx="4" fill="#3A3634"/>`;
  const mesh = `<pattern id="mesh" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#2A2725"/><circle cx="3.5" cy="3.5" r="1.4" fill="#4A4542"/></pattern>`;
  return doc(bgOf(i, 1), mesh, b);
}

function lamp(i) {
  const glow = `<radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFD98A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient><radialGradient id="face" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FFF6DD"/><stop offset=".7" stop-color="#F9D27C"/><stop offset="1" stop-color="#E7A93E"/></radialGradient>`;
  let b = `<circle cx="256" cy="240" r="190" fill="url(#glow)"/>`;
  b += piece('M226 330 L286 330 L290 398 Q290 410 278 410 L234 410 Q222 410 222 398 Z', '#EDEBE6', '#C9C5BD');
  b += `<path d="M244 410 L244 440 M268 410 L268 440" stroke="url(#steel)" stroke-width="7" stroke-linecap="round"/>`;
  b += `<circle cx="256" cy="240" r="96" fill="url(#face)" stroke="#D99A33" stroke-width="4"/>`;
  // A plain lotus, three petals, in the lamp's face.
  b += `<path d="M256 196 Q284 236 256 276 Q228 236 256 196 Z M256 276 Q206 268 196 226 Q236 230 256 276 Z M256 276 Q306 268 316 226 Q276 230 256 276 Z" fill="#E7A93E" opacity=".75"/>`;
  return doc('#E9E4DA', glow, b);
}

function incense(i) {
  let b = floor(404, 160, 18);
  b += `<path d="M300 132 C280 104 330 86 304 54 C292 38 316 26 310 12" fill="none" stroke="#8A8A8A" stroke-opacity=".35" stroke-width="3"/>`;
  b += `<path d="M256 302 L298 136" stroke="#5B3A24" stroke-width="4.5" stroke-linecap="round"/><circle cx="298" cy="134" r="5" fill="#F07A2A"/>`;
  b += `<path d="M232 302 L210 150" stroke="#5B3A24" stroke-width="4.5" stroke-linecap="round"/><circle cx="210" cy="148" r="5" fill="#F07A2A"/>`;
  b += piece('M126 380 Q256 342 386 380 Q386 414 256 416 Q126 414 126 380 Z', 'url(#brass)', '#A97C30');
  b += `<ellipse cx="256" cy="380" rx="112" ry="22" fill="#8A6424" opacity=".55"/>`;
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    b += `<circle cx="${f1(256 + Math.cos(a) * 98)}" cy="${f1(380 + Math.sin(a) * 18)}" r="3" fill="#F0D48E"/>`;
  }
  b += piece('M232 372 L280 372 L272 310 L240 310 Z', 'url(#brass)', '#A97C30');
  b += `<ellipse cx="256" cy="306" rx="44" ry="12" fill="url(#brass)" stroke="#7C5A1E" stroke-opacity=".5"/>`;
  return doc(bgOf(i, 4), '', b);
}

// ---------------------------------------------------------------- kitchen

function bottle(i, colour = null, x = 0, scale = 1) {
  const body = 'M226 166 L286 166 Q318 186 318 222 L318 432 Q318 448 302 448 L210 448 Q194 448 194 432 L194 222 Q194 186 226 166 Z';
  const fill = !colour ? 'url(#steel)' : colour === 'copper' ? 'url(#copper)' : colour;
  const base = !colour ? '#AEB4BA' : colour === 'copper' ? '#B87333' : colour;
  return (
    `<g transform="translate(${x} 0) translate(256 448) scale(${scale}) translate(-256 -448)">` +
    piece(body, fill, base, shine('M214 220 L214 420', 0.35, 6)) +
    `<rect x="230" y="150" width="52" height="18" fill="url(#steel)"/>` +
    piece('M226 100 L286 100 Q292 100 292 108 L292 150 L220 150 L220 108 Q220 100 226 100 Z', colour ? 'url(#ebony)' : dk(C.teal, 0.1), '#333') +
    `<path d="M238 102 Q256 64 274 102" fill="none" stroke="#3A3A3E" stroke-width="8" stroke-linecap="round"/></g>`
  );
}

function bottles(i) {
  const cols = [null, C.teal, C.coral, C.navy, 'copper', C.mint, C.black, C.mustard];
  const c = cols[i % cols.length];
  let b = floor(450, 150, 16);
  if (i % 2 === 1) b += bottle(i, cols[(i + 3) % cols.length] || C.charcoal, 72, 0.86) + bottle(i, c, -40, 1);
  else b += bottle(i, c, 0, 1);
  return doc(bgOf(i, 2), '', b);
}

function cooker(i) {
  // Steel or hard-anodised black, straight or handi-shaped, and two with a
  // lid in the other finish, so no two of the six match.
  const [black, handi, otherLid] = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1]][i % 6];
  const fill = black ? 'url(#ebony)' : 'url(#steel)';
  const base = black ? '#333' : '#AEB4BA';
  const lid = otherLid ? (black ? 'url(#steel)' : 'url(#ebony)') : fill;
  const body = handi
    ? 'M156 252 Q118 330 168 420 Q256 448 344 420 Q394 330 356 252 Z'
    : 'M150 252 L362 252 Q366 252 366 258 L358 410 Q356 432 330 434 L182 434 Q156 432 154 410 L146 258 Q146 252 150 252 Z';
  let b = floor(440, 190, 18);
  b += piece('M350 262 L466 250 Q478 250 478 260 L478 266 Q478 274 466 274 L352 280 Z', '#1E1E21', '#111');
  b += piece('M146 262 L104 260 Q94 260 94 268 Q94 276 104 276 L148 276 Z', '#1E1E21', '#111');
  b += piece(body, fill, base, shine('M180 280 Q170 350 184 410', 0.35, 6));
  b += piece('M140 254 Q256 212 372 254 Z', lid, base);
  b += piece('M300 236 L462 214 Q474 212 476 224 L478 232 Q478 242 466 244 L304 252 Z', '#1E1E21', '#111');
  b += piece('M246 214 L266 214 L264 194 Q256 186 248 194 Z', 'url(#steel)', '#AEB4BA') + `<circle cx="256" cy="188" r="8" fill="#1E1E21"/>`;
  return doc(bgOf(i, 3), '', b);
}

function mug(i, base, print) {
  const acc = accentFor(base, i);
  const fab = fabric('f', print, base, acc, 1.2);
  const body = 'M176 196 L316 196 L310 412 Q308 428 292 428 L200 428 Q184 428 182 412 Z';
  let b = floor(434, 140, 14);
  if (i % 2 === 0) b += piece('M120 428 Q246 400 372 428 Q372 446 246 452 Q120 446 120 428 Z', C.white, '#BDB8AE');
  b += `<path d="M314 236 Q374 236 374 300 Q374 360 312 360" fill="none" stroke="${base}" stroke-width="22"/><path d="M314 236 Q374 236 374 300 Q374 360 312 360" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="22"/>`;
  b += piece(body, fab.fill, base);
  b += `<ellipse cx="246" cy="196" rx="70" ry="14" fill="${lt(base, 0.2)}" stroke="${dk(base, 0.3)}" stroke-opacity=".4"/><ellipse cx="246" cy="198" rx="60" ry="9" fill="${dk(base, 0.35)}"/>`;
  return doc(bgOf(i, 4), fab.def, b);
}

function flaskSet(i, black) {
  const fill = black ? 'url(#ebony)' : 'url(#steel)';
  let b = floor(440, 190, 16);
  const flask = 'M206 150 L286 150 L292 180 L292 428 Q292 444 276 444 L216 444 Q200 444 200 428 L200 180 Z';
  b += piece(flask, fill, '#666', shine('M214 190 L214 420', 0.3, 6)) + piece('M210 104 L282 104 L286 150 L206 150 Z', 'url(#steel)', '#999');
  for (const x of [130, 382]) {
    const d = `M${x - 44} 360 L${x + 44} 360 L${x + 38} 438 Q${x + 36} 446 ${x + 28} 446 L${x - 28} 446 Q${x - 36} 446 ${x - 38} 438 Z`;
    b += piece(d, fill, '#666') + `<ellipse cx="${x}" cy="360" rx="44" ry="8" fill="#222" opacity=".5"/>`;
  }
  return doc(bgOf(i, 1), '', b);
}

function containers(i) {
  const lids = [[C.mint, C.coral, C.sky], [C.lilac, C.mustard, C.teal]][i % 2];
  let b = floor(430, 200, 16);
  const box = (x, y, w, h, lid) =>
    piece(`M${x} ${y} L${x + w} ${y} L${x + w - 6} ${y + h} Q${x + w - 8} ${y + h + 8} ${x + w - 16} ${y + h + 8} L${x + 16} ${y + h + 8} Q${x + 8} ${y + h + 8} ${x + 6} ${y + h} Z`, '#F7F7F5', '#BDBAB2', `<path d="M${x + 10} ${y + 20} L${x + w - 10} ${y + 20} L${x + w - 14} ${y + h - 8} L${x + 14} ${y + h - 8} Z" fill="${lid}" opacity=".18"/>`) +
    piece(`M${x - 6} ${y - 18} L${x + w + 6} ${y - 18} Q${x + w + 10} ${y - 18} ${x + w + 10} ${y - 10} L${x + w + 10} ${y} L${x - 10} ${y} L${x - 10} ${y - 10} Q${x - 10} ${y - 18} ${x - 6} ${y - 18} Z`, lid, lid);
  b += box(120, 322, 130, 100, lids[0]) + box(262, 322, 130, 100, lids[1]) + box(190, 206, 132, 96, lids[2]);
  return doc(bgOf(i, 2), '', b);
}

function ladles(i) {
  let b = '';
  b += `<g transform="rotate(-18 256 256)">${drop('M244 70 L268 70 L268 300 L244 300 Z')}${piece('M244 70 Q256 60 268 70 L266 300 L246 300 Z', 'url(#steel)', '#999')}${piece('M196 300 Q256 286 316 300 Q320 380 256 392 Q192 380 196 300 Z', 'url(#steel)', '#999', `<ellipse cx="256" cy="306" rx="56" ry="12" fill="#6E747A" opacity=".5"/>`)}</g>`;
  b += `<g transform="rotate(16 300 256)">${piece('M318 70 Q330 60 342 70 L340 300 L320 300 Z', 'url(#steel)', '#999')}${piece('M296 300 L364 300 L372 410 Q330 424 288 410 Z', 'url(#steel)', '#999', `<path d="M314 330 L314 392 M330 330 L330 396 M346 330 L346 392" stroke="#6E747A" stroke-width="5" stroke-linecap="round" opacity=".6"/>`)}</g>`;
  return doc(bgOf(i, 3), '', b);
}

function oilDispenser(i) {
  const glass = 'M200 196 Q200 170 226 166 L286 166 Q312 170 312 196 L312 424 Q312 444 292 444 L220 444 Q200 444 200 424 Z';
  let b = floor(448, 120, 14);
  b += `<g clip-path="url(#og)"><rect x="190" y="250" width="140" height="200" fill="#E3B23C" opacity=".9"/><rect x="190" y="250" width="140" height="8" fill="#F2D27A"/></g>`;
  b += `<path d="${glass}" fill="#fff" opacity=".28"/><path d="${glass}" fill="none" stroke="#8C9399" stroke-opacity=".6" stroke-width="3"/>` + shine('M212 200 L212 420', 0.6, 5);
  b += piece('M232 128 L280 128 L284 166 L228 166 Z', 'url(#steel)', '#999');
  b += `<path d="M266 128 L300 92" stroke="url(#steel)" stroke-width="8" stroke-linecap="round"/>`;
  return doc(bgOf(i, 5), clip('og', glass), b);
}

function casserole(i, base) {
  let b = floor(430, 180, 16);
  b += piece('M110 300 L136 290 L136 320 L110 314 Z', '#2B2B30', '#111') + piece('M402 300 L376 290 L376 320 L402 314 Z', '#2B2B30', '#111');
  b += piece('M136 262 L376 262 L366 400 Q362 424 336 424 L176 424 Q150 424 146 400 Z', base, base, `<rect x="136" y="300" width="240" height="14" fill="url(#steel)"/>`);
  b += piece('M130 262 Q256 196 382 262 Z', 'url(#steel)', '#999') + `<ellipse cx="256" cy="222" rx="22" ry="10" fill="#2B2B30"/>`;
  return doc(bgOf(i, 6), '', b);
}

function plate(i) {
  let b = `<ellipse cx="262" cy="306" rx="176" ry="124" fill="#000" opacity=".16" filter="url(#soft)"/>`;
  b += `<ellipse cx="256" cy="290" rx="176" ry="124" fill="#FBFAF7" stroke="#C9C5BD" stroke-width="2"/><ellipse cx="256" cy="294" rx="126" ry="86" fill="#F3F1EC" stroke="#DAD6CE" stroke-width="2"/>`;
  b += flower(184, 250, 14, C.maroon, '#E9C46A') + flower(214, 236, 9, C.pink, '#E9C46A');
  b += `<ellipse cx="200" cy="270" rx="22" ry="8" fill="${C.emerald}" transform="rotate(-30 200 270)"/><ellipse cx="166" cy="232" rx="18" ry="7" fill="${C.emerald}" transform="rotate(40 166 232)"/>`;
  return doc(bgOf(i, 7), '', b);
}

function jugSet(i) {
  const tint = [C.lavender, C.mint][i % 2];
  let b = floor(440, 190, 16);
  const jug = 'M190 170 L300 170 Q314 250 318 420 Q318 436 302 436 L204 436 Q188 436 188 420 Q190 250 190 170 Z';
  b += `<path d="M300 210 Q352 214 350 280 Q348 340 312 344" fill="none" stroke="${dk(tint, 0.2)}" stroke-width="16" opacity=".8"/>`;
  b += `<path d="${jug}" fill="${tint}" opacity=".75"/><path d="${jug}" fill="none" stroke="${dk(tint, 0.35)}" stroke-width="3"/>` + shine('M204 190 L200 420', 0.5, 6);
  b += `<path d="M186 170 L172 154 L200 162 Z" fill="${tint}"/>`;
  for (const x of [372, 432]) {
    const d = `M${x - 30} 330 L${x + 30} 330 L${x + 24} 436 L${x - 24} 436 Z`;
    b += `<path d="${d}" fill="${tint}" opacity=".7"/><path d="${d}" fill="none" stroke="${dk(tint, 0.35)}" stroke-width="2.5"/>`;
  }
  return doc(bgOf(i, 1), '', b);
}

function idliStand(i) {
  let b = floor(440, 150, 16);
  b += `<rect x="250" y="96" width="12" height="340" rx="5" fill="url(#steel)"/><circle cx="256" cy="94" r="12" fill="url(#steel)"/>`;
  for (const y of [190, 280, 370]) {
    b += piece(`M136 ${y} Q256 ${y - 36} 376 ${y} Q256 ${y + 36} 136 ${y} Z`, 'url(#steel)', '#999');
    for (const [dx, dy] of [[-70, 0], [70, 0], [-24, -16], [24, 16], [-24, 16], [24, -16]].slice(0, 4)) b += `<ellipse cx="${256 + dx}" cy="${y + dy * 0.6}" rx="26" ry="9" fill="#7A8086" opacity=".45"/>`;
  }
  return doc(bgOf(i, 2), '', b);
}

function tiffin(i) {
  let b = floor(440, 150, 16);
  for (const [k, y] of [[0, 330], [1, 236], [2, 142]].map(([k, y]) => [k, y])) {
    b += piece(`M176 ${y} L336 ${y} L336 ${y + 92} Q336 ${y + 100} 328 ${y + 100} L184 ${y + 100} Q176 ${y + 100} 176 ${y + 92} Z`, 'url(#steel)', '#999');
    b += `<rect x="170" y="${y - 4}" width="172" height="10" rx="5" fill="url(#steel)" stroke="#7F868D" stroke-opacity=".5"/>`;
  }
  b += `<path d="M164 420 L164 120 Q164 96 196 96 L316 96 Q348 96 348 120 L348 420" fill="none" stroke="#7F868D" stroke-width="8"/><path d="M226 96 Q256 62 286 96" fill="none" stroke="#7F868D" stroke-width="8"/>`;
  return doc(bgOf(i, 3), '', b);
}

function spiceBox(i) {
  let b = `<circle cx="262" cy="270" r="168" fill="#000" opacity=".18" filter="url(#soft)"/>`;
  b += `<circle cx="256" cy="256" r="168" fill="url(#steel)"/><circle cx="256" cy="256" r="152" fill="#C3C8CD"/>`;
  const spices = ['#E3A21A', '#C8333C', '#8A5A32', '#4A3A2A', '#7A9A3A', '#A0522D', '#F4F1EA'];
  const cups = [[256, 256]];
  for (let k = 0; k < 6; k++) cups.push([256 + Math.cos((k / 6) * Math.PI * 2) * 96, 256 + Math.sin((k / 6) * Math.PI * 2) * 96]);
  cups.forEach(([x, y], k) => {
    b += `<circle cx="${f1(x)}" cy="${f1(y)}" r="44" fill="url(#steel)"/><circle cx="${f1(x)}" cy="${f1(y)}" r="36" fill="${spices[k]}"/><circle cx="${f1(x - 10)}" cy="${f1(y - 10)}" r="14" fill="#fff" opacity=".18"/>`;
  });
  return doc(bgOf(i, 4), '', b);
}

// ---------------------------------------------------------------- beauty, baby, accessories

function lipstick(i) {
  const shades = ['#B3122E', '#C9706A', '#D9487A', '#6E1A2A', '#E8624E', '#7A2E5A', '#8C4A3A', '#E79A88'];
  const shade = shades[i % shades.length];
  const tube = ['url(#gold)', 'url(#ebony)', 'url(#gold)', 'url(#ebony)'][i % 4];
  let b = floor(452, 120, 14);
  b += piece('M196 300 L266 300 L266 444 Q266 452 258 452 L204 452 Q196 452 196 444 Z', tube, '#555');
  b += `<rect x="196" y="300" width="70" height="12" fill="url(#gold)"/>`;
  b += piece('M206 236 L256 236 L256 300 L206 300 Z', 'url(#gold)', '#8C6A22');
  b += piece('M210 238 L210 184 Q210 176 216 172 L250 146 Q254 144 254 150 L254 238 Z', shade, shade, shine('M218 182 L218 232', 0.35, 5));
  b += piece('M292 318 L360 318 L360 444 Q360 452 352 452 L300 452 Q292 452 292 444 Z', tube, '#555') + `<rect x="292" y="432" width="68" height="10" fill="url(#gold)"/>`;
  return doc(bgOf(i, 5), '', b);
}

function softPack(i, base, window, motif) {
  const body = 'M146 140 Q146 120 166 120 L346 120 Q366 120 366 140 L376 420 Q376 446 350 446 L162 446 Q136 446 136 420 Z';
  let b = drop(body, 6, 12, 0.2);
  let deco = `<path d="${body}" fill="url(#puff)"/><path d="M146 120 L366 120 L366 148 L146 148 Z" fill="#fff" opacity=".4"/>`;
  deco += `<path d="M146 148 ${Array.from({ length: 22 }, (_, k) => `L${146 + k * 10 + 5} ${k % 2 ? 148 : 154}`).join(' ')} L366 148" fill="none" stroke="${dk(base, 0.25)}" stroke-opacity=".4" stroke-width="2"/>`;
  deco += motif;
  b += piece(body, base, base, deco);
  b += window;
  return b;
}

function diaper(i) {
  const cols = [C.sky, C.mint, C.lilac, C.peach];
  const base = cols[i % cols.length];
  let motif = '';
  for (const [x, y, s] of [[186, 190, 1], [326, 210, 0.8], [180, 396, 0.7], [334, 404, 0.9]]) motif += `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".85"><circle cx="-14" cy="4" r="12"/><circle cx="0" cy="-4" r="16"/><circle cx="16" cy="4" r="12"/><rect x="-26" y="4" width="54" height="12" rx="6"/></g>`;
  for (const [x, y] of [[230, 180], [290, 176], [262, 400]]) motif += `<path d="M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y - 2} L${x + 4} ${y + 2} L${x + 6} ${y + 9} L${x} ${y + 5} L${x - 6} ${y + 9} L${x - 4} ${y + 2} L${x - 9} ${y - 2} L${x - 3} ${y - 3} Z" fill="${C.mustard}"/>`;
  const win = `<rect x="196" y="236" width="120" height="124" rx="26" fill="#fff" stroke="${dk(base, 0.25)}" stroke-opacity=".4" stroke-width="2"/><path d="M220 262 L292 262 Q300 300 284 334 L228 334 Q212 300 220 262 Z" fill="#F4F6F8" stroke="#C9D1D8" stroke-width="2"/><path d="M220 262 L292 262 L292 274 L220 274 Z" fill="${base}" opacity=".7"/>`;
  return doc(bgOf(i, 6), '', softPack(i, base, win, motif));
}

function pads(i) {
  const base = '#C95A9A';
  let motif = '';
  for (const [x, y, a] of [[190, 200, -30], [320, 196, 30], [196, 400, 20], [318, 404, -20]]) motif += `<ellipse cx="${x}" cy="${y}" rx="22" ry="9" fill="#F6D3E6" transform="rotate(${a} ${x} ${y})"/><ellipse cx="${x + 10}" cy="${y + 12}" rx="16" ry="7" fill="#F6D3E6" transform="rotate(${a + 50} ${x + 10} ${y + 12})"/>`;
  const win = `<rect x="196" y="236" width="120" height="124" rx="26" fill="#fff" stroke="${dk(base, 0.25)}" stroke-opacity=".4" stroke-width="2"/><path d="M256 252 Q290 252 288 298 Q290 344 256 344 Q222 344 224 298 Q222 252 256 252 Z" fill="#F7F3F6" stroke="#E2C9D6" stroke-width="2"/><path d="M224 290 L206 300 L224 310 M288 290 L306 300 L288 310" fill="#F7F3F6" stroke="#E2C9D6" stroke-width="2"/>`;
  return doc(bgOf(i, 7), '', softPack(i, base, win, motif));
}

function hairStick(i) {
  let b = floor(436, 110, 12);
  b += piece('M220 150 L262 150 L262 424 Q262 432 254 432 L228 432 Q220 432 220 424 Z', 'url(#ebony)', '#222', `<rect x="220" y="300" width="42" height="10" fill="url(#gold)"/>`);
  b += `<path d="M224 150 Q241 112 258 150 Z" fill="#3A2A22"/>`;
  b += piece('M290 250 L334 250 L334 424 Q334 432 326 432 L298 432 Q290 432 290 424 Z', 'url(#ebony)', '#222', `<rect x="290" y="410" width="44" height="8" fill="url(#gold)"/>`);
  return doc(bgOf(i, 1), '', b);
}

function lunchBag(i) {
  const base = C.navy;
  const body = 'M136 216 Q136 196 156 196 L356 196 Q376 196 376 216 L376 418 Q376 438 356 438 L156 438 Q136 438 136 418 Z';
  let b = `<path d="M196 200 Q196 128 256 128 Q316 128 316 200" fill="none" stroke="${dk(base, 0.2)}" stroke-width="16" stroke-linecap="round"/>`;
  b += drop(body);
  b += piece(body, base, base, `<path d="M150 214 Q256 204 362 214" fill="none" stroke="#C9CDD2" stroke-width="5" stroke-dasharray="3 3"/>` + piece('M166 300 L346 300 L346 396 Q346 410 332 410 L180 410 Q166 410 166 396 Z', dk(base, 0.12), base) + `<path d="M176 312 L336 312" stroke="#C9CDD2" stroke-width="4" stroke-dasharray="3 3"/>`);
  b += `<rect x="350" y="204" width="18" height="26" rx="4" fill="url(#steel)"/>`;
  return doc(bgOf(i, 2), '', b);
}

function watch(i, kind = 'bracelet', dialColour = C.white) {
  let strap = '';
  if (kind === 'bracelet') {
    const metal = i % 2 ? 'url(#steel)' : 'url(#gold)';
    strap += piece('M222 50 L290 50 L284 190 L228 190 Z', metal, '#999') + piece('M228 322 L284 322 L290 462 L222 462 Z', metal, '#999');
    for (let y = 66; y < 190; y += 18) strap += fold(`M224 ${y} L288 ${y}`, 0.18, 2);
    for (let y = 338; y < 462; y += 18) strap += fold(`M224 ${y} L288 ${y}`, 0.18, 2);
  } else {
    const leather = kind === 'brown' ? C.brown : '#1F1F22';
    strap += piece('M224 50 L288 50 L284 190 L228 190 Z', leather, leather, `<path d="M232 56 L236 186 M280 56 L276 186" stroke="${lt(leather, 0.4)}" stroke-width="2" stroke-dasharray="5 4"/>`);
    strap += piece('M228 322 L284 322 L288 462 L224 462 Z', leather, leather, `<path d="M236 326 L232 456 M276 326 L280 456" stroke="${lt(leather, 0.4)}" stroke-width="2" stroke-dasharray="5 4"/>`);
  }
  let b = strap;
  const caseFill = kind === 'bracelet' ? (i % 2 ? 'url(#steel)' : 'url(#gold)') : 'url(#steel)';
  b += `<circle cx="262" cy="266" r="84" fill="#000" opacity=".18" filter="url(#soft)"/><rect x="332" y="246" width="16" height="20" rx="3" fill="url(#steel)"/>`;
  b += `<circle cx="256" cy="256" r="84" fill="${caseFill}"/><circle cx="256" cy="256" r="68" fill="${dialColour}"/>`;
  const ink = lum(dialColour) > 0.5 ? '#2B2B30' : '#F0E6CC';
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const r1 = k % 3 === 0 ? 50 : 56;
    b += `<path d="M${f1(256 + Math.cos(a) * r1)} ${f1(256 + Math.sin(a) * r1)} L${f1(256 + Math.cos(a) * 62)} ${f1(256 + Math.sin(a) * 62)}" stroke="${ink}" stroke-width="${k % 3 === 0 ? 5 : 3}" stroke-linecap="round"/>`;
  }
  b += `<path d="M256 256 L256 214" stroke="${ink}" stroke-width="6" stroke-linecap="round"/><path d="M256 256 L298 272" stroke="${ink}" stroke-width="4" stroke-linecap="round"/><path d="M256 256 L226 300" stroke="#C8333C" stroke-width="2" stroke-linecap="round"/><circle cx="256" cy="256" r="6" fill="${ink}"/>`;
  b += `<path d="M206 206 A70 70 0 0 1 300 196" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6"/>`;
  return doc(bgOf(i, 3), '', b);
}

function wallet(i, base) {
  const d = 'M158 176 L354 176 Q376 176 376 198 L376 334 Q376 356 354 356 L158 356 Q136 356 136 334 L136 198 Q136 176 158 176 Z';
  let b = drop(d, 6, 12, 0.22);
  b += piece(d, base, base, `<path d="M150 190 L362 190 L362 342 L150 342 Z" fill="none" stroke="${lt(base, 0.35)}" stroke-width="2.5" stroke-dasharray="7 5" rx="12"/>` + shine('M160 200 L350 200', 0.2, 4) + fold('M136 226 L376 226', 0.2, 2));
  return doc(bgOf(i, 4), '', b);
}

function sunglasses(i, frame, lens) {
  const lensDef = `<linearGradient id="lens" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${dk(lens, 0.5)}"/><stop offset="1" stop-color="${lens}"/></linearGradient>`;
  const L = 'M118 214 Q118 198 134 196 L222 194 Q240 194 238 214 Q232 274 186 282 Q136 286 124 254 Z';
  const R = 'M394 214 Q394 198 378 196 L290 194 Q272 194 274 214 Q280 274 326 282 Q376 286 388 254 Z';
  let b = floor(330, 150, 14);
  b += `<path d="M120 204 L76 190 M392 204 L436 190" stroke="${frame}" stroke-width="9" stroke-linecap="round"/>`;
  for (const d of [L, R]) b += `<path d="${d}" fill="url(#lens)"/><path d="${d}" fill="none" stroke="${frame}" stroke-width="9" stroke-linejoin="round"/>`;
  b += `<path d="M238 206 Q256 194 274 206" fill="none" stroke="${frame}" stroke-width="8" stroke-linecap="round"/>`;
  b += shine('M146 214 L196 210', 0.45, 5) + shine('M302 210 L352 214', 0.45, 5);
  return doc(bgOf(i, 5), lensDef, b);
}

function earrings(i) {
  const silver = i % 2 === 1;
  const metal = silver ? 'url(#steel)' : 'url(#gold)';
  const gem = silver ? C.emerald : C.red;
  const bead = silver ? '#7FBF9A' : '#F7F3EA';
  let b = '';
  for (const cx of [180, 332]) {
    b += `<circle cx="${cx + 6}" cy="${250 + 10}" r="60" fill="#000" opacity=".14" filter="url(#soft)"/>`;
    b += `<circle cx="${cx}" cy="124" r="20" fill="${metal}"/><circle cx="${cx}" cy="124" r="9" fill="${gem}"/>`;
    b += `<rect x="${cx - 3}" y="144" width="6" height="40" fill="${metal}"/>`;
    const dome = `M${cx - 62} 300 Q${cx - 54} 192 ${cx} 186 Q${cx + 54} 192 ${cx + 62} 300 Z`;
    b += piece(dome, metal, silver ? '#999' : '#8C6A22', fold(`M${cx - 56} 270 Q${cx} 254 ${cx + 56} 270`, 0.25, 2) + fold(`M${cx - 40} 230 Q${cx} 218 ${cx + 40} 230`, 0.25, 2));
    b += `<rect x="${cx - 64}" y="296" width="128" height="10" rx="5" fill="${metal}"/>`;
    for (let x = cx - 56; x <= cx + 56; x += 14) b += `<path d="M${x} 306 L${x} 326" stroke="${silver ? '#999' : '#B88E3A'}" stroke-width="2"/><circle cx="${x}" cy="332" r="6" fill="${bead}" stroke="#0002"/>`;
  }
  return doc(bgOf(i, 6), '', b);
}

function cable(i) {
  const col = i % 2 ? C.white : '#2B2B30';
  let b = '';
  for (let k = 0; k < 4; k++) b += `<ellipse cx="${250 + k * 6}" cy="${262 + k * 4}" rx="${120 - k * 6}" ry="${78 - k * 3}" fill="none" stroke="${col}" stroke-width="10" transform="rotate(-12 256 266)" stroke-opacity=".96"/><ellipse cx="${250 + k * 6}" cy="${262 + k * 4}" rx="${120 - k * 6}" ry="${78 - k * 3}" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="10" transform="rotate(-12 256 266)"/>`;
  b = `<ellipse cx="262" cy="292" rx="150" ry="96" fill="#000" opacity=".12" filter="url(#soft)"/>` + b;
  b += `<path d="M150 318 Q120 380 136 420" fill="none" stroke="${col}" stroke-width="10"/><path d="M360 220 Q400 170 392 128" fill="none" stroke="${col}" stroke-width="10"/>`;
  const head = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})">${piece('M-17 -36 L17 -36 L17 20 Q17 28 9 28 L-9 28 Q-17 28 -17 20 Z', col, '#777')}<rect x="-9" y="-60" width="18" height="26" rx="3" fill="url(#steel)"/></g>`;
  b += head(392, 126, 8) + head(138, 432, 188);
  return doc(bgOf(i, 7), '', b);
}

// ---------------------------------------------------------------- pools

// The menswear and kitchen fallbacks are mixed baskets in the bundle (its
// "Men" and "Kitchen Utility" fallback images showed watches, tees, jackets,
// mugs, flasks …), so their pools are mixed too.
const MENSWEAR = [
  (i) => tee(i, C.black), (i) => watch(i, 'bracelet', C.navy), (i) => trackPants(i, C.charcoal), (i) => jacket(i, C.tan, true),
  (i) => shoesPair(i, 'sneaker', C.white, C.navy), (i) => wallet(i, C.brown), (i) => tee(i, C.white, 'hstripe'), (i) => sunglasses(i, '#2B2B30', '#C97B3A'),
  (i) => shoesPair(i, 'sandal', C.tan, C.cream), (i) => jacket(i, C.olive, false), (i) => watch(i, 'brown', C.white), (i) => shoesPair(i, 'loafer', C.brown, C.cream),
];
const KITCHEN = [
  (i) => mug(i, C.white, 'dots'), (i) => flaskSet(i, false), (i) => containers(i), (i) => ladles(i),
  (i) => oilDispenser(i), (i) => casserole(i, C.red), (i) => plate(i), (i) => jugSet(i),
  (i) => idliStand(i), (i) => mug(i, C.sand, 'leaf'), (i) => tiffin(i), (i) => spiceBox(i),
];

// kind → { size, draw(i) }. Sizes follow how many distinct pictures of the kind
// the bundle used: the big feeds (shirts, co-ords) get the most variety.
export const POOLS = {
  shirt: { size: 16, draw: shirt },
  coord: { size: 16, draw: coord },
  shoes: { size: 12, draw: shoes },
  kurti: { size: 9, draw: kurti },
  saree: { size: 7, draw: saree },
  bedsheet: { size: 10, draw: bedsheet },
  bottle: { size: 8, draw: bottles },
  lipstick: { size: 8, draw: lipstick },
  cooker: { size: 6, draw: cooker },
  diaper: { size: 4, draw: diaper },
  menswear: { size: MENSWEAR.length, draw: (i) => MENSWEAR[i](i) },
  kitchen: { size: KITCHEN.length, draw: (i) => KITCHEN[i](i) },
  // One-offs: the interview participants' past orders.
  watch: { size: 1, draw: (i) => watch(i + 1, 'bracelet', '#1F1F22') },
  speaker: { size: 1, draw: speaker },
  hairstick: { size: 1, draw: hairStick },
  lunchbag: { size: 1, draw: lunchBag },
  kurta: { size: 1, draw: mensKurta },
  diwan: { size: 1, draw: diwanSet },
  incense: { size: 2, draw: (i) => (i === 0 ? incense(i) : lamp(i)) },
  sportsbra: { size: 2, draw: sportsBra },
  earrings: { size: 2, draw: earrings },
  cable: { size: 1, draw: cable },
  blouse: { size: 1, draw: blouse },
  curtain: { size: 1, draw: curtain },
  pads: { size: 1, draw: pads },
};

// The sandbox's profile picture: a drawn, faceless figure, not a person.
export function avatar() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F3D9CF"/><stop offset="1" stop-color="#E8C2B4"/></linearGradient></defs>
<rect width="160" height="160" fill="url(#a)"/><path d="M28 160 Q30 118 80 112 Q130 118 132 160 Z" fill="#8E2A3C"/><rect x="70" y="92" width="20" height="24" rx="8" fill="#B97A5C"/>
<path d="M46 74 Q44 30 80 28 Q116 30 114 74 Q116 104 104 116 L56 116 Q44 104 46 74 Z" fill="#2B2321"/><ellipse cx="80" cy="70" rx="26" ry="31" fill="#C68B6A"/><path d="M54 62 Q60 36 84 38 Q104 40 108 62 Q92 50 72 52 Q60 54 54 62 Z" fill="#2B2321"/></svg>`;
}

// The app's own grey fallbacks, as they looked on placehold.co, now local.
export function placeholder(w, h, label) {
  const size = Math.round(Math.min(w, h) / (label === 'Product' ? 10 : 4.4));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="#e2e8f0"/><text x="${w / 2}" y="${h / 2}" fill="#64748b" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${size}" text-anchor="middle" dominant-baseline="central">${label}</text></svg>\n`;
}
