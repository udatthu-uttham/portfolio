// The Meesho Mall case study, built from Uttham's teaser layout (2026-10-01,
// "Meesho Mall case study — teaser layout.html" / .md / its PDF print). The
// words are his; only the **bold** highlights are ours (CLAUDE.md).
//
// Every element with a `state` drives the sticky phone. The screens are the
// Mall deck's own exports already in src/assets/mall/, mapped below; a state
// with no screen of its own shows the nearest earlier one. To add one, drop
// src/assets/mall/<state>.(png|jpg|webp) — e.g. v3-ocp.png — and it is used.
//
// Left out until Uttham supplies them (the layout marks them as placeholders):
// the v3 year in Timeline, the Team row, and the full case study behind the
// gate (its spec, mall-case-study-context.md, was not attached) — so the gate
// card has no button yet. CONFIDENTIALITY: direction only — "Orders jumped at
// launch, then the graphs went flat" and "Mall's share of the business is
// confidential" are the layout's own wording.

import type { CaseTeaserData } from './case-teaser';

export const mallCase: CaseTeaserData = {
  title: 'From doubt to desire: building India’s new trust in online brands',
  dek: 'Rebuilding Meesho Mall so shoppers recognise brands by colour before they read a word.',
  facts: [
    { label: 'Role', value: 'Lead Product Designer, product and design strategy' },
    { label: 'Timeline', value: 'Mall v1 in October 2021; this case is v3' },
  ],
  panelLabel: 'Screen preview',

  sections: [
    {
      state: 'v1-tag',
      heading: 'Where it started',
      blocks: [
        { kind: 'p', text: 'Meesho sells unbranded goods to shoppers who came for the price. Meesho Mall is **the place inside the app for branded products**: competitive alternatives with better quality than the listings around them.' },
        { kind: 'p', text: 'October 2021, v1: a “Mall” tag on the product card and a line under the product details. **Shoppers could not tell what it meant.** Asked to point out the branded products, they said **everything looked branded.**' },
      ],
    },
    {
      state: 'v2-journey',
      heading: 'When bold wasn’t enough',
      blocks: [
        { kind: 'p', text: '**v2 put Mall everywhere**: a home widget and banner, a Mall landing page, category pages, identifiers on listing and product pages, brand storefronts, USPs spelled out. Orders jumped at launch, **then the graphs went flat.**' },
        { kind: 'p', text: '**Shoppers ignored the messaging** and stayed on their usual paths. Mall still felt abstract. And the business had filled it with seller labels for margin, so **the badge sat on products nobody recognised.**' },
      ],
    },
    {
      heading: 'What shoppers told us',
      blocks: [
        { kind: 'p', text: 'Research before v3, in homes and on devices.' },
        {
          kind: 'steps',
          steps: [
            { state: 'v3-research', label: 'The name already worked', text: '“Mall” meant company products to shoppers before we explained anything.' },
            { state: 'v3-research', label: 'Nobody wanted a programme', text: 'USPs and programme language were ignored. People cared about the product in front of them.' },
            { state: 'v3-pill', label: 'The badge was unreadable', text: 'The old pill was hard to read; the letter l confused people. A tick read as trust. Purple stood out from every other colour in the app.' },
          ],
        },
        { kind: 'quote', text: '“I did not find brands, but if Meesho suggests I would consider purchasing it.”', source: 'Research participant, before v3.' },
      ],
    },
    {
      heading: 'v3: sell brands, not Mall',
      blocks: [
        { kind: 'p', text: 'Two objectives: make shoppers **aware Mall exists**, and make them **understand what it is** when they meet it.' },
        {
          kind: 'steps',
          heading: 'Decide what Mall is',
          steps: [
            { state: 'v3-labels', label: 'Seller labels out', text: 'Argued the business out of local seller labels: real brands only, or the badge means nothing. Popular brand names became the explanation.' },
            { state: 'v3-pill', label: 'A badge shoppers can read', text: 'Purple tick, legible wordmark. Colour chosen to win attention on a listing card against every other tag and programme; colour and mark made stronger than the Mall branding itself.' },
          ],
        },
        {
          kind: 'steps',
          heading: 'Be found',
          steps: [
            { state: 'v3-nav', label: 'Bottom-nav entry and onboarding', text: 'Mall got a tab. The modal explains it with brands people already know and celebrity faces for trust and attention.' },
            { state: 'v3-splash', label: 'Splash on first visits', text: 'For the first few entries into a Mall product or landing page: the feeling of walking into a mall to buy company products.' },
            { state: 'v3-ftux', label: 'Listing-page hint', text: 'For shoppers who missed onboarding and never visited Mall: explains Mall and points at the pill so they can find it again.' },
          ],
        },
        {
          kind: 'steps',
          heading: 'Be understood where decisions happen',
          steps: [
            { state: 'v3-pdp', label: 'Product page', text: 'A purple enclosure so a Mall product page looks different from the rest. A brand entry point at the top for curiosity. Brand content and brand performance below the details.' },
            { state: 'v3-landing-new', label: 'Landing page for new shoppers', text: 'Popular brand logos, popular products as hooks, brand names that rotate weekly; top categories to catch intent; product-level discovery kept.' },
            { state: 'v3-landing-active', label: 'Landing page for returning shoppers', text: 'Mall-local search for faster rediscovery, top categories for quick access, a best-offers widget.' },
            { state: 'v3-ocp', label: 'Order confirmation', text: 'A purple animation at the moment of purchase, so the colour and the programme stick.' },
          ],
        },
      ],
    },
    {
      state: 'v4-quote',
      heading: 'What happened',
      blocks: [
        { kind: 'p', text: 'Seller labels are gone from Mall; **every product with the badge is a brand.** National brands including HUL have come on. **Shoppers recognise Mall by colour** before they read a word.' },
        { kind: 'quote', text: '“Purple colour means Mall. These products come directly from the company, we can buy them without worrying about quality.”', source: 'Household interview, Lucknow.' },
        { kind: 'p', text: 'Mall’s share of the business is confidential for a listed company; I walk through it in interviews.' },
        { kind: 'p', text: 'Now, v4: brand-specific discount indicators, a roadmap for launching national brands, and **helping shoppers tell look-alike unbranded products from the real thing.**' },
        {
          kind: 'inside',
          lead: 'In the full case study:',
          items: [
            'Every v3 change: why, how, what worked',
            'The research behind the pivot, with verbatims',
            'Screens for every surface, v1 to v4',
            'The seller-label decision and what it cost',
            'Building the team that built it',
          ],
        },
        { kind: 'gate' },
      ],
    },
  ],
  gate: {
    text: 'The full case study expands here. Live, it sits behind a password that comes with my application.',
    cta: 'Read the full case study',
  },

  // The Mall deck's exports in src/assets/mall/ (state → file); states not
  // listed use a file named after the state, if one is dropped in.
  screens: {
    dir: 'mall',
    map: {
      'v1-tag': 'v1-plp-tag',
      'v2-journey': 'v2-home',
      'v3-pill': 'v3-landing',
      'v3-nav': 'v3-home-pip',
      'v3-ftux': 'v3-plp-ftux',
      'v3-landing-new': 'v3-landing',
    },
    alts: {
      'v1-tag': 'v1: a listing page with the small “Mall” tag on a product card',
      'v2-journey': 'v2: the home screen with the Mall widget and banner',
      'v3-research': 'Research before v3',
      'v3-pill': 'v3: Mall products with the purple tick badge',
      'v3-labels': 'v3: real brands only',
      'v3-nav': 'v3: the home screen with the Mall tab and its onboarding',
      'v3-splash': 'v3: the Mall splash on a first visit',
      'v3-ftux': 'v3: the listing-page hint pointing at the Mall pill',
      'v3-pdp': 'v3: a Mall product page inside its purple enclosure',
      'v3-landing-new': 'v3: the Mall landing page for new shoppers',
      'v3-landing-active': 'v3: the Mall landing page for returning shoppers',
      'v3-ocp': 'v3: the purple order-confirmation moment',
      'v4-quote': 'What happened',
    },
  },
};
