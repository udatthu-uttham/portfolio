// The realistic prototype's records, made synthetic (2026-10-03).
//
// CLAUDE.md, "AI Space previews: synthetic data only": every preview renders
// invented data. scripts/proto-synthetic-images.mjs swapped the bundle's
// product photos for drawn pictures; a review the same day found the records
// still carried real data, which this script swaps in the compiled bundle
// (public/proto/feed-ux/assets/index-*.js):
//
// 1. The interview setup's four participants (demo-01 … demo-04) and their
//    orders. Their order histories read like real research participants', so
//    they are replaced wholesale by PARTICIPANTS below: invented orders of the
//    same shape — every field the app reads, the same product kinds spread
//    differently across the four, the same status mix, dates in the same
//    weeks, round prices. Nothing of the old records is kept here.
// 2. Brand and seller names in catalogue titles, keyed in TITLES by a hash of
//    the old title (so this file does not repeat them) → the same title
//    without the name.
// 3. sourceListing: a link from each catalogue record to the marketplace
//    listing it was copied from. No code reads it, so it is dropped.
// 4. The My Orders routes, which the build declared with the base path
//    already in them ("/proto/feed-ux/orders" under the router's
//    "/proto/feed-ux/" basename), so My Orders opened at
//    /proto/feed-ux/proto/feed-ux/orders and an order's detail link
//    (/orders/<id>) matched no route and rendered blank.
//
// Only those strings change. The bundle gets a new content-hashed name
// (scripts/proto-bundle.mjs), since /proto/feed-ux/assets/* is cached as
// immutable. Run it after proto-synthetic-images.mjs, and again after any
// rebuild of the prototype from its source; a second run changes nothing.
//
//   node scripts/proto-synthetic-data.mjs           rewrite the bundle
//   node scripts/proto-synthetic-data.mjs --check   exit 1 if any of the four is left
import { createHash } from 'node:crypto';
import { SERVED, bundleAssets, objectEnd, readAsset, writeAsset } from './proto-bundle.mjs';

const args = new Set(process.argv.slice(2));
const key = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);

// ---------------------------------------------------------------- 1. participants

// One order: [pid, title, picture, category, subcategory, orderedOn, status,
// price, mrp, paid, repurchase's previous order date]. Pictures are the drawn
// catalogue's (scripts/proto-catalog-art.mjs). A repurchase is a free-size
// consumable, as in the build's own records.
const ORDERS = {
  'demo-01': [
    ['812045531', "Women's Georgette Saree with Blouse Piece | Floral Print | Festive Wear", 'saree-03', 'Women Sarees', 'Sarees', '2026-08-14', 'Delivered', 450, 600, 480],
    ['806617240', 'Insulated Lunch Bag | Leak Proof and Washable | For Office and School', 'lunchbag-01', 'Kids', 'Bags & Backpacks', '2026-08-09', 'Shipped', 180, 250, 200],
    ['1027730415', "Women's Cotton Non-Padded Sports Bra | Daily Wear", 'sportsbra-01', 'Women Comfortwear', 'Sports Bra', '2026-08-11', 'Return', 120, 200, 150],
    ['731904826', 'Sheer Net Door Curtains, 7 Feet | Pack of 2', 'curtain-01', 'Home Decor & Furnishings', 'Curtains', '2026-08-05', 'Delivered', 260, 350, 290],
    ['768250193', '3-in-1 Fast Charging Cable | Type-C and Micro USB | 1.2 m', 'cable-01', 'Mobiles, Electronics Accessories & Small Appliances', 'Cables', '2026-08-16', 'Delivered', 150, 250, 170, '2026-07-12'],
  ],
  'demo-02': [
    ['694418207', 'Gold-Plated Jhumka Earrings for Women', 'earrings-01', 'Women Jewellery', 'Earrings & Studs', '2026-08-04', 'Delivered', 110, 180, 130],
    ['752093614', "Men's Analog Watch with Metal Strap | Black Dial", 'watch-01', 'Watches', 'Analog Watches', '2026-08-12', 'RTO', 240, 400, 260],
    ['683315902', "Women's Cotton Embroidered Readymade Blouse", 'blouse-01', 'Ethnic Wear', 'Blouses', '2026-08-07', 'Shipped', 160, 220, 180],
    ['720648351', 'Decorative LED Night Lamp | Warm Glow | Plug-In', 'incense-02', 'Home Decor & Furnishings', 'Night Lamps', '2026-08-10', 'Delivered', 130, 200, 150],
    ['745129086', 'Ultra Thin Sanitary Pads, XL | Pack of 30', 'pads-01', 'Health & Wellness', 'Menstrual/Sanitary pads', '2026-08-15', 'Delivered', 290, 350, 270, '2026-07-16'],
  ],
  'demo-03': [
    ['1031862247', "Women's Rayon Printed Straight Kurti | Daily Wear", 'kurti-04', 'Women Kurtis, Kurta Sets & Suits', 'Kurtis & Kurtas', '2026-08-17', 'Ordered', 250, 330, 270],
    ['709551438', 'Cotton Diwan Set | 1 Single Bedsheet, 5 Cushion Covers and 2 Bolster Covers', 'diwan-01', 'Home Decor & Furnishings', 'Diwan Cover Sets', '2026-08-08', 'Cancelled', 400, 520, 430],
    ['688204715', 'Cotton Double Bedsheet with 2 Pillow Covers | Floral Print', 'bedsheet-03', 'Home Decor & Furnishings', 'Bedsheets', '2026-08-06', 'Delivered', 380, 500, 400],
    ['739018562', 'Wooden Finish Wireless Speaker | Portable', 'speaker-01', 'Mobiles, Electronics Accessories & Small Appliances', 'Smart Speakers', '2026-08-03', 'Return', 300, 450, 320],
    ['716437290', 'Hair Touch-Up Stick for Grey Roots | Black', 'hairstick-01', 'Beauty & Personal Care', 'Hair Color', '2026-08-13', 'Shipped', 190, 260, 210, '2026-06-20'],
  ],
  'demo-04': [
    ['664902173', "Men's Cotton Straight Kurta | Festive Wear", 'kurta-01', 'Men Fashion', 'Kurtas', '2026-08-05', 'Shipped', 220, 300, 240],
    ['1019347708', "Women's Seamless Sports Bra | Pack of 3", 'sportsbra-02', 'Women Comfortwear', 'Sports Bra', '2026-08-14', 'RTO', 230, 300, 250],
    ['697760324', 'Oxidised Silver Drop Earrings | Pack of 2', 'earrings-02', 'Women Jewellery', 'Earrings & Studs', '2026-08-09', 'Shipped', 90, 150, 110],
    ['725386019', 'Brass Finish Incense Stick Holder | Pooja Decor', 'incense-01', 'Home Decor & Furnishings', 'Incense Holders', '2026-08-11', 'Delivered', 120, 180, 140],
    ['758841630', 'Baby Diaper Pants, Medium (7–12 kg) | Pack of 60', 'diaper-02', 'Beauty & Personal Care', 'Baby Diapers', '2026-08-07', 'Delivered', 600, 800, 560, '2026-07-09'],
  ],
};

// The bundle's own record shape, field for field and in its order.
const PARTICIPANTS = Object.fromEntries(
  Object.entries(ORDERS).map(([userId, orders]) => [
    userId,
    {
      userId,
      phone: '',
      products: orders.map(([pid, title, pic, category, subcategory, orderedOn, orderStatus, price, mrp, pricePaid, prevOrderedOn = null]) => ({
        pid, title, imageUrl: `${SERVED}catalog/${pic}.webp`, category, subcategory,
        sizeOrdered: prevOrderedOn ? 'Free Size' : null, isRepurchase: !!prevOrderedOn, orderedOn, prevOrderedOn,
        orderStatus, pricePaid, price, mrp, discountPercent: Math.round(((mrp - price) / mrp) * 100),
      })),
    },
  ]),
);

// A value as the minifier writes it: bare keys where it can, !0 / !1.
function literal(v) {
  if (v === null) return 'null';
  if (typeof v === 'boolean') return v ? '!0' : '!1';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(literal).join(',')}]`;
  return `{${Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}:${literal(x)}`).join(',')}}`;
}
const NEW_PARTICIPANTS = literal(PARTICIPANTS);

function participants(js) {
  const at = js.indexOf('{"demo-01":{userId:"demo-01"');
  if (at < 0) throw new Error('The participants object ({"demo-01":{userId:…}) is not in the bundle; update participants() for the new build.');
  const end = objectEnd(js, at);
  const old = js.slice(at, end);
  if (old === NEW_PARTICIPANTS) return js;
  // The build's records must have exactly the fields written here, so the
  // swap never drops one the app reads.
  const was = new Function(`return ${old}`)();
  const shape = (o) => JSON.stringify([Object.keys(o), ...new Set(Object.values(o).flatMap((p) => [String(Object.keys(p)), ...p.products.map((x) => String(Object.keys(x)))]))]);
  if (shape(was) !== shape(PARTICIPANTS)) throw new Error(`The build's participant records changed shape:\n${shape(was)}\nwants\n${shape(PARTICIPANTS)}`);
  return js.slice(0, at) + NEW_PARTICIPANTS + js.slice(end);
}

// ---------------------------------------------------------------- 2. brand names in titles

// sha256(old title).slice(0, 16) → the title without the brand or seller.
const TITLES = {
  '32a2925955729273': "Classic Women's Top & Bottom Sets",
  '6b3573901c2a6b8f': "Stylish Women's Top & Bottom Sets",
  '3a811a34aa115141': "Women's Top Wear",
  aab1f2065542d74c: "Trendy Women's Top & Bottom Sets",
  '4b4242402a0d05a9': 'Hard Anodised Pressure Cooker',
  '590dbc6f9c755fda': 'Stainless Steel Pressure Cooker',
  e15b46f0720ddc97: 'Aluminium 5 Litre Pressure Cooker',
  '201382efe8a6c914': 'Sandwich Bottom Stainless Steel Pressure Cooker',
  '701077f5c723b311': 'Hard Anodised Aluminium Handi Pressure Cooker',
  '7b54b5b610f3893a': "Women's Trousers & Pants",
  '1989efa42897638a': 'Cute Stylish Girls Top & Bottom Sets',
  '4e1d9362c99a9fea': 'Family Card Game',
  '9108c0183fce24a0': 'Comfy Matte Liquid Lipstick, Fuchsia (3.8 ml)',
  d508ab398365a122: 'Matte Long Lasting Lip Crayon Lipstick',
  a0a1816e78d0c81c: 'Pink Gloss Stick Lipstick, Pack of 3',
  '94fb80e01af24968': 'Light Matte Liquid Lipstick, Pack of 2',
  b4d83de57f8a7077: 'Stylish Women Briefs',
  '4661fd086c196269': 'Stylish Women Blouses',
  '2b6eaf47ff3eca10': 'Woven Design Cotton Silk Sarees',
  b88bd7787a4add3e: 'Women Maxi Dress, Aqua Blue',
  '283451c0ad050f02': 'Classic Men Shirts',
  '09943ffcb39aea87': "Casual Men's Shirts",
  '47ed711c150f604f': "Men's Track Pants",
  '11ee901d1545057b': 'Graceful Men Casual Shoes',
  f6aac39de08cb1c8: 'Lifestyle Casual Shoes For Men',
  '30a65d7d6ea81176': 'Casual Shoes For Men',
};
const TITLE = /([{,]title:)"((?:[^"\\]|\\.)*)"/g;
const titles = (js) => js.replace(TITLE, (m, field, t) => (TITLES[key(t)] ? field + JSON.stringify(TITLES[key(t)]) : m));

// ---------------------------------------------------------------- 3. listing links

const LISTING = /,sourceListing:"[^"]*"/g;
const listings = (js) => js.replace(LISTING, '');

// ---------------------------------------------------------------- 4. My Orders routes

const ROUTES = [
  [`"${SERVED}orders/:orderId"`, '"/orders/:orderId"'],
  [`"${SERVED}orders"`, '"/orders"'],
];
const routes = (js) => ROUTES.reduce((s, [from, to]) => s.split(from).join(to), js);

// ---------------------------------------------------------------- running

function problems(js) {
  const out = [];
  const at = js.indexOf('{"demo-01":{userId:"demo-01"');
  if (at < 0) out.push('no participants object found');
  else if (js.slice(at, objectEnd(js, at)) !== NEW_PARTICIPANTS) out.push('participants are not the invented ones');
  const left = [...js.matchAll(TITLE)].filter((m) => TITLES[key(m[2])]).length;
  if (left) out.push(`${left} title(s) still carry a brand`);
  const links = (js.match(/sourceListing|www\.meesho\.com/g) || []).length;
  if (links) out.push(`${links} listing link(s)`);
  for (const [from] of ROUTES) if (js.includes(from)) out.push(`route ${from} still carries the base path`);
  return out;
}

let left = 0;
for (const asset of bundleAssets().filter((a) => a.endsWith('.js'))) {
  const text = readAsset(asset);
  if (args.has('--check')) {
    const p = problems(text);
    for (const x of p) console.log(`  ${asset}: ${x}`);
    left += p.length;
    continue;
  }
  const out = routes(listings(titles(participants(text))));
  if (out === text) {
    console.log(`${asset}: already synthetic`);
    continue;
  }
  const p = problems(out);
  if (p.length) throw new Error(`${asset}: ${p.join('; ')}`);
  console.log(`${asset} → ${writeAsset(asset, out)}: participants invented, brand titles and listing links gone, My Orders routes fixed`);
}
if (args.has('--check')) {
  console.log(left ? `${left} problem(s) in the bundle` : 'participants invented, no brand titles or listing links, routes fixed');
  process.exit(left ? 1 : 0);
}
