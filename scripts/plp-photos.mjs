// The catalogue photos the product-cards case study's composed screens borrow
// from the realistic prototype (Uttham, 2026-10-04: "In the first project
// teaser, the images are repititive can we use other images to make the image
// output realistic take it from prototype porject"; 2026-10-03, on the same
// photos for the swipe clip: public, fine to use).
//
// Every one is a public Meesho catalogue photo that the prototype's compiled
// bundle (public/proto/feed-ux/assets/index-*.js) already references by
// address, under its women_kurti records. The prototype has no earphones (its
// only electronics are a speaker and a cable), so the list view keeps
// Uttham's own earphone photo on every row.
//
// Used by scripts/plp-compose.mjs (the titles grid) and
// scripts/plp-swipe-clip.mjs (the Kurti feed under the swipe clip). Each photo
// is fetched once into .clip-work/plp-photos/ (untracked) when missing, so the
// two scripts stay re-runnable on a clean checkout; the page never loads them.
//
// `crop` is the square each card shows, in the photo's own pixels: from the
// top of the model's head down past the kurti's hem, as Uttham's own yellow
// kurti stands in its card, and clear of the "s-<id>" stamp in the photo's
// bottom-left corner. A card scales it into its own picture box (cover, so
// only the box's 0–1px of non-squareness is trimmed). Only kurtis: every card
// they go into reads "Kurti", "Kurti · Cotton" or "Cotton".
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const DIR = `${root}.clip-work/plp-photos`;

const at = (id, file) => `https://images.meesho.com/images/products/${id}/${file}`;

export const PHOTOS = {
  // a red printed A-line kurti, front (the swipe clip's first card swipes to it)
  red: { id: '5047403', n: 1, url: at('5047403', '1.jpg'), crop: { left: 29, top: 0, width: 1222, height: 1222 } },
  // a teal printed anarkali, front (512 × 683, so its square is the photo's width)
  teal: { id: '5038838', n: 1, url: at('5038838', 'mvhxc.jpg'), crop: { left: 0, top: 0, width: 512, height: 512 } },
  // a grey-and-white printed A-line with a navy border, front
  grey: { id: '5037151', n: 1, url: at('5037151', '1.jpg'), crop: { left: 150, top: 0, width: 1700, height: 1700 } },
  // a black anarkali with a gold yoke and hem, front and back (same square)
  black: { id: '5037149', n: 1, url: at('5037149', '1.jpg'), crop: { left: 110, top: 0, width: 1280, height: 1280 } },
  blackBack: { id: '5037149', n: 2, url: at('5037149', '2.jpg'), crop: { left: 110, top: 0, width: 1280, height: 1280 } },
  // an ivory kurti with a blue-and-yellow print, front and back (same square)
  ivory: { id: '5041199', n: 1, url: at('5041199', '1.jpg'), crop: { left: 0, top: 0, width: 1080, height: 1080 } },
  ivoryBack: { id: '5041199', n: 2, url: at('5041199', '2.jpg'), crop: { left: 0, top: 0, width: 1080, height: 1080 } },
  // a short green-and-navy kurti over leggings, front
  navy: { id: '5040548', n: 1, url: at('5040548', '1.jpg'), crop: { left: 0, top: 20, width: 512, height: 512 } },
};

// the local file for a photo, fetched from its public address when missing
export const photoFile = async (photo) => {
  mkdirSync(DIR, { recursive: true });
  const file = `${DIR}/${photo.id}-${photo.n}.jpg`;
  if (!existsSync(file)) {
    console.log(`fetching ${photo.url}`);
    const res = await fetch(photo.url);
    if (!res.ok) throw new Error(`${photo.url}: ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
};
