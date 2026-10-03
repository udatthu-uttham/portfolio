// The Meesho Mall case study: Uttham's teaser layout (2026-10-01), reworked from
// his notes on 2026-10-02 — Role "Just senior product designer", Timeline
// "2022-2023"; where it started (competitive, better-quality alternatives for
// shoppers who seek quality, and a subtle hint that the first launch found the
// go-to-market); v2 as the bold version that followed; the research before the
// v3 launch, with its sticky note; v3; what happened; and the full case study
// behind the gate, built from his own deck chapters (git: 09893d8^,
// src/data/studies.ts) — no colleague names, no team-lead claims, no numbers.
//
// Every element with a `state` drives the sticky phone. Uttham supplies every
// screen ("remove them and ask me I will give all of them"): drop
// src/assets/mall-case/<state>.(png|jpg|webp); the list is `screens.titles`.
// CONFIDENTIALITY: direction only — the business share "climbed" and "hit the
// share the business had asked for at kickoff"; Mall's share itself stays off.
// 2026-10-02: no v4 ("ignore the v4 stuff") and no HUL line.

import type { CaseTeaserData } from './case-teaser';

export const mallCase: CaseTeaserData = {
  title: 'From doubt to desire: building India’s new trust in online brands',
  dek: 'Rebuilding Meesho Mall so shoppers recognise brands by colour before they read a word.',
  facts: [
    { label: 'Role', value: 'Senior Product Designer' },
    { label: 'Timeline', value: '2022–2023' },
  ],
  panelLabel: 'Screen preview',
  // the rail keeps the top of the page and the main chapters, as on the product
  // cards (2026-10-02: "the scroll stepper should also have limited things")
  rail: { top: true, sections: ['When bold wasn’t enough', 'Before v3: what shoppers told us', 'v3: sell brands, not Mall', 'What happened'] },

  sections: [
    {
      state: 'v1-tag',
      heading: 'Where it started',
      blocks: [
        { kind: 'p', text: 'Meesho sells unbranded goods to shoppers who came for the price. Meesho Mall is the place inside the app for branded products: **competitive alternatives with better quality**, for shoppers who seek quality.' },
        { kind: 'p', text: 'Mall products were first tried out quietly, with a small tag on the card, and **shoppers showed they would spend a little extra for good quality**: Mall had found its go-to-market.' },
      ],
    },
    {
      state: 'v2-home',
      heading: 'When bold wasn’t enough',
      blocks: [
        { kind: 'p', text: 'With the go-to-market in hand, **v2 made Mall bold everywhere**: a home widget and banner, a Mall landing page, category pages, identifiers on listing and product pages, brand storefronts, USPs spelled out. Orders jumped at launch, **then the graphs went flat.**' },
        { kind: 'p', text: '**Shoppers ignored the messaging** and stayed on their usual paths. Mall still felt abstract. And the business had filled it with seller labels for margin, so **the badge sat on products nobody recognised.**' },
      ],
    },
    {
      heading: 'Before v3: what shoppers told us',
      blocks: [
        { kind: 'p', text: 'Research before the v3 launch, in homes and on devices.' },
        { kind: 'quote', text: '“I did not find brands, but if Meesho suggests I would consider purchasing it.”', source: 'Research participant, before v3.' },
        {
          kind: 'steps',
          steps: [
            { state: 'v2-home', label: 'The name already worked', text: '“Mall” meant company products to shoppers before we explained anything.' },
            { state: 'v2-usps', label: 'Nobody wanted a programme', text: 'USPs and programme language were ignored. **People cared about the product in front of them.**' },
            { state: 'v2-pill', label: 'The badge was unreadable', text: 'The old pill was hard to read; the letter “l” confused people. **A tick read as trust.** Purple stood out from every other colour in the app.' },
          ],
        },
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
            { state: 'v3-labels', label: 'Seller labels out', text: 'Argued the business out of local seller labels: **real brands only, or the badge means nothing.** Popular brand names became the explanation.' },
            { state: 'v3-pill', label: 'A badge shoppers can read', text: 'Purple tick, legible wordmark. Colour chosen to win attention on a listing card against every other tag and programme; **colour and mark made stronger than the Mall branding itself.**' },
          ],
        },
        {
          kind: 'steps',
          heading: 'Be found',
          steps: [
            { state: 'v3-nav', label: 'Bottom-nav entry and onboarding', text: 'Mall got a tab. The modal explains it with **brands people already know** and celebrity faces for trust and attention.' },
            { state: 'v3-splash', label: 'Splash on first visits', text: 'For the first few entries into a Mall product or landing page: **the feeling of walking into a mall to buy company products.**' },
            { state: 'v3-ftux', label: 'Listing-page hint', text: 'For shoppers who missed onboarding and never visited Mall: explains Mall and **points at the pill so they can find it again.**' },
          ],
        },
        {
          kind: 'steps',
          heading: 'Be understood where decisions happen',
          steps: [
            { state: 'v3-pdp', label: 'Product page', text: 'A purple enclosure so **a Mall product page looks different from the rest.** A brand entry point at the top for curiosity. Brand content and brand performance below the details.' },
            { state: 'v3-landing-new', label: 'Landing page for new shoppers', text: '**Popular brand logos**, popular products as hooks, brand names that rotate weekly; top categories to catch intent; product-level discovery kept.' },
            { state: 'v3-landing-active', label: 'Landing page for returning shoppers', text: 'Mall-local search for faster rediscovery, top categories for quick access, a best-offers widget.' },
            { state: 'v3-ocp', label: 'Order confirmation', text: 'A purple animation at the moment of purchase, so **the colour and the programme stick.**' },
          ],
        },
      ],
    },
    {
      state: 'v3-brands',
      heading: 'What happened',
      blocks: [
        { kind: 'p', text: 'Seller labels are gone from Mall; **every product with the badge is a brand.** **Shoppers recognise Mall by colour** before they read a word.' },
        { kind: 'quote', text: '“Purple colour means Mall. These products come directly from the company, we can buy them without worrying about quality.”', source: 'Household interview, Lucknow.' },
        { kind: 'p', text: 'Mall’s share of the business is confidential for a listed company; **I walk through it in interviews.**' },
        { kind: 'gate' },
        {
          kind: 'inside',
          lead: 'In the full case study:',
          items: [
            'The v2 mixed-feed bet, and why it lost',
            'The research turn: its rounds, places and methods',
            'The seller-label call, from v2 to v3',
            'The purple tick and every v3 surface: why, how, what worked',
          ],
        },
      ],
    },
  ],
  gate: {
    text: 'The full case study expands here. Live, it sits behind a password that comes with my application.',
    cta: 'Read the full case study',
  },

  // The full case study, from his deck chapters: why / how / what worked,
  // direction and status only.
  experiments: [
    {
      state: 'v2-mixed-feed',
      title: 'v2: the mixed-feed bet',
      status: 'Shipped, then flat',
      why: 'The first launch had found the go-to-market, but **its quiet tag did not explain Mall**: asked to point out the branded products, shoppers said everything looked branded. Awareness and discoverability were low, and **people did not realise they were ordering from Mall.**',
      how: 'v2 made an aggressive bet on **mixed feeds**: a pill and a colour on Mall cards inside normal search and category results, so shoppers met Mall where they already scroll and could compare it with marketplace products. Around it, **more journey points and louder comms**: a home widget and banner, a Mall landing page, category landing pages, identifiers on listing and product pages, brand storefronts, and the USPs “Original Brands” and “Direct From Company” on home and the product page.',
      worked: 'Orders and views jumped at launch, **Mall’s share of the business climbed**, and the launch won a quarterly award. Then the line went flat. **People scan images, not pills.** The pill was read last, if at all, and **a cheaper look-alike beside a Mall card became the hook.** Marketplace listings carry promises inside their photos, so **brand cards looked quiet next to them**; duplicates of the very brands we highlighted blurred the signal.',
    },
    {
      state: 'research-concepts',
      title: 'The research turn',
      status: 'Through v2 and v3',
      why: 'The v2 reads and the usability tests agreed: **comprehension was poor even among shoppers who had visited Mall many times**, so the constructs we had shipped were not doing the job. Another shade of blue would not fix that.',
      how: '**We went to homes instead of shipping another tweak.** About **four rounds a year for a year and a half**: diary studies with repeat shoppers, a week each; in-home interviews in Lucknow and Gaya, in Hindi; concept preference tests with 50+ shoppers a round; and usability tests on every v2 and v3 build.',
      worked: '“Mall” already meant company products, and **USPs did not matter: people cared only about the product they wanted.** The old mark was hard to read, and a tick in purple read as trust. ^^No amount of blue, or boldness, could shortcut genuine user belief.^^',
    },
    {
      state: 'v2-labels',
      title: 'The seller-label call',
      status: 'Removed in v3',
      why: 'In v2 the business **wanted seller labels on Mall products for margin**: small local labels, not the brands shoppers knew. **Shoppers had not built trust in Mall yet**, and every label that was not a brand diluted the one thing the badge had to say.',
      how: 'I argued against them in v2, and the labels went in anyway. **The research gave the argument its evidence**: the labels were diluting what shoppers understood Mall to be. For v3, **my advocacy and research shifted us to real brands only**, with popular brand names as the explanation of Mall.',
      worked: '**Seller labels came off entirely**, so every product with the badge is a brand, and **national brands started onboarding.**',
    },
    {
      state: 'v3-pill',
      title: 'The purple tick',
      status: 'Shipped in v3',
      why: 'On a listing card the Mall pill competed with **every other tag and programme in the app**, and shoppers could not read it: the letter “l” confused people.',
      how: 'Two goals for the rebrand: **find the colour that wins attention on a listing card** among every other colour and programme, and make the colour and mark stronger than the Mall branding itself, so a shopper knows Mall without reading it. **A tick, because a tick read as trust**; a legible wordmark; purple, because it stood out from every other colour in the app.',
      worked: 'Purple came to mean Mall: **shoppers recognise it by colour before they read a word.**',
    },
    {
      state: 'v3-nav',
      title: 'v3: purple became the promise',
      status: 'Shipped in v3',
      why: 'v2 had explained Mall, and shoppers ignored the explaining. v3 set two objectives: **make shoppers aware Mall exists**, through brands they already know, and **make them understand it where they decide**, so they remember it next time.',
      how: 'v3 rebuilt Mall around **recognition, not explanation.** **One colour and one mark, carried through every step:** a bottom-nav entry with an education modal of popular brands and celebrity faces; a splash for the first few visits; a hint on listings for anyone who missed it; a purple enclosure on the product page, with the brand’s own content; a landing page that leads with logos for newcomers and search for regulars; and a purple animation when the order is confirmed.',
      worked: '**People now recognise Mall by colour.** Anchored by celebrities and icons, Mall became recognisable, a go-to place and, finally, trusted, and it **hit the share the business had asked for at kickoff.** The lesson I took from it: **the answer was brand-led storytelling, not more UI tweaks.**',
    },
  ],

  screens: {
    dir: 'mall-case',
    // Uttham, 2026-10-03: "no need of v2 USPs or V2 pill use the v2 home
    // directly, for v3-labels and pill and all v3 top designs, I have pasted
    // ones with static contents". Those rows show the v2 home and the v3
    // listing; the Mall tab's row plays its onboarding modal, then the PiP on
    // the home screen (both from his Figma, the celebrity onboarding). The
    // first-visit hint is that same onboarding (2026-10-03: "v3-ftux is homepage
    // ftux only, that is the animation"), so its row plays the modal again.
    map: {
      'v2-usps': 'v2-home',
      'v2-pill': 'v2-home',
      'v3-labels': 'v3-pill',
      'v3-nav': ['v3-nav', 'v3-nav-pip'],
      'v3-ftux': 'v3-nav',
    },
    // Screens that move: his Figma animations, exported as MP4 (2026-10-03).
    // Keyed by file; the file's own still in this folder is the poster.
    videos: {
      'v3-nav': '/media/mall-case/v3-nav.mp4',
      'v3-nav-pip': '/media/mall-case/v3-nav-pip.mp4',
      'v3-splash': '/media/mall-case/v3-splash.mp4',
      'v3-ocp': '/media/mall-case/v3-ocp.mp4',
    },
    alts: {
      'v1-tag': 'A listing page with the first, small “Mall” tag on a product card',
      'v2-home': 'v2: the home screen with the Mall widget and banner',
      'v3-pill': 'v3: a listing page where Mall cards carry the purple tick among marketplace cards',
      'v3-nav': 'v3: the home screen with the Mall tab and its onboarding modal',
      'v3-nav-pip': 'v3: the home screen with a picture-in-picture video introducing Mall',
      'v3-splash': 'v3: the Mall splash on a first visit',
      'v3-pdp': 'v3: a Mall product page inside its purple enclosure',
      'v3-landing-new': 'v3: the Mall landing page for new shoppers',
      'v3-landing-active': 'v3: the Mall landing page for returning shoppers',
      'v3-ocp': 'v3: the purple order-confirmation moment',
      'v3-brands': 'v3: Mall with every badged product from a brand, national brands on the shelf',
      'v2-mixed-feed': 'v2: search results with Mall cards mixed between marketplace cards',
      'research-concepts': 'Badge concepts from the preference tests, side by side on a listing card',
      'v2-labels': 'v2: a Mall listing where the badge sits on small local seller labels',
    },
    // the title on the card above the phone, and the list of screens he supplies
    titles: {
      'v1-tag': 'The first Mall tag',
      'v2-home': 'v2: Mall everywhere',
      'v3-pill': 'v3: the purple tick',
      'v3-nav': 'v3: the Mall tab',
      'v3-nav-pip': 'v3: Mall, introduced on the home',
      'v3-splash': 'v3: the first-visit splash',
      'v3-pdp': 'v3: the purple product page',
      'v3-landing-new': 'v3: landing for newcomers',
      'v3-landing-active': 'v3: landing for regulars',
      'v3-ocp': 'v3: order confirmed in purple',
      'v3-brands': 'Every badge a brand',
      'v2-mixed-feed': 'v2: the mixed feed',
      'research-concepts': 'Concepts shoppers tested',
      'v2-labels': 'v2: seller labels in Mall',
    },
  },
};
