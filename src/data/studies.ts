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

// One phone in the homepage tile's glass well. `image` is <folder>/<state> under
// src/assets (the case page's own screens). tone 'old' = the "from": shorter and
// muted; tone 'new' = the "to": full height, its tag on amber. `loupe` = the
// region of THIS screen the paper loupe strip magnifies, [x, y, w, h] in the
// export's own pixels. The strip renders only when a tile has exactly two phones
// and both carry a loupe, so the change itself is legible at tile size (Uttham,
// 2026-10-03: "create phone mocks to represent the images on home page … these
// images have strong hook and content"). Keep a pair's two windows the same
// aspect ratio so the two crops are identical objects.
export type TilePhone = { image: string; label?: string; tone?: 'old' | 'new'; loupe?: [number, number, number, number] };

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
    title: 'Meesho product cards',
    summary: 'From quick to empowered scan: **helping users understand products better at first glance.**',
focus: 'Attribute chips and a second price row **spend** card height; staggering **reclaims** it. **Running them separately was the mistake** — the real question is **the exchange rate between them.**',
scope: ['Product card systems', 'Experiment design', 'PLP at scale'],
    cover: { image: 'stagger-cover', caption: 'Left: every card padded to its row. Right: height follows content, and an extra card enters by the third row.' },
    // The old feed and the new one, side by side (Uttham, 2026-10-03: "highlight
    // the old and new in the first, basically from what to what, it should look
    // like 2 phones showing both the variations"), and one paper loupe across
    // both on the same shampoo card, so the hook reads at tile size ("these
    // images have strong hook and content"): a line of name text becomes fact
    // chips. Before stops above the price pill (y≈835), so its struck price never
    // shows; After stops above the price row. Both start at x 546, clear of the
    // column gutter and the screen's right-edge line.
    tile: { phones: [
      { image: 'plp/before', label: 'Before', tone: 'old', loupe: [546, 698, 528, 129] },
      { image: 'plp/after', label: 'After', tone: 'new', loupe: [546, 646, 528, 129] },
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
    // The Mall landing page he supplied (2026-10-03), in the tile's phone. The
    // v2 → v3 pair waits for Uttham's yes on standing his deck export as the
    // "from"; until then the tile keeps one phone and no loupe. Once he agrees:
    //   tile: { phones: [
    //     { image: 'mall/v2-plp-badge', label: 'v2', tone: 'old', loupe: [0, 200, 720, 176] },
    //     { image: 'mall-case/v3-landing-new', label: 'v3', tone: 'new', loupe: [0, 416, 1080, 264] },
    //   ] },
    // (v2: wordmark, "Branded products at best prices", logo tiles; v3: tick
    // "Mall", "Original Brands, Top Quality", the logo wall — his "sell brands,
    // not Mall".)
    tile: { phones: [{ image: 'mall-case/v3-landing-new' }] },
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
