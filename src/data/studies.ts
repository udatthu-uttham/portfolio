import { plpCase } from './plp-case';
import { mallCase } from './mall-case';
import type { CaseTeaserData } from './case-teaser';

export type Chapter = {
  eyebrow: string; // the ruler voice — wayfinding, not a heading
  heading: string;
  body: string | string[]; // one short paragraph, or two at most; **bold** and ^^large bold^^ follow the deck's emphasis
  figure?: { label: string; caption: string; screens?: string[]; image?: string; callout?: string; tone?: 'lavender'; embed?: string }; // screens = phone frames; image = a card cropped from the deck; both are keys into src/assets/mall
  quote?: { text: string; mark: string }; // handwriting on paper; `mark` is the highlighted phrase
  numbers?: { value: string; label: string }[]; // plain type, not stat tiles
  verbatim?: { text: string; source: string }; // a sticky note
  working?: { label: string; items: string[] }; // folded 'show the working' note, closed by default
  notes?: { text: string; source: string; tilt: string }[]; // a cluster of sticky notes in the side column
};

// A handwritten note beside a tile's phone, the way a crit board is annotated
// (Uttham, 2026-10-03: "maybe add some highlights in text around the thumbnail
// about what we changed"). `text` is a few words, true to what the screen
// shows; `y` is where its arrow lands, as a fraction of THIS screen's height
// (0 = top, 1 = bottom). The note sits on the phone's outer side — left of the
// "from", right of the "to" — with its words above the arrow, so keep `y` past
// about 0.3. A phone's notes are in priority order: on a narrow sheet only the
// "to" phone's notes stay, and on the narrowest (a 320px phone) only its first,
// hanging below its tip instead.
export type TileNote = { text: string; y: number };

// One phone in the homepage tile's glass well. `image` is <folder>/<state> under
// src/assets (the case page's own screens); the phone takes the export's own
// aspect ratio and shows the whole of it (Uttham, 2026-10-03: "when I give big
// images I dont want you to just paste them or crop them abruptly making its
// content gone"). tone 'old' = the "from": shorter and in grey; tone 'new' = the
// "to": full height in colour, its tag on amber. `label` is the tag, which
// stands above its phone, never over the screen.
export type TilePhone = { image: string; label?: string; tone?: 'old' | 'new'; notes?: TileNote[] };

export type Study = {
  slug: string;
  kicker: string;
  year: string;
  title: string;
  summary: string;
  focus: string;
  scope: string[];
  placeholder?: string; // stands in the tile's media well until the visuals land
  featured?: boolean; // on the board as a tile with media; everything else lists in the index rows below it
  deck?: { title: [string, string]; subtitle: string; byline: string; pdf: string; screen: string }; // slide 1 of the source deck: the case opens the way the deck does
  cover?: { image: string; caption: string }; // a study without a deck opens on one render, as a card on the pane
  // The homepage tile's phones, standing in its glass well: one screen, or two
  // side by side for a from → to (Uttham, 2026-10-03: "from what to what").
  tile?: { phones: TilePhone[] };
  chapters?: Chapter[]; // optional story below the hero; studies without it render as before
  teaser?: CaseTeaserData; // the teaser layout (case-teaser.ts): replaces hero, artboard and chapters on its case page
};

export const studies: Study[] = [
  {
    // Working title. The spine is the shared currency: MVT chips and the cash
    // price row both SPEND a line of card height, staggering RECLAIMS it — which
    // is why these are one case study and not three. Records: REC-001, REC-002,
    // REC-003 in the Context Layer repo.
    slug: 'a-line-of-card-height',
    featured: true,
kicker: 'Current',
year: '2026—',
    // Title and line are Uttham's (2026-10-03: "Meesho product cards title use
    // camel case, and subtitle From quick scan to empowered scan, and helping
    // users understand products better."): the title in title case, the claim
    // in bold.
    title: 'Meesho Product Cards',
    summary: 'From quick scan to empowered scan, and **helping users understand products better.**',
focus: 'Attribute chips and a second price row **spend** card height; staggering **reclaims** it. **Running them separately was the mistake** — the real question is **the exchange rate between them.**',
scope: ['Product card systems', 'Experiment design', 'PLP at scale'],
    cover: { image: 'stagger-cover', caption: 'Left: every card padded to its row. Right: height follows content, and an extra card enters by the third row.' },
    // The old feed and the new one, side by side (Uttham, 2026-10-03: "highlight
    // the old and new in the first, basically from what to what, it should look
    // like 2 phones showing both the variations"), grey and colour, with a few
    // handwritten notes on what changed ("lets keep it like the grey and colorful
    // ones only, maybe add some highlights in text around the thumbnail about what
    // we changed"). DRAFT wording, for Uttham to rewrite. Each `y` is measured on
    // the 1080×2160 export: Before's first row is padded to its taller card, so
    // the shirt card has blank paper under its rating (y≈0.46–0.51); After's
    // shampoo card carries chips in place of its name (0.31–0.35); and its third
    // product, the yellow kurti, carries the dots of an image carousel at
    // 0.651–0.665 (its next picture peeks in at the card's edge). The last note
    // is his (2026-10-03: "in the image arrow explanations, instead of cards at
    // natural height, say that images are scrollable, the third product in new
    // one shows this"): the old "Cards at natural height" (0.837) is gone.
    // The lower note of a pair must be ONE line: its box is about 44px tall on a
    // one-line note and 65px on two, and the pair's tips stand only 0.35 of the
    // screen apart (51px on a 1280×720 well, where the "to" is 148px tall), so
    // "Images you can swipe", which wraps, ran its words into the note above.
    // "Images scroll" has ~15% to spare at the narrowest note column.
    tile: { phones: [
      { image: 'plp/before', label: 'Before', tone: 'old', notes: [
        { text: 'Padded to the tallest card', y: 0.49 },
      ] },
      { image: 'plp/after', label: 'After', tone: 'new', notes: [
        { text: 'Facts replace the title', y: 0.31 },
        { text: 'Images scroll', y: 0.658 },
      ] },
    ] },
    // The case page is Uttham's teaser layout (2026-10-01); the six-chapter
    // "exchange rate" draft it replaces is in git history.
    teaser: plpCase,
  },
  {
    slug: 'meesho-mall',
    featured: true,
    kicker: 'Vision',
    year: '2022–2023',
    title: 'Meesho Mall',
    summary: 'From doubt to desire: **building India’s new trust in online brands.**',
    deck: {
      title: ['From doubt to Desire:', 'Building India’s new trust in online brands'],
      subtitle: 'Product and design strategy for brand discovery at national scale.',
      byline: 'Uttham Udatthu · Senior Product Designer',
      pdf: '/meesho-mall-case-study.pdf',
      screen: 'v3-landing',
    },
    // v2 → v3, landing page to landing page (Uttham, 2026-10-03, on standing
    // the v2 screen beside v3: "2 can do"; then "mall landing page v2, you have
    // used wrong reference, I have added the right one"; "update the notes
    // accordingly"). v2 sells Mall itself — the big wordmark, "Branded products
    // at best prices", its own promises — and keeps the brands to a thin strip
    // of logos; v3 sells the brands — the logo wall, the brand on every card,
    // the "Popular Brands" band (his "sell brands, not Mall"). DRAFT wording, for
    // Uttham to rewrite, except v2's, which is his ("say the focus was on mall
    // USPs"), and v3's second, which is his meaning (2026-10-03: "In Mall card
    // instead of mall shrinks as a tick, say that mall is explained via brands
    // as hook not USPs"; the old "Mall shrinks to a tick", at 0.93, is gone).
    // Each `y` is measured on the export: v2's "Original Brands · Direct From
    // Company" row at 0.24; v3's brand badge on the first card at 0.40 and the
    // purple "Now on meesho · Popular Brands" band under the cards at 0.79–0.92,
    // where Mall is explained by its brands. The logo wall above the cards
    // (0.08–0.35) is the other brand hook, but a note's words stand above its
    // tip, so a `y` much past 0.3 is what clears the glass, and that is only
    // 0.07 from the card's note. The notes need about half a screen between
    // them, or their words collide on a short tablet or laptop well: 0.51 here,
    // which is 75px against a 65px two-line note on a 1280×720 well. Keep the
    // lower note short: it is two lines on a laptop and three at 1920×1080,
    // where the "to" is 261px tall and there is room.
    tile: { phones: [
      { image: 'mall-case/v2-landing', label: 'v2', tone: 'old', notes: [
        { text: 'The focus was on Mall USPs', y: 0.24 },
      ] },
      { image: 'mall-case/v3-landing-new', label: 'v3', tone: 'new', notes: [
        { text: 'The brand on every card', y: 0.4 },
        { text: 'Brands as the hook, not USPs', y: 0.91 },
      ] },
    ] },
    focus: 'Making “branded” **believable to shoppers who had never met a brand online** — then finding that the answer was **storytelling, not more UI.**',
    scope: ['Product strategy', 'Brand & identity', 'User research'],
    placeholder: 'Program visuals coming soon.',
    // The case page is Uttham's teaser layout (2026-10-01); the deck-first
    // chapters it replaces are in git history. `deck` stays: the homepage tile
    // stands its phone on deck.screen.
    teaser: mallCase,
  },
];

export const contact = {
  email: 'ultimateuttham@gmail.com',
  linkedin: 'https://www.linkedin.com/in/udatthu-uttham/',
  linkedinHandle: 'udatthu-uttham',
  phone: '+91 73819 52468',
  whatsapp: 'https://wa.me/917381952468',
};
