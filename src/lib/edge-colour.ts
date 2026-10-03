// What colour a phone screen's edge is, from a band of its pixels — shared by
// the build (src/lib/screen-edges.ts reads each export with sharp) and the
// browser (CaseTeaser's script reads a playing clip's frames), so a still and
// a clip settle on the same answer.
//
// The case pages' phone mock draws a status bar above the screen and a home
// strip under it, inside the bezel (Uttham, 2026-10-03: "create a realisitic
// phone mock that renders this"), so the island and the clock never sit over
// the export's own top row. Each strip takes the colour of the screen edge it
// meets, as an app's own status bar does, and device and screenshot read as
// one screen.
//
// An edge's colour is the most common one along the band (quantised to 32
// levels a channel, then averaged within that level), not the band's mean: a
// white bottom nav with one purple tab in it is white.

export type Ink = 'dark' | 'light';
export type Edge = { top: string; topInk: Ink; foot: string; footInk: Ink };
export type Band = { rgb: number[]; share: number };

export const WHITE_EDGE: Edge = { top: '#ffffff', topInk: 'dark', foot: '#ffffff', footInk: 'dark' };
// an edge whose commonest colour covers less than this share of it is busy
const BUSY = 0.5;
// --ink-900, the dark the strips' clock and glyphs take on a light edge
const INK_900 = [0x16, 0x14, 0x0e];

const toHex = (rgb: number[]) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;

// WCAG relative luminance, and the ink that reads best on a colour
const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const inkOn = (rgb: number[]): Ink => {
  const l = luminance(rgb);
  return (l + 0.05) / (luminance(INK_900) + 0.05) >= 1.05 / (l + 0.05) ? 'dark' : 'light';
};

// the most common colour in a run of pixels (RGB or RGBA, `channels` apart),
// and the share of the run it covers
export const modeOf = (data: ArrayLike<number>, channels: number): Band => {
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i + 2 < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bucket.n += 1;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }
  let best = { n: 0, r: 255, g: 255, b: 255 };
  let total = 0;
  for (const bucket of buckets.values()) {
    total += bucket.n;
    if (bucket.n > best.n) best = bucket;
  }
  return { rgb: best.n ? [best.r / best.n, best.g / best.n, best.b / best.n] : [255, 255, 255], share: total ? best.n / total : 0 };
};

// The top edge is always the app's own header, patterned or not, so it keeps
// its commonest colour. A foot with no one colour along it (a feed cut off
// through its product photos) has no bar colour of its own: it takes the top's,
// the app's chrome, rather than the average of somebody's kurti.
export const edgesOf = (head: Band, tail: Band): Edge => {
  const top = head.rgb;
  const foot = tail.share >= BUSY ? tail.rgb : head.rgb;
  return { top: toHex(top), topInk: inkOn(top), foot: toHex(foot), footInk: inkOn(foot) };
};
