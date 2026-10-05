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

  // THE STORYLINE (approved 2026-10-05, after a preview: "Now make these
  // changes and update the git and website"), from doubt to desire as the
  // title promises: shoppers came for the price, a quiet tag proved some would
  // pay a little more, but it did not explain Mall (Where it started) → v2 bet
  // on loud: orders jumped, then went flat, and the business filled Mall with
  // seller labels against his argument (When bold wasn't enough) → homes, where
  // few recognised Mall and those who did took it for a nearby mall → v3:
  // seller labels argued out, a badge people can trust and notice, brands as
  // the hook → Mall became recognisable, a go-to place and, finally, trusted, a
  // Lucknow household's three cards the proof, and his lesson before the gate.
  // A quote with several insights is one card per insight (`kind: 'quotes'`).

  sections: [
    {
      state: 'v1-tag',
      heading: 'Where it started',
      blocks: [
        { kind: 'p', text: 'Meesho sells unbranded goods to shoppers who come for the price. Meesho Mall is the place inside the app for branded products: **competitive alternatives with better quality**, for shoppers who seek quality.' },
        { kind: 'p', text: 'Mall products were first tried out quietly, with a small tag on the card, and **shoppers showed they would spend a little extra for good quality**: Mall had found its go-to-market.' },
        // the doubt the title promises, moved up from the full study's v2 Why,
        // its finding in his words (Uttham, 2026-10-05: "shoppers were not able
        // to identify brands"). It gives v2's boldness its motive
        { kind: 'p', text: 'But the **quiet tag did not explain Mall**: shoppers were not able to identify brands.' },
      ],
    },
    {
      state: 'v2-home',
      heading: 'When bold wasn’t enough',
      blocks: [
        // his live paragraph, its opening "With the go-to-market in hand," and
        // most of its list of surfaces left out (the full study's v2 How names
        // them); "USPs spelled out" stays, the setup for "Nobody wanted a
        // programme" and v3's "not Mall"
        { kind: 'p', text: '**v2 made Mall bold everywhere**, USPs spelled out. Orders jumped at launch; **then the graphs went flat.**' },
        // his live paragraph, unchanged
        { kind: 'p', text: '**Shoppers ignored the messaging** and stayed on their usual paths. Mall still felt abstract. And the business had filled it with seller labels for margin, so **the badge sat on products nobody recognised.**' },
        // his deck's sentence (git 09893d8^, chapter "Bold wasn't enough": "I
        // argued that shoppers had not built trust in Mall yet, and every extra
        // label diluted the one thing we were trying to say. Labels went in
        // anyway."), its middle clause left out because "nobody recognised"
        // says it. Moved up from the full study's seller-label call (its Why's
        // "Shoppers had not built trust in Mall yet" and its How's opening). It
        // plants the doubt as distrust, so "trusted" in What happened pays it
        // off. "No amount of blue, or boldness, could shortcut genuine user
        // belief" stays in the full study's research turn (Uttham, 2026-10-05:
        // "this one lets park for teaser")
        { kind: 'p', text: 'I argued that **shoppers had not built trust in Mall yet**; the labels went in anyway.' },
      ],
    },
    {
      heading: 'Before v3: what shoppers told us',
      blocks: [
        // the first sentence of his full-study research How, moved up, in place
        // of his live "Research before the v3 launch, in homes and on
        // devices.". His deck backs it: "The v2 reads and the usability tests
        // agreed, so we stopped shipping and went to homes" (git 09893d8^)
        { kind: 'p', text: 'We went to homes instead of shipping another tweak.' },
        {
          kind: 'steps',
          steps: [
            // his finding (Uttham, 2026-10-05: "few people were able to
            // recognise mall without nudges, but they thought mall means
            // products coming from nearby mall"); the label follows it (it was
            // "The name already worked")
            { state: 'v2-home', label: 'Mall meant a nearby mall', text: '**Few people were able to recognise Mall without nudges**, but they thought Mall meant products coming from a nearby mall.' },
            { state: 'v2-usps', label: 'Nobody wanted a programme', text: 'USPs and programme language were ignored. **People cared about the product in front of them.**' },
            // why v2's badge failed, in his words (Uttham, 2026-10-05: "in v2
            // people were not able to read mall text as well because of tick
            // spoiling legibility and poor contrast"), beside the letter "l"
            // that confused people ("this is also true"). Trust and notice are v3's ("I wanted to say it
            // worked on v3"): the badge row below and the full study's purple tick
            { state: 'v2-pill', label: 'The badge was unreadable', text: 'In v2, people were not able to read the Mall text: **the tick spoiled its legibility**, the contrast was poor, and the letter “l” confused people.' },
          ],
        },
        // his public quote, moved below the rows, where his 10-01 layout had
        // it: the hinge into "sell brands, not Mall". Two insights, one card
        // each (Uttham, 2026-10-05: "when you have multiple insights create
        // multple cards"), split at "but" with the product cards' ellipses. One
        // participant, so one source line; no Hindi original (2026-10-05: "lets
        // ignore both the hindhi original contents")
        { kind: 'quotes', id: 'Q1', source: 'Research participant, before v3.', items: [
          { id: 'Q1a', insight: 'Hard to find', text: '“I did not find brands…”' },
          { id: 'Q1b', insight: 'Meesho’s suggestion counts', text: '“…but if Meesho suggests I would consider purchasing it.”' },
        ] },
      ],
    },
    {
      heading: 'v3: sell brands, not Mall',
      blocks: [
        // no opener: his live "Two objectives: …" is left out (the full
        // study's v3 Why keeps the objectives, and two of the group headings
        // below carry them)
        {
          kind: 'steps',
          heading: 'Decide what Mall is',
          steps: [
            {
              state: 'v3-labels',
              label: 'Seller labels out',
              text: 'I argued the business out of local seller labels: **real brands only, or the badge means nothing.** Popular brand names became the explanation.',
              // no "Why this design:": the row carries its own reason ("real
              // brands only, or the badge means nothing"), as the product
              // cards' Seller titles row does
            },
            {
              state: 'v3-pill',
              // his words (Uttham, 2026-10-05); the colour and the tick's
              // reasons are the full study's purple tick
              // "purple" added with his OK (2026-10-05: "you can"), so the
              // Lucknow card's "Purple colour means Mall" pays off a colour the
              // text names
              label: 'A purple badge people can trust and notice',
              text: 'It is placed **in proximity to the brand name** with the title, which has also gone bolder. With Mall coming only with popular D2C brands, **it creates a strong anchor.**',
            },
          ],
        },
        {
          kind: 'steps',
          // renamed (Uttham, 2026-10-03: "rename the be found terminology across
          // to something like making it noticeable"); a verb phrase, like its
          // siblings "Decide what Mall is" and "Be understood where decisions happen"
          heading: 'Make it noticeable',
          steps: [
            // his label (Uttham, 2026-10-05: "make mall more easy to access
            // and onboard"); it was "Bottom-nav entry and onboarding"
            { state: 'v3-nav', label: 'Make Mall easier to access and onboard', text: 'Mall gets a tab. An onboarding modal explains it with **brands people already know** and celebrity faces for trust and attention.' },
            { state: 'v3-splash', label: 'Splash on first visits', text: 'For the first few entries into a Mall product or landing page: **the feeling of walking into a mall to buy company products.**' },
            // his live row "Listing-page hint" is left out for length: a fallback, and it replayed the onboarding modal of the row
            // above. The full study's v3 How keeps "a hint on listings for
            // anyone who missed it"; its screen map entry stays below
          ],
        },
        {
          kind: 'steps',
          heading: 'Be understood where decisions happen',
          steps: [
            // his live row, its last sentence ("Brand content and brand
            // performance below the details.") left out; the full study's v3
            // How keeps "the brand's own content"
            { state: 'v3-pdp', label: 'Product page', text: 'A purple enclosure so **a Mall product page looks different from the rest.** A brand entry point at the top for curiosity.' },
            // his live row; the drafted reason ("Brands as the hook, not
            // USPs.", from the homepage tile's draft note) is gone: the heading
            // carries the beat
            { state: 'v3-landing-new', label: 'Landing page for new shoppers', text: '**Popular brand logos**, popular products as hooks, brand names that rotate weekly; top categories to catch intent; product-level discovery kept.' },
          ],
        },
        {
          kind: 'steps',
          // his group (Uttham, 2026-10-05: "it is not part of this, can you
          // create a new section that says, differentiated experience and add
          // this here"): the order confirmation's delight comes after the
          // decision, not where it happens. His other changes in it come later,
          // in the full case study
          heading: 'Differentiated experience',
          steps: [
            // his reason (Uttham, 2026-10-05: "Order confirmation page changes
            // are done to bring relatability and delight that they are getting
            // order from mall"), in place of "so the colour and the programme
            // stick"; "shoppers" for his "they"
            { state: 'v3-ocp', label: 'Order confirmation', text: 'A purple animation at the moment of purchase, to bring relatability and **the delight that shoppers are getting their order from Mall.**' },
          ],
        },
      ],
    },
    {
      state: 'v3-brands',
      heading: 'What happened',
      blocks: [
        // the desire first, from his full-study v3 What worked (deck slide 25,
        // plans/019), in place of his live "Shoppers recognise Mall by colour
        // before they read a word.", which repeated the dek. His live opener
        // "Seller labels are gone from Mall; every product with the badge is a
        // brand." is left out: the full study's seller-label What worked says
        // it. It calls back to the Mall tab's celebrity faces
        { kind: 'p', text: 'Anchored by celebrities and icons, Mall became recognisable, a go-to place and, **finally, trusted.**' },
        // the proof: his public quote in the deck's own words, grammar only
        // (plans/019 slide 28; git 09893d8^ studies.ts, "households of
        // Lucknow"); it pays off the research finding that Mall read as a
        // nearby mall. Three insights in one household's words, one card each
        // (Uttham, 2026-10-05: "like the house holde review of lucknow has 3
        // insights"), split at its first sentence and at its last comma. No
        // Hindi original (2026-10-05)
        { kind: 'quotes', id: 'Q2', source: 'Household interview, Lucknow.', items: [
          { id: 'Q2a', insight: 'Recognised', text: '“Purple colour means Mall.”' },
          { id: 'Q2b', insight: 'Understood', text: '“These products come directly from Mall and are company products.”' },
          { id: 'Q2c', insight: 'Trusted', text: '“We can buy them without worrying about quality.”' },
        ] },
        // the lesson: the last sentence of his full-study v3 What worked,
        // moved up, without its "from it" (after the quote, "it" would read as
        // the quote)
        { kind: 'p', text: 'The lesson I took: **the answer was brand-led storytelling, not more UI tweaks.**' },
        // his live line, now last, so it leads straight into the password card
        { kind: 'p', text: 'Mall’s share of the business is confidential for a listed company; **I walk through it in interviews.**' },
        { kind: 'gate' },
        {
          kind: 'inside',
          lead: 'In the full case study:',
          items: [
            'The v2 mixed-feed bet, and why it lost',
            'The research turn: its rounds, places and methods',
            // his live item, back as he wrote it: the gated block still runs
            // v2 Why → v3 How → What worked
            'The seller-label call, from v2 to v3',
            // his "every v3 surface" overpromised: the full study has one
            // Why, How and What worked for all of v3, its surfaces in one list
            'The purple tick and the v3 system: why, how, what worked',
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
  // direction and status only. A sentence the open teaser carries is left out
  // here (move, don't copy): the quiet tag from v2, the homes from the research
  // turn, his trust argument from the seller-label call, the desire and the
  // lesson from v3.
  experiments: [
    {
      state: 'v2-mixed-feed',
      title: 'v2: the mixed-feed bet',
      status: 'Shipped, then flat',
      // its middle is the teaser's now
      why: 'The first launch had found the go-to-market, but awareness and discoverability were low, and **people did not realise they were ordering from Mall.**',
      how: 'v2 made an aggressive bet on **mixed feeds**: a pill and a colour on Mall cards inside normal search and category results, so shoppers met Mall where they already scrolled and could compare it with marketplace products. Around it, **more journey points and louder comms**: a home widget and banner, a Mall landing page, category landing pages, identifiers on listing and product pages, brand storefronts, and the USPs “Original Brands” and “Direct From Company” on home and the product page.',
      worked: 'Orders and views jumped at launch, **Mall’s share of the business climbed**, and the launch won a quarterly award. Then the line went flat. **People scan images, not pills.** The pill was read last, if at all, and **a cheaper look-alike beside a Mall card became the hook.** Marketplace listings carry promises inside their photos, so **brand cards looked quiet next to them**; duplicates of the very brands we highlighted blurred the signal.',
    },
    {
      state: 'research-concepts',
      title: 'The research turn',
      status: 'Through v2 and v3',
      why: 'The v2 reads and the usability tests agreed: **comprehension was poor even among shoppers who had visited Mall many times**, so the constructs we had shipped were not doing the job. Another shade of blue would not fix that.',
      // its first sentence is the teaser's now
      how: 'We ran about **four rounds a year for a year and a half**: diary studies with repeat shoppers, a week each; in-home interviews in Lucknow and Gaya, in Hindi; concept preference tests with 50+ shoppers a round; and usability tests on every v2 and v3 build.',
      // his finding (Uttham, 2026-10-05) in place of "“Mall” already meant
      // company products"; the turn back from the teaser ("this one lets park
      // for teaser"); ", and a tick in purple read as trust" is left out, since
      // the purple tick's How says it; why the v2 badge was hard to read is
      // the purple tick's Why, said once in the full study
      worked: '**Few people were able to recognise Mall without nudges**, but they thought Mall meant products coming from a nearby mall. **USPs did not matter: people cared only about the product they wanted.** The v2 badge was hard to read. No amount of blue, or boldness, could shortcut ^^genuine user belief.^^',
    },
    {
      state: 'v2-labels',
      title: 'The seller-label call',
      status: 'Removed in v3',
      // its "Shoppers had not built trust in Mall yet" is the teaser's now
      why: 'In v2, the business **wanted seller labels on Mall products for margin**: small local labels, not the brands shoppers knew. Every label that was not a brand **diluted the one thing the badge had to say.**',
      // its first sentence ("I argued against them in v2, and the labels went
      // in anyway.") is the teaser's now, so "the argument" points back to it
      how: '**The research gave the argument its evidence**: the labels were diluting what shoppers understood Mall to be. For v3, **my advocacy and research shifted us to real brands only**, with popular brand names as the explanation of Mall.',
      worked: '**Seller labels came off entirely**, so every product with the badge is a brand, and **national brands started onboarding.**',
    },
    {
      state: 'v3-pill',
      title: 'The purple tick',
      status: 'Shipped in v3',
      why: 'In v2, the Mall pill on a listing card competed with **every other tag and programme in the app**, and shoppers could not read its Mall text: the tick spoiled its legibility, the contrast was poor, and the letter “l” confused people.',
      how: 'Two goals for the rebrand: **find the colour that wins attention on a listing card** among every other colour and programme, and make the colour and mark stronger than the Mall branding itself, so a shopper knows Mall without reading it. **A tick, because a tick read as trust**; a legible wordmark; purple, because it stood out from every other colour in the app.',
      // his placement and anchor sentences (2026-10-05) are the teaser's badge
      // row, so they are not repeated here
      worked: 'Purple came to mean Mall: **shoppers recognise it by colour before they read a word.**',
    },
    {
      state: 'v3-nav',
      title: 'v3: purple became the promise',
      status: 'Shipped in v3',
      why: 'v2 had explained Mall, and shoppers ignored the explaining. v3 set two objectives: **make shoppers aware Mall exists**, through brands they already know, and **make them understand it where they decide**, so they remember it next time.',
      how: 'v3 rebuilt Mall around **recognition, not explanation.** **One colour and one mark, carried through every step:** a bottom-nav entry with an education modal of popular brands and celebrity faces; a splash for the first few visits; a hint on listings for anyone who missed it; a purple enclosure on the product page, with the brand’s own content; a landing page that leads with brand logos; and a purple animation when the order is confirmed, to bring relatability and the delight that shoppers are getting their order from Mall.',
      // its middle and its last sentence are the teaser's now
      worked: '**People now recognise Mall by colour**, and Mall hit the share the business had asked for at kick-off.',
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
    // (That row is left out of the teaser; its entry stays so the row can
    // come back as it was.)
    map: {
      'v2-usps': 'v2-home',
      'v2-pill': 'v2-home',
      'v3-labels': 'v3-pill',
      'v3-nav': ['v3-nav', 'v3-nav-pip'],
      'v3-ftux': 'v3-nav',
      // "What happened" plays the landing, then the order confirmation (Uttham,
      // 2026-10-03: "use mall landing page + order confirmation page")
      'v3-brands': ['v3-landing-new', 'v3-ocp'],
    },
    // Screens that move: his Figma animations, exported as MP4 (2026-10-03).
    // Keyed by file; the file's own still in this folder is the poster.
    // The landing page's composed clip came off with its row (2026-10-03: "just
    // one landing page") and was deleted (2026-10-04: "if it is not used delete
    // it"); git history keeps it and its script.
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
      'v3-ocp': 'v3: the purple order-confirmation moment',
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
      'v3-ocp': 'v3: order confirmed in purple',
      'v2-mixed-feed': 'v2: the mixed feed',
      'research-concepts': 'Concepts shoppers tested',
      'v2-labels': 'v2: seller labels in Mall',
    },
  },
};
