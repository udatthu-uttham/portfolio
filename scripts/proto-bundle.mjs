// The realistic prototype's compiled bundle, read and rewritten in place
// (2026-10-03). Shared by scripts/proto-synthetic-images.mjs (its pictures) and
// scripts/proto-synthetic-data.mjs (its records).
import { createHash } from 'node:crypto';
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs';

export const PROTO = new URL('../public/proto/feed-ux/', import.meta.url);
export const SERVED = '/proto/feed-ux/'; // how the bundle names its own files
const HTML = new URL('index.html', PROTO);

// The bundle's script and stylesheet, as index.html names them.
export function bundleAssets() {
  const html = readFileSync(HTML, 'utf8');
  return [...html.matchAll(/\/proto\/feed-ux\/(assets\/[\w.-]+\.(?:js|css))/g)].map((m) => m[1]);
}

export const readAsset = (asset) => readFileSync(new URL(asset, PROTO), 'utf8');

// Saves a rewritten file under a name carrying a hash of its new contents,
// points index.html at it and deletes the old file. public/_headers serves
// /proto/feed-ux/assets/* as immutable for a year, so a changed file under its
// old name would never reach a browser that already holds the old one.
// Returns the file's (possibly unchanged) name.
export function writeAsset(asset, text) {
  const ext = asset.slice(asset.lastIndexOf('.'));
  const hash = createHash('sha256').update(text).digest('base64url').slice(0, 8);
  const next = asset.replace(/-[\w-]+\.(js|css)$/, `-${hash}${ext}`);
  if (next === asset) return asset;
  writeFileSync(new URL(next, PROTO), text);
  unlinkSync(new URL(asset, PROTO));
  const html = readFileSync(HTML, 'utf8');
  writeFileSync(HTML, html.split(`${SERVED}${asset}`).join(`${SERVED}${next}`));
  return next;
}

// Where the object literal opening at js[open] ('{') closes, skipping strings.
export function objectEnd(js, open) {
  let depth = 0;
  for (let i = open; i < js.length; i++) {
    const c = js[i];
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < js.length && js[i] !== c; i++) if (js[i] === '\\') i++;
    } else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i + 1;
  }
  throw new Error(`unclosed object at ${open}`);
}
