// Points the realistic prototype at its own drawn catalogue (2026-10-03).
//
// public/proto/feed-ux is a compiled Vite/React bundle whose source lives
// outside this repo. Its catalogue pictures came from Meesho's image server
// (about 1,260 product photos), its grey fallbacks from placehold.co and its
// profile picture from Unsplash — real sellers' photos in an AI Space preview
// that CLAUDE.md says renders synthetic data only. This script swaps every one
// of those addresses for a picture under /proto/feed-ux/catalog/, so the
// prototype loads images from its own origin and nowhere else.
//
//   node scripts/proto-synthetic-images.mjs           rewrite the bundle
//   node scripts/proto-synthetic-images.mjs --draw    re-render catalog/ first
//   node scripts/proto-synthetic-images.mjs --check   exit 1 if any remote image is left
//
// How it works:
// 1. Every remote image URL in the bundle is looked up, by a hash of the URL,
//    in proto-synthetic-images.json. The hash keeps the real addresses out of
//    the repo; the map makes the swap repeatable, so the same product always
//    gets the same picture.
// 2. A URL the map has never seen (a fresh build from the prototype's source)
//    is classified from the product record around it — its categoryId, the
//    participant order's subcategory, or the fallback basket it sits in — and
//    given a picture of that kind. Products are dealt round the kind's pool in
//    feed order, so neighbours in a feed differ; a product's gallery takes the
//    pictures after its hero. A URL it cannot classify stops the run.
// 3. The rewritten bundle gets a new content-hashed name, index.html points at
//    it and the old file is deleted: public/_headers serves
//    /proto/feed-ux/assets/* as immutable for a year, so a changed file under
//    an old name would never reach a returning browser. Only the URL strings
//    change; every other byte of the bundle is left as it was.
//
// The pictures themselves are drawn by scripts/proto-catalog-art.mjs.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { BACKDROP, FRAME, POOLS, avatar, placeholder } from './proto-catalog-art.mjs';

const PROTO = new URL('../public/proto/feed-ux/', import.meta.url);
const CATALOG = new URL('catalog/', PROTO);
const MAP_FILE = new URL('./proto-synthetic-images.json', import.meta.url);
const SERVED = '/proto/feed-ux/'; // how the bundle names its own files
const REMOTE = /https:\/\/(?:images\.meesho\.com|placehold\.co|images\.unsplash\.com)[^"'`\s)\\]*/g;
const MAX_BYTES = 45 * 1024;

const args = new Set(process.argv.slice(2));
const key = (url) => createHash('sha256').update(url).digest('hex').slice(0, 16);
const file = (kind, i) => `catalog/${kind}-${String(i + 1).padStart(2, '0')}.webp`;

// ---------------------------------------------------------------- drawing

async function draw() {
  mkdirSync(CATALOG, { recursive: true });
  const wanted = new Set();
  for (const [kind, pool] of Object.entries(POOLS)) {
    for (let i = 0; i < pool.size; i++) {
      const svg = pool.draw(i);
      // Measure the drawing on a clear backdrop, then set it at a common size.
      const clear = svg.replace(BACKDROP, '').replace(FRAME, 'translate(0 0)');
      const { data, info } = await sharp(Buffer.from(clear)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < info.width; x++) {
          if (data[(y * info.width + x) * 4 + 3] > 24) {
            if (x < x0) x0 = x;
            if (x > x1) x1 = x;
            if (y < y0) y0 = y;
            if (y > y1) y1 = y;
          }
        }
      }
      const s = Math.min(424 / (x1 - x0), 424 / (y1 - y0), 1.5);
      const tx = 256 - s * ((x0 + x1) / 2);
      const ty = 258 - s * ((y0 + y1) / 2);
      const framed = svg.replace(FRAME, `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(3)})`);
      const out = file(kind, i);
      let q = 82;
      let buf;
      do {
        buf = await sharp(Buffer.from(framed)).webp({ quality: q, effort: 6 }).toBuffer();
        q -= 6;
      } while (buf.length > MAX_BYTES && q > 40);
      writeFileSync(new URL(out, PROTO), buf);
      wanted.add(out.slice('catalog/'.length));
    }
  }
  writeFileSync(new URL('avatar.webp', CATALOG), await sharp(Buffer.from(avatar())).webp({ quality: 84, effort: 6 }).toBuffer());
  for (const [name, w, h, label] of [['placeholder-product.svg', 400, 400, 'Product'], ['placeholder-color.svg', 80, 80, 'Color'], ['placeholder-shade.svg', 80, 80, 'Shade']]) {
    writeFileSync(new URL(name, CATALOG), placeholder(w, h, label));
    wanted.add(name);
  }
  wanted.add('avatar.webp');
  for (const name of readdirSync(CATALOG)) if (!wanted.has(name)) unlinkSync(new URL(name, CATALOG));
  console.log(`drew ${wanted.size} files into public/proto/feed-ux/catalog/`);
}

// ---------------------------------------------------------------- classifying

// A product record's kind, from the fields the bundle's data carries.
const CATEGORY = {
  mens_shirts: 'shirt', lod_top_bottom_sets: 'coord', women_saree: 'saree', mens_shoes: 'shoes',
  home_bedsheets: 'bedsheet', beauty_lipstick: 'lipstick', women_kurti: 'kurti', kitchen_water_bottle: 'bottle',
  baby_diaper: 'diaper', kitchen_cooker: 'cooker', kitchen_cooker_volume: 'cooker',
  // The toy records borrow other kinds' photos (bottles, cookers, bedsheets),
  // so they cast no vote: each photo keeps the kind it shows.
  kids_toys: null,
};
const SUBCATEGORY = {
  'Kurtis & Kurtas': 'kurti', Bedsheets: 'bedsheet', 'Analog Watches': 'watch', 'Smart Speakers': 'speaker',
  'Hair Color': 'hairstick', 'Bags & Backpacks': 'lunchbag', Kurtas: 'kurta', 'Diwan Cover Sets': 'diwan',
  'Incense Holders': 'incense', 'Baby Daipers': 'diaper', 'Sports Bra': 'sportsbra', 'Earrings & Studs': 'earrings',
  Cables: 'cable', Blouses: 'blouse', Curtains: 'curtain', Sarees: 'saree', 'Menstrual/Sanitary pads': 'pads',
};
const BASKET = { mens: 'menswear', kitchen_utility: 'kitchen' };
const FALLBACK = { Product: 'catalog/placeholder-product.svg', Color: 'catalog/placeholder-color.svg', Shade: 'catalog/placeholder-shade.svg' };

function kindOf(rec) {
  if (rec.categoryId && rec.categoryId in CATEGORY) return CATEGORY[rec.categoryId];
  if (rec.subcategory && SUBCATEGORY[rec.subcategory]) return SUBCATEGORY[rec.subcategory];
  if (rec.subCategory === 'shirts') return 'shirt';
  if (rec.subCategory === 'shoes') return 'shoes';
  if (rec.category && BASKET[rec.category]) return BASKET[rec.category];
  return undefined;
}

function plan(js, map) {
  // Product records: participants' orders ({pid:…}), the catalogue map
  // (key:{id:…}) and the fallback baskets ({id:"…",category:…}).
  const starts = [];
  for (const m of js.matchAll(/\{pid:"|[{,](\w+):\{id:"|\{id:"\d+",category:"/g)) starts.push({ at: m.index, key: m[1] });
  const field = (t, k) => (new RegExp(`[{,]${k}:"([^"]*)"`).exec(t) || [])[1];
  const records = starts.map(({ at: a, key: mapKey }, n) => {
    const t = js.slice(a, Math.min(starts[n + 1]?.at ?? js.length, a + 6000));
    return {
      at: a, end: a + t.length, mapKey,
      id: field(t, 'pid') || field(t, 'id'),
      categoryId: field(t, 'categoryId'), subcategory: field(t, 'subcategory'), subCategory: field(t, 'subCategory'), category: field(t, 'category'),
      urls: [],
    };
  });
  // Every remote URL, the record it sits in, and that record's vote.
  const votes = new Map();
  const seen = [];
  let r = 0;
  for (const m of js.matchAll(REMOTE)) {
    const url = m[0];
    seen.push(url);
    while (r + 1 < records.length && records[r + 1].at <= m.index) r++;
    const rec = records[r] && m.index < records[r].end ? records[r] : null;
    if (rec) rec.urls.push(url);
    const kind = rec ? kindOf(rec) : undefined;
    if (!votes.has(url)) votes.set(url, new Map());
    if (kind) votes.get(url).set(kind, (votes.get(url).get(kind) || 0) + 1);
  }
  const unmapped = [...new Set(seen)].filter((u) => !map[key(u)]);
  if (!unmapped.length) return 0;

  const kindOfUrl = new Map();
  const lost = [];
  for (const url of unmapped) {
    if (url.includes('placehold.co')) {
      const label = new URL(url).searchParams.get('text');
      if (FALLBACK[label]) map[key(url)] = FALLBACK[label];
      else lost.push(url);
    } else if (url.includes('images.unsplash.com')) map[key(url)] = 'catalog/avatar.webp';
    else {
      const v = [...votes.get(url)].sort((a, b) => b[1] - a[1]);
      if (v.length) kindOfUrl.set(url, v[0][0]);
      else lost.push(url);
    }
  }
  if (lost.length) {
    throw new Error(`No product kind for ${lost.length} image URL(s), e.g. ${lost[0]}\nAdd its record's category to CATEGORY / SUBCATEGORY / BASKET in this script.`);
  }
  // Deal each kind's products round its pool in feed order; pick up where the
  // map left off so a re-run does not reshuffle the pictures already dealt.
  const dealt = {};
  for (const f of Object.values(map)) {
    const k = /catalog\/([a-z]+)-\d+\.webp/.exec(f);
    if (k) dealt[k[1]] = (dealt[k[1]] || 0) + 1;
  }
  // Feed order. The feeds walk the catalogue map (key:{id:…}), and a JS
  // object yields integer keys first, ascending, then the rest as written;
  // arrays (participants, fallback baskets) go in the order they are written.
  const rank = (rec) =>
    rec.mapKey === undefined ? 2e12 + rec.at : /^(0|[1-9]\d{0,9})$/.test(rec.mapKey) && +rec.mapKey < 4294967295 ? +rec.mapKey : 1e12 + rec.at;
  const byKind = {};
  for (const rec of records) {
    const k = kindOf(rec);
    if (k && rec.urls.length) (byKind[k] ||= []).push(rec);
  }
  const slot = new Map();
  for (const [kind, recs] of Object.entries(byKind)) {
    const n = POOLS[kind].size;
    const products = recs
      .sort((a, b) => rank(a) - rank(b))
      .map((rec) => [...new Set(rec.urls)].filter((u) => kindOfUrl.get(u) === kind))
      .filter((own) => own.length);
    // Heroes first — a record can also carry a sibling variant's photo, which
    // must not push the next product's hero onto a picture already dealt …
    for (const own of products) if (!slot.has(own[0])) slot.set(own[0], (dealt[kind] = (dealt[kind] || 0) + 1) - 1);
    // … then each product's other pictures follow its hero, for its gallery.
    for (const own of products) own.slice(1).forEach((u, k) => slot.has(u) || slot.set(u, slot.get(own[0]) + 1 + k));
    for (const [u, s] of slot) if (kindOfUrl.get(u) === kind) map[key(u)] = file(kind, s % n);
  }
  // Anything left over (a URL outside every record of its kind): by hash.
  for (const [u, kind] of kindOfUrl) if (!map[key(u)]) map[key(u)] = file(kind, parseInt(key(u).slice(0, 8), 16) % POOLS[kind].size);
  return unmapped.length;
}

// ---------------------------------------------------------------- rewriting

function rewrite() {
  const map = existsSync(MAP_FILE) ? JSON.parse(readFileSync(MAP_FILE, 'utf8')).urls : {};
  const htmlUrl = new URL('index.html', PROTO);
  let html = readFileSync(htmlUrl, 'utf8');
  const assets = [...html.matchAll(/\/proto\/feed-ux\/(assets\/[\w.-]+\.(?:js|css))/g)].map((m) => m[1]);
  let left = 0;
  for (const asset of assets) {
    const text = readFileSync(new URL(asset, PROTO), 'utf8');
    const remote = text.match(REMOTE) || [];
    if (args.has('--check')) {
      left += remote.length;
      continue;
    }
    if (!remote.length) continue;
    const added = plan(text, map);
    const out = text.replace(REMOTE, (u) => SERVED + map[key(u)]);
    if ((out.match(REMOTE) || []).length) throw new Error(`${asset}: remote image URLs survived the rewrite`);
    for (const f of new Set(Object.values(map))) if (!existsSync(new URL(f, PROTO))) throw new Error(`${f} is mapped but missing — run with --draw`);
    const ext = asset.slice(asset.lastIndexOf('.'));
    const hash = createHash('sha256').update(out).digest('base64url').slice(0, 8);
    const next = asset.replace(/-[\w-]+\.(js|css)$/, `-${hash}${ext}`);
    writeFileSync(new URL(next, PROTO), out);
    if (next !== asset) unlinkSync(new URL(asset, PROTO));
    html = html.split(`${SERVED}${asset}`).join(`${SERVED}${next}`);
    console.log(`${asset} → ${next}: ${remote.length} URLs (${new Set(remote).size} distinct, ${added} newly mapped)`);
  }
  if (args.has('--check')) {
    console.log(left ? `${left} remote image URL(s) left in the bundle` : 'no remote image URLs in the bundle');
    process.exit(left ? 1 : 0);
  }
  writeFileSync(htmlUrl, html);
  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(
    MAP_FILE,
    JSON.stringify(
      {
        _note: 'sha256(url).slice(0, 16) → picture, for every remote image URL the prototype bundle has carried. Written by scripts/proto-synthetic-images.mjs; the real addresses are deliberately not stored.',
        urls: sorted,
      },
      null,
      1,
    ) + '\n',
  );
}

if (args.has('--draw')) await draw();
rewrite();
