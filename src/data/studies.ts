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
    // The case page is Uttham's teaser layout (2026-10-01); the six-chapter
    // "exchange rate" draft it replaces is in git history.
    teaser: plpCase,
  },
  {
    slug: 'meesho-mall',
    featured: true,
    kicker: 'Vision',
    year: '2021—',
    title: 'Meesho Mall',
    summary: 'From doubt to desire: **building India’s new trust in online brands.**',
    deck: {
      title: ['From doubt to Desire:', 'Building India’s new trust in online brands'],
      subtitle: 'Leading product & design strategy for brand discovery at national scale.',
      byline: 'Uttham Udatthu · Lead Product Designer',
      pdf: '/meesho-mall-case-study.pdf',
      screen: 'v3-landing',
    },
    focus: 'Making “branded” **believable to shoppers who had never met a brand online** — then finding that the answer was **storytelling, not more UI.**',
    scope: ['Product strategy', 'Brand & identity', 'User research', 'Team mentorship'],
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
