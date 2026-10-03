// Points the realistic prototype at its own drawn catalogue (2026-10-03).
//
// public/proto/feed-ux is a compiled Vite/React bundle whose source lives
// outside this repo. Its catalogue pictures came from Meesho's image server
// (about 1,260 product photos), its grey fallbacks from placehold.co and its
// profile picture from Unsplash — real sellers' photos in an AI Space preview
// that CLAUDE.md says renders synthetic data only. This script swaps every one
// of those addresses for a picture under /proto/feed-ux/catalog/, so the
// prototype loads images from its own origin and nowhere else. It also draws
// the home strip's round category tiles (categories/*.png), which were
// photographs of models and products.
//
//   node scripts/proto-synthetic-images.mjs           rewrite the bundle
//   node scripts/proto-synthetic-images.mjs --draw    re-render catalog/ and the tiles first
//   node scripts/proto-synthetic-images.mjs --check   exit 1 if a remote image is left,
//                                                     or a card shows another kind's picture
//
// Then run scripts/proto-synthetic-data.mjs, which swaps the records
// themselves (the participants' orders, brand names, listing links).
//
// How it works:
// 1. Every remote image URL in the bundle is looked up, by a hash of the URL,
//    in proto-synthetic-images.json, so the same product always gets the same
//    picture. The map stores hashes rather than the addresses so this repo's
//    current files do not list them; the bundle committed before 2026-10-03
//    still holds them in git history.
// 2. A URL the map has never seen (a fresh build from the prototype's source)
//    is classified from the product record around it — its categoryId, the
//    participant order's subcategory, or the fallback basket it sits in — and
//    given a picture of that kind. Products are dealt round the kind's pool in
//    feed order, so neighbours in a feed differ; a product's gallery takes the
//    pictures after its hero. A URL it cannot classify stops the run.
// 3. A catalogue record whose title names another kind than its category —
//    toys and under-bed storage filed under bedsheets, dresses under co-ord
//    sets, track pants under shirts — is pictured by its title instead
//    (BY_TITLE), per record rather than per URL: the build gave such records
//    photos that other records also use, so the URL alone cannot say which
//    kind a card is. This runs on remote and local addresses alike, so it also
//    corrects a bundle that is already self-hosted.
// 4. The rewritten bundle gets a new content-hashed name (scripts/proto-bundle.mjs).
//    Only image strings change; every other byte of the bundle is left as it was.
//
// The pictures themselves are drawn by scripts/proto-catalog-art.mjs.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { BACKDROP, CATEGORY_TILES, FRAME, POOLS, avatar, placeholder } from './proto-catalog-art.mjs';
import { PROTO, SERVED, bundleAssets, objectEnd, readAsset, writeAsset } from './proto-bundle.mjs';

const CATALOG = new URL('catalog/', PROTO);
const CATEGORIES = new URL('categories/', PROTO);
const MAP_FILE = new URL('./proto-synthetic-images.json', import.meta.url);
const REMOTE = /https:\/\/(?:images\.meesho\.com|placehold\.co|images\.unsplash\.com)[^"'`\s)\\]*/g;
const LOCAL = /\/proto\/feed-ux\/catalog\/[a-z]+-\d+\.webp/g;
const IMAGE = new RegExp(`${REMOTE.source}|${LOCAL.source}`, 'g');
const MAX_BYTES = 45 * 1024;
// The strip shows a tile as a 58px circle (object-fit: cover); three times
// that keeps it sharp on a phone.
const TILE_PX = 174;

const args = new Set(process.argv.slice(2));
const key = (url) => createHash('sha256').update(url).digest('hex').slice(0, 16);
const file = (kind, i) => `catalog/${kind}-${String(i + 1).padStart(2, '0')}.webp`;

// ---------------------------------------------------------------- drawing

// Measures a drawing on a clear backdrop and sets it at the size `fit` gives
// its bounding box, centred.
async function frame(svg, fit, cy = 258) {
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
  const s = fit(x1 - x0, y1 - y0);
  const tx = 256 - s * ((x0 + x1) / 2);
  const ty = cy - s * ((y0 + y1) / 2);
  return svg.replace(FRAME, `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(3)})`);
}

async function draw() {
  mkdirSync(CATALOG, { recursive: true });
  const wanted = new Set();
  for (const [kind, pool] of Object.entries(POOLS)) {
    for (let i = 0; i < pool.size; i++) {
      // About 83% of the tile, like a product photo.
      const framed = await frame(pool.draw(i), (w, h) => Math.min(424 / w, 424 / h, 1.5));
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
  // The category tiles keep the bundle's own names; the circle crops the
  // square's corners, so the drawing fits inside it rather than the square.
  for (const [name, tile] of Object.entries(CATEGORY_TILES)) {
    const framed = await frame(tile(), (w, h) => Math.min(460 / Math.hypot(w, h), 1.5), 256);
    const png = await sharp(Buffer.from(framed)).resize(TILE_PX, TILE_PX).png({ palette: true, quality: 92, effort: 10, compressionLevel: 9 }).toBuffer();
    writeFileSync(new URL(name, CATEGORIES), png);
  }
  console.log(`drew ${wanted.size} files into public/proto/feed-ux/catalog/ and ${Object.keys(CATEGORY_TILES).length} tiles into categories/`);
}

// ---------------------------------------------------------------- classifying

// A product record's kind, from the fields the bundle's data carries.
const CATEGORY = {
  mens_shirts: 'shirt', lod_top_bottom_sets: 'coord', women_saree: 'saree', mens_shoes: 'shoes',
  home_bedsheets: 'bedsheet', beauty_lipstick: 'lipstick', women_kurti: 'kurti', kitchen_water_bottle: 'bottle',
  baby_diaper: 'diaper', kitchen_cooker: 'cooker', kitchen_cooker_volume: 'cooker',
  // The toy records borrow other kinds' photos (bottles, cookers, bedsheets),
  // so they cast no vote: each photo keeps the kind it shows. Their own
  // pictures come from BY_TITLE.
  kids_toys: null,
};
const SUBCATEGORY = {
  'Kurtis & Kurtas': 'kurti', Bedsheets: 'bedsheet', 'Analog Watches': 'watch', 'Smart Speakers': 'speaker',
  'Hair Color': 'hairstick', 'Bags & Backpacks': 'lunchbag', Kurtas: 'kurta', 'Diwan Cover Sets': 'diwan',
  'Incense Holders': 'incense', 'Baby Daipers': 'diaper', 'Sports Bra': 'sportsbra', 'Earrings & Studs': 'earrings',
  Cables: 'cable', Blouses: 'blouse', Curtains: 'curtain', Sarees: 'saree', 'Menstrual/Sanitary pads': 'pads',
  // The invented orders' spellings (scripts/proto-synthetic-data.mjs); the
  // incense pool's second picture is the lamp.
  'Baby Diapers': 'diaper', 'Night Lamps': 'incense',
};
const BASKET = { mens: 'menswear', kitchen_utility: 'kitchen' };
const FALLBACK = { Product: 'catalog/placeholder-product.svg', Color: 'catalog/placeholder-color.svg', Shade: 'catalog/placeholder-shade.svg' };

// A catalogue record pictured by its title, where its category would picture
// it as something else (2026-10-03 review: toys showed bottles and cookers,
// under-bed storage showed bottles, the western feed's dresses showed co-ord
// sets). [category it applies in (null: any), title test, kind, the pool's
// pictures to choose from (default: all)]. First match wins; a match on the
// record's own category kind changes nothing.
const BY_TITLE = [
  ['kids_toys', /top & bottom/i, 'coord'],
  ['kids_toys', /bank/i, 'toy', [0, 1]],
  ['kids_toys', /musical/i, 'toy', [2, 3]],
  ['kids_toys', /tent/i, 'toy', [4, 5]],
  ['kids_toys', /puzzle/i, 'toy', [6, 7]],
  ['kids_toys', /development|activity/i, 'toy', [8]],
  ['kids_toys', /educational|reading|writing/i, 'toy', [9]],
  ['kids_toys', /chess/i, 'toy', [10]],
  ['kids_toys', /clay|slime/i, 'toy', [11]],
  ['kids_toys', /card/i, 'toy', [12]],
  ['kids_toys', /ball/i, 'toy', [13]],
  ['kids_toys', /bath/i, 'toy', [14]],
  ['kids_toys', /building|blocks/i, 'toy', [15]],
  ['kids_toys', /dress ?ups?|costume/i, 'toy', [16]],
  ['kids_toys', /./, 'toy'],
  ['home_bedsheets', /drawer/i, 'storage', [5]],
  ['home_bedsheets', /clothes cover/i, 'storage', [6]],
  ['home_bedsheets', /basket|bins?\b|boxes/i, 'storage', [7]],
  ['home_bedsheets', /storage/i, 'storage', [0, 1, 2, 3, 4]],
  [null, /\bmen\b.*kurta sets?\b/i, 'kurta', [3, 4, 5]],
  [null, /\bmen\b.*kurtas?\b/i, 'kurta', [0, 1, 2]],
  [null, /saree/i, 'saree'],
  [null, /kurta|kurti|dupatta/i, 'kurti'],
  [null, /top & bottom|nightsuit/i, 'coord'],
  [null, /dress/i, 'dress'],
  [null, /tunic|top ?wear|\btops\b/i, 'top'],
  [null, /track ?pants/i, 'trousers', [5, 6, 7]],
  [null, /jeans/i, 'trousers', [3, 4]],
  [null, /trouser|pants|palazzo/i, 'trousers', [0, 1, 2]],
  [null, /brief/i, 'briefs'],
  [null, /blouse/i, 'blouse'],
  [null, /shirt/i, 'shirt'],
];

function kindOf(rec) {
  if (rec.categoryId && rec.categoryId in CATEGORY) return CATEGORY[rec.categoryId];
  if (rec.subcategory && SUBCATEGORY[rec.subcategory]) return SUBCATEGORY[rec.subcategory];
  if (rec.subCategory === 'shirts') return 'shirt';
  if (rec.subCategory === 'shoes') return 'shoes';
  if (rec.subCategory === 'water_bottle') return 'bottle';
  if (rec.category && BASKET[rec.category]) return BASKET[rec.category];
  return undefined;
}

// The title's kind and pictures, when they differ from the category's.
function titleKind(rec) {
  if (!rec.categoryId || !rec.title) return null;
  const hit = BY_TITLE.find(([cat, re]) => (cat === null || cat === rec.categoryId) && re.test(rec.title));
  if (!hit || hit[2] === CATEGORY[rec.categoryId]) return null;
  return { kind: hit[2], pick: hit[3] ?? [...Array(POOLS[hit[2]].size).keys()] };
}

// Product records: participants' orders ({pid:…}), the catalogue map
// (key:{id:…}) and the fallback baskets ({id:"…",category:…}). `end` runs to
// the next record (how URLs are attributed for the per-URL map); `close` is
// where the record's own object literal ends.
function records(js) {
  const starts = [];
  for (const m of js.matchAll(/\{pid:"|[{,](\w+):\{id:"|\{id:"\d+",category:"/g)) starts.push({ at: m.index, key: m[1] });
  const field = (t, k) => (new RegExp(`[{,]${k}:"([^"]*)"`).exec(t) || [])[1];
  return starts.map(({ at: a, key: mapKey }, n) => {
    const end = Math.min(starts[n + 1]?.at ?? js.length, a + 6000);
    const open = js[a] === '{' && mapKey === undefined ? a : js.indexOf('{', a + 1);
    const close = objectEnd(js, open);
    const t = js.slice(a, close); // the record's own fields only
    return {
      at: a, end, close, mapKey,
      id: field(t, 'pid') || field(t, 'id'), title: field(t, 'title'),
      categoryId: field(t, 'categoryId'), subcategory: field(t, 'subcategory'), subCategory: field(t, 'subCategory'), category: field(t, 'category'),
      urls: [],
    };
  });
}

// Feed order. The feeds walk the catalogue map (key:{id:…}), and a JS object
// yields integer keys first, ascending, then the rest as written; arrays
// (participants, fallback baskets) go in the order they are written.
const rank = (rec) =>
  rec.mapKey === undefined ? 2e12 + rec.at : /^(0|[1-9]\d{0,9})$/.test(rec.mapKey) && +rec.mapKey < 4294967295 ? +rec.mapKey : 1e12 + rec.at;

// Per record: every image in a record pictured by its title → that kind's
// picture, dealt round its choices in feed order; the record's first picture
// is its hero, any others follow it for its gallery.
function byTitle(js, recs) {
  const spans = [];
  const dealt = {};
  for (const rec of [...recs].sort((a, b) => rank(a) - rank(b))) {
    const t = titleKind(rec);
    if (!t) continue;
    const own = [...new Set(js.slice(rec.at, rec.close).match(IMAGE) || [])];
    if (!own.length) continue;
    const deal = `${t.kind}:${t.pick}`;
    const n = (dealt[deal] = (dealt[deal] ?? -1) + 1);
    const to = new Map(own.map((u, k) => [u, file(t.kind, t.pick[(n + k) % t.pick.length])]));
    spans.push({ at: rec.at, close: rec.close, to, kind: t.kind, title: rec.title });
  }
  return spans.sort((a, b) => a.at - b.at);
}
const spanAt = (spans, i) => spans.find((s) => s.at <= i && i < s.close);

function plan(js, map, recs, spans) {
  // Every remote URL outside a title-pictured record, the record it sits in,
  // and that record's vote.
  const votes = new Map();
  const seen = [];
  let r = 0;
  for (const m of js.matchAll(REMOTE)) {
    if (spanAt(spans, m.index)) continue;
    const url = m[0];
    seen.push(url);
    while (r + 1 < recs.length && recs[r + 1].at <= m.index) r++;
    const rec = recs[r] && m.index < recs[r].end ? recs[r] : null;
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
  const byKind = {};
  for (const rec of recs) {
    const k = kindOf(rec);
    if (k && rec.urls.length) (byKind[k] ||= []).push(rec);
  }
  const slot = new Map();
  for (const [kind, kindRecs] of Object.entries(byKind)) {
    const n = POOLS[kind].size;
    const products = kindRecs
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

// ---------------------------------------------------------------- checking

// Cards whose picture is not their own kind: a record pictured by its title
// must show that kind; any other record with a known kind must show its own.
function mismatches(js, recs) {
  const bad = [];
  for (const rec of recs) {
    const want = titleKind(rec)?.kind ?? kindOf(rec);
    if (!want) continue;
    for (const u of js.slice(rec.at, rec.close).match(LOCAL) || []) {
      const got = /catalog\/([a-z]+)-/.exec(u)[1];
      if (got !== want) bad.push(`${rec.id} "${rec.title ?? rec.subcategory ?? rec.category}" shows ${got}, wants ${want}`);
    }
  }
  return bad;
}

// ---------------------------------------------------------------- rewriting

function rewrite() {
  const map = existsSync(MAP_FILE) ? JSON.parse(readFileSync(MAP_FILE, 'utf8')).urls : {};
  let left = 0;
  for (const asset of bundleAssets()) {
    const text = readAsset(asset);
    const recs = records(text);
    if (args.has('--check')) {
      const remote = (text.match(REMOTE) || []).length;
      const bad = mismatches(text, recs);
      for (const b of bad.slice(0, 20)) console.log(`  ${asset}: ${b}`);
      if (bad.length > 20) console.log(`  … and ${bad.length - 20} more`);
      if (remote) console.log(`  ${asset}: ${remote} remote image URL(s)`);
      left += remote + bad.length;
      continue;
    }
    const spans = byTitle(text, recs);
    const added = plan(text, map, recs, spans);
    let titled = 0;
    const out = text.replace(IMAGE, (u, i) => {
      const span = spanAt(spans, i);
      if (span) {
        titled++;
        return SERVED + span.to.get(u);
      }
      return u.startsWith('https://') ? SERVED + map[key(u)] : u;
    });
    if ((out.match(REMOTE) || []).length) throw new Error(`${asset}: remote image URLs survived the rewrite`);
    for (const f of new Set([...Object.values(map), ...spans.flatMap((s) => [...s.to.values()])])) {
      if (!existsSync(new URL(f, PROTO))) throw new Error(`${f} is mapped but missing — run with --draw`);
    }
    if (out === text) continue; // nothing to change: keep the file and its name
    const next = writeAsset(asset, out);
    const remote = (text.match(REMOTE) || []).length;
    console.log(`${asset} → ${next}: ${remote} remote URLs (${added} newly mapped), ${titled} pictures in ${spans.length} records set by title`);
  }
  if (args.has('--check')) {
    console.log(left ? `${left} problem(s) in the bundle` : 'no remote images, and every card shows its own kind');
    process.exit(left ? 1 : 0);
  }
  const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(
    MAP_FILE,
    JSON.stringify(
      {
        _note: 'sha256(url).slice(0, 16) → picture, for every remote image URL the prototype bundle has carried. Written by scripts/proto-synthetic-images.mjs. Hashes rather than addresses, so the current files do not list them; the bundle committed before 2026-10-03 still holds them in git history.',
        urls: sorted,
      },
      null,
      1,
    ) + '\n',
  );
}

if (args.has('--draw')) await draw();
rewrite();
