// Each export's top and bottom edge colour, read at build time with sharp, so
// the case pages' phone mock dresses its status bar and home strip before a
// single pixel has loaded (the rules are in ./edge-colour.ts). A screen shorter
// than the 1 : 2 display (the 9 : 16 order confirmation) is filled with the same
// colours, so it reads as one screen rather than one screen with bars.
// scripts/clip-edges.mjs reads every frame of a clip through this same file.
// Server-only: the browser never imports this file. (The '.ts' on the import is
// for that script, which Node runs without a bundler.)
import { edgesOf, WHITE_EDGE, modeOf, type Edge } from './edge-colour.ts';

// the band read along each edge: a few rows in from it (the outermost row of
// an export is often an anti-aliased hairline), clear of rounded corners
const BAND = { inset: 1, rows: 5, side: 0.04 };

const cache = new Map<string, Promise<Edge>>();

async function sample(file: string): Promise<Edge> {
  // sharp is Astro's own image service, already in the build for <Image>
  const { default: sharp } = await import('sharp');
  const { width = 0, height = 0 } = await sharp(file).metadata();
  if (!width || height < 2 * (BAND.inset + BAND.rows)) return WHITE_EDGE;
  const left = Math.round(width * BAND.side);
  const band = async (top: number) => {
    const { data, info } = await sharp(file)
      .extract({ left, top, width: width - 2 * left, height: BAND.rows })
      .flatten({ background: '#ffffff' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    return modeOf(data, info.channels);
  };
  return edgesOf(await band(BAND.inset), await band(height - BAND.inset - BAND.rows));
}

// A file's edges (its absolute path: an imported image's `fsPath`), read once
// per build and once per dev-server session. A file that cannot be read keeps
// white strips, which every export so far starts on.
export function screenEdges(file: string | undefined): Promise<Edge> {
  if (!file) return Promise.resolve(WHITE_EDGE);
  if (!cache.has(file)) cache.set(file, sample(file).catch(() => WHITE_EDGE));
  return cache.get(file)!;
}
