// The colour timeline of every clip the case pages play, for the phone mock's
// status bar and home strip (src/lib/edge-colour.ts has the rule):
//
//   npm run clip-edges        (macOS: it decodes with AVFoundation)
//
// Run it after adding or replacing a clip under public/media/. It writes
// src/data/clip-edges.json: for each clip, the moments its top or bottom edge
// changes colour, each with the colours from then on. The page applies them by
// the frame on show, so the strips follow the clip exactly; a clip missing
// from the file keeps its still's colours, and the build says so.
//
// Why a file and not the browser: a <canvas> handed a playing <video> in
// Chromium reads it darker than a Mac shows it (2026-10-03: the splash's
// purple read #6524fd against the #7028fc on screen), so strips sampled live
// stood a shade off the screen for the whole clip. scripts/clip-frames.swift
// decodes each frame as the display does, and every frame is read by the same
// code as the stills (src/lib/screen-edges.ts).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { screenEdges } from '../src/lib/screen-edges.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const media = join(root, 'public', 'media');
const out = join(root, 'src', 'data', 'clip-edges.json');

const clips = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.mp4$/i.test(name)) clips.push(path);
  }
};
walk(media);
clips.sort();

const work = mkdtempSync(join(tmpdir(), 'clip-edges-'));
const bin = join(work, 'clip-frames');
execFileSync('swiftc', ['-O', join(root, 'scripts', 'clip-frames.swift'), '-o', bin], { stdio: 'inherit' });

// two edges a viewer could not tell apart: the same inks, every channel
// within NOISE of the other
const NOISE = 2;
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const near = (a, b) => rgb(a).every((c, i) => Math.abs(c - rgb(b)[i]) <= NOISE);
const same = (a, b) => a[1] === b[1] && a[3] === b[3] && near(a[0], b[0]) && near(a[2], b[2]);

const timeline = {};
try {
  for (const clip of clips) {
    const dir = mkdtempSync(join(work, 'frames-'));
    const lines = execFileSync(bin, [clip, dir], { encoding: 'utf8' }).trim().split('\n');
    const edges = [];
    let last = null;
    for (const line of lines) {
      const [index, seconds] = line.split(' ');
      const edge = await screenEdges(join(dir, `frame-${index.padStart(4, '0')}.png`));
      const entry = [edge.top, edge.topInk, edge.foot, edge.footInk];
      // only the moments something changes, by more than the codec's own
      // flicker (a white that wavers between #fffffe and #fefefd is white)
      if (!last || !same(entry, last)) {
        edges.push([Number(Number(seconds).toFixed(3)), ...entry]);
        last = entry;
      }
    }
    // keyed by the clip's public address, as screens.videos names it
    const src = `/${relative(join(root, 'public'), clip).split(sep).join('/')}`;
    timeline[src] = { frames: lines.length, edges };
    console.log(`${src}: ${lines.length} frames, colours set at ${edges.length} moment${edges.length === 1 ? '' : 's'}`);
    rmSync(dir, { recursive: true, force: true });
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

// one line per change, so a diff shows which moment moved
const body = Object.entries(timeline)
  .map(([src, { frames, edges }]) => `  ${JSON.stringify(src)}: {\n    "frames": ${frames},\n    "edges": [\n${edges.map((e) => `      ${JSON.stringify(e)}`).join(',\n')}\n    ]\n  }`)
  .join(',\n');
writeFileSync(out, `{\n${body}\n}\n`);
console.log(`wrote ${relative(root, out)}`);
