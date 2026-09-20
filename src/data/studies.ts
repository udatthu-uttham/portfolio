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
title: 'A line of card height',
summary: 'Three experiments on the product card, **one argument about a line of height.**',
focus: 'Attribute chips and a second price row **spend** card height; staggering **reclaims** it. **Running them separately was the mistake** — the real question is **the exchange rate between them.**',
scope: ['Product card systems', 'Experiment design', 'PLP at scale'],
    cover: { image: 'stagger-cover', caption: 'Left: every card padded to its row. Right: height follows content, and an extra card enters by the third row.' },
    chapters: [
      {
        eyebrow: '1 · The card',
        heading: 'Every card pays for its height.',
        body: [
          'A product card on Meesho has carried the same things on every surface for years: an image, a seller-written title, a price, a rating. Change one line and **the whole feed moves**, because a line of height is **how many products fit in the viewport**. Earlier cuts to card information had already shown the trade: fewer things on the card, more products seen, and **exploit shoppers losing the detail they needed**.',
          'Three lines of work ran through 2026 on that card. Minimum viable truths spent a line. The cash-price row spent another. Staggering tried to earn one back. ^^They were one argument about a single scarce resource,^^ and this is the story of arguing it.',
        ],
        figure: { image: 'mvt-variants', label: 'Control card and the three MVT variants', caption: 'Control keeps the seller title. The variants swap that one line for chips; nothing else on the card moves.' },
        working: {
          label: 'What the earlier cuts taught',
          items: ['Explore sessions rewarded lighter cards; exploit sessions punished them.', 'Mall, Gold, m-trusted, deals and the Ads tag are non-negotiable on every card.', 'A rating without its count makes a new catalog look like a scaled one.', 'A staggered layout produced more views wherever it ran.'],
        },
      },
      {
        eyebrow: '2 · Minimum viable truths',
        heading: 'Replace the title with what the shopper needs.',
        body: [
          'Seller titles are **adjectives, not facts**. “Anarkali Kurti” tells a shopper nothing she cannot already see. A minimum viable truth is the **smallest set of attribute facts, per category, that helps her decide**: fabric for a kurti, pack size for shampoo. The variants put those facts in chips where the title used to be, one line or two.',
          'Two rules fell out of running it. On a feed where every card is a kurti, the category chip repeats the same word down the page, so **it is dropped**. And a card with no truths to show was left spending a whole line on an Ad tag, so **the Ad tag moves onto the image**. A chip earns its line only when it **discriminates between cards**.',
        ],
        figure: { embed: '/proto/feed-ux/index.html', label: 'The prototype shoppers tested', caption: 'The prototype we took into sessions, running on real catalog data. Browse it.' },
        verbatim: { text: 'fabric pahle andhar jaake dekti thi ab idhar se hi pta lg rha hai', source: 'shopper, usability session' },
        working: {
          label: 'Fourteen sessions',
          items: ['In-person usability tests, fourteen shoppers in three cohorts: cash-on-delivery heavy, prepaid or mixed, and attribute-heavy category browsers.', 'Prototype first, then the participant’s own Meesho app on the same category. The gap between the two is the finding.', 'Moderated in Hindi. We never said we were testing tags.', 'Pack size and fabric were the truths shoppers valued most. “Less returned” read as “cannot be returned”.'],
        },
      },
      {
        eyebrow: '3 · The price row',
        heading: 'The first read went the wrong way for cash shoppers.',
        body: [
          'The first MVT experiment came back **negative for shoppers who pay cash on delivery**. The card showed only the prepaid price. A cash shopper formed her expectation on the listing, **met a higher number at payment**, and read it as a price hike. One of them had stopped buying a whole category over it.',
          'So the price block grew a **second row for the cash price**. It fixes the surprise for the shopper who reads the card, and does nothing for the one who has **learned to check price only at checkout**. It also makes the card taller, spending exactly the line staggering was trying to reclaim. One belief died along the way: **pricing does not have to be green**. The warm price-drop variant won across almost every cut.',
        ],
        figure: { image: 'price-rows', label: 'Two price rows across the MVT variants', caption: 'Prepaid price with its UPI tag on the first row, “with CASH” beneath. Control already carries both.' },
        verbatim: { text: 'First it was showing the same like this… it shows extra prices like 30. That’s the reason I stopped buying kids creams.', source: 'shopper, cash-on-delivery cohort' },
        working: {
          label: 'What the second row admits',
          items: ['It is a fix for a cohort, not an improvement to the card. The unit of the decision is the segment, not the page.', 'Proposed since: take the second row off for prepaid-only shoppers and buy the height back.', 'Scaling the new card to prepaid-activated shoppers is held on the return-unbundling call, not on the data.'],
        },
      },
      {
        eyebrow: '4 · Staggering',
        heading: 'Stop paying whitespace to hide variable content.',
        body: [
          'A rigid grid forces every card in a row to the height of its tallest neighbour and pads the rest with **whitespace**. Staggering lets each card be as tall as its content, so the two columns drift and **an extra card enters the viewport by the third row**. It is not a feature. It is what happens when you **stop suppressing variation** that chips, ratings and delivery badges already create.',
          'Shoppers **did not notice**. Their scan is image-first, so misaligned text beneath the images never entered their attention. The scanning objection was **a designer’s worry, not a user’s**. The one real cost is a horizontal widget arriving mid-column, and it still has no design answer.',
        ],
        figure: { image: 'stagger', label: 'Control grid against content-driven heights', caption: 'Left, every card padded to the row. Right, height follows content.' },
        working: {
          label: 'Three runs, none clean',
          items: ['V1 moved staggering together with the MVT card changes, so nothing could be attributed to either.', 'V2 relaunched with cleaner truths and crossed staggering against how many lines of chips a card carries.', 'The learnings file holds a six-arm read this record does not: staggering helps most when the card carries least, and reverses at two lines. Until someone who sat in the review says which is right, it stays a structure, not a result.'],
        },
      },
      {
        eyebrow: '5 · The exchange rate',
        heading: 'Three records, one currency.',
        body: [
          'None of the three concluded cleanly. The MVT runs **cannot be attributed to a single run**. The price row is **still live**. Staggering is **inconclusive**. Read separately they look like three unfinished features. Read together they are **one exchange rate**: how much conversion a line of height buys for a cash shopper, and how many views it costs everyone else.',
          'That is the question I am carrying into the next cycle, and the reason these are one case study. ^^The mistake was running them as neighbours instead of as one trade.^^',
        ],
        quote: { text: 'Both cannot be optimised independently. The next question is not which is right but what the exchange rate between them is.', mark: 'what the exchange rate between them is' },
        working: {
          label: 'Open, on purpose',
          items: ['What stopped the three staggering runs concluding? A fourth risks failing the same way.', 'Do cash shoppers form their price expectation on the listing or at checkout? The size of the habitual group decides whether the second row is the right fix at all.', 'Should the homogeneous-feed rule generalise to every attribute, not just the category chip?'],
        },
      },
      {
        eyebrow: '6 · How I led it',
        heading: 'The record is the product.',
        body: [
          'I argued early against letting **predicted intent** drive the card. Prediction is probabilistic and a wrong guess hurts a large set of shoppers, so the card carries the **union of what explore and exploit shoppers both need**, and adds stronger nudges only where intent is near-certain. That principle held through every variant.',
          'I ran the research from the front: fourteen in-person sessions, moderated in Hindi, on a **prototype fed with real catalog data** so shoppers reacted to real prices and real photos. And I built the Context Layer so the work outlives the cycle: **one record per line of work, outcomes as direction only, every open question written down** before anyone declares a result.',
        ],
        notes: [
          { text: 'Prototype first, then their own app on the same category. The gap between the two is the finding.', source: 'method', tilt: '-3deg' },
          { text: 'Direction only. No figure leaves the review room.', source: 'metrics policy', tilt: '2deg' },
        ],
      },
    ],
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
    chapters: [
      {
        eyebrow: '1 · Genesis',
        heading: 'What is Meesho Mall?',
        body: [
          'Meesho Mall is the place **where we sell branded products** that are ^^competitive price alternatives and are in better quality^^ than the unbranded products.',
          'It was **October 2021, we started to test** the waters by dipping our feet.',
        ],
        figure: { image: 'v1-tags-card', label: 'Mall v1 — “Mall” tags with product cards', caption: 'Mall v1', callout: 'helping users identify mall products' },
      },
      {
        eyebrow: '1 · Genesis',
        heading: 'Business objective',
        body: [
          'Let ^^our users be aware of branded products, this helps them get better quality^^ and we as a business make more money.',
          'From **day one, ambiguity was my world.** The first challenge was not just design — but instilling emotional desire and trust in the Mall promise.',
        ],
        figure: { image: 'v1-plp-tag', tone: 'lavender', label: 'Mall v1 — the tag on a product card', caption: 'Mall v1 – Added mall tags for identification' },
      },
      {
        eyebrow: 'Bold wasn’t enough',
        heading: 'Meet them in the feed. A flat line.',
        body: [
          'v2 made an aggressive bet on **mixed feeds**: a pill and a colour on Mall cards inside normal search and category results, USPs on home, brand content on product pages. **Meet shoppers where they already scroll,** and let them compare. Orders jumped and Mall’s share of NMV climbed. Then **the line went flat.** ^^People scan images, not pills.^^',
          'Business, meanwhile, **wanted seller labels on Mall products for margin.** I argued that **shoppers had not built trust in Mall yet,** and every extra label diluted the one thing we were trying to say. Labels went in anyway.',
        ],
        figure: { label: 'v2 — home, mixed listing, product page', caption: 'Mall v2: a pill, a colour and USPs, everywhere in the journey.', screens: ['v2-home', 'v2-mixed-plp', 'v2-plp-badge', 'v2-pdp'] },
        working: {
          label: 'Why the mixed feed lost',
          items: ['Shoppers scan images first; a pill on the card is read last, if at all.', 'A cheaper look-alike beside the Mall card becomes the hook.', 'Marketplace listings **carry promises inside their photos**; brand cards **look quiet next to them.**', 'Duplicates of the very brands we highlighted blurred the signal.'],
        },
      },
      {
        eyebrow: 'The turn',
        heading: 'Research, not another shade of blue.',
        body: 'The v2 reads and the usability tests agreed, so **we stopped shipping and went to homes.** About four rounds a year for a year and a half: diary studies and interviews in Lucknow and Gaya, concept tests with 50+ shoppers each. **“Mall” already meant company products to people.** USPs did not matter. The old mark was hard to read. ^^A tick in purple read as trust.^^',
        quote: { text: 'No amount of blue, or boldness, could shortcut genuine user belief.', mark: 'genuine user belief' },
        working: {
          label: 'What the rounds were',
          items: ['Diary studies with repeat shoppers, one week each.', 'In-home interviews in Lucknow and Gaya, in Hindi.', 'Concept preference tests, 50+ shoppers per round.', 'Usability tests on every v2 and v3 build.'],
        },
      },
      {
        eyebrow: 'Colour as trust',
        heading: 'Purple became the promise.',
        body: 'v3 rebuilt Mall around ^^recognition, not explanation.^^ **One colour and one mark, carried through every step:** a bottom-nav entry, a splash the first few times you enter, a nudge on listings for anyone who missed it, a purple enclosure on the product page with the brand’s own content, and a landing page that leads with logos for newcomers and search for regulars.',
        figure: { label: 'v3 — splash, landing, listing, product page', caption: 'Mall v3: the colour does the explaining.', screens: ['v3-splash', 'v3-landing', 'v3-plp-ftux', 'v3-pdp'] },
        working: {
          label: 'The six surfaces',
          items: ['Bottom-nav entry with an education modal.', 'Splash for the first few visits.', 'First-time nudge on listings.', 'Purple enclosure on the product page, brand content inside.', 'Landing page: logos for newcomers, search for regulars.', 'Confirmation animation on add-to-cart.'],
        },
      },
      {
        eyebrow: 'What it did',
        heading: 'Recognised by colour. Finally, trusted.',
        body: [
          '**Seller labels came off entirely.** Mall **hit the NMV share the business had asked for** at kickoff, and **national brands started onboarding.**',
          'The mixed-feed bet is **the part I would not call solved.** v3 carried it too, and the read did not change: **in a mixed feed the brand still loses to the image.** The 2024 research put numbers on it — most shoppers still could not define Mall, and **the purple mark had become the thing they scan for.** The fix in flight is a brand-forward card. The groundwork came out of this program; **the team shipping it now is not mine.**',
        ],
        numbers: [
          { value: 'All', label: 'seller labels removed' },
          { value: 'Met', label: 'the NMV share asked for at kickoff' },
          { value: 'National', label: 'brands began onboarding' },
        ],
        verbatim: {
          text: 'Purple color means mall, these products directly come from mall and are company products, we can buy them without worrying about quality.',
          source: 'households of Lucknow',
        },
        working: {
          label: 'What v4 picks up',
          items: ['Mall-only search when the query is a brand or a branded category.', 'Brand-forward product cards: the name does the work the pill could not.', 'Small packs so a first branded purchase is cheap to try.', 'Clear, guaranteed returns on Mall items.'],
        },
      },
      {
        eyebrow: 'How I led it',
        heading: 'The team had to learn the user before the pixels.',
        body: 'Mall was **a hard first brief for junior designers**: an unfamiliar shopper, a business with margin to protect, and a product that changed under them. **I led the research from the front, in homes and not just decks,** opened the roadmap so the team could argue with it, and taught each designer to **hold user, business and product in one hand.** ^^The pivot from labels to brands was the team’s call as much as mine.^^',
        notes: [
          { text: 'Listings and the badge system. Ran every readability test herself.', source: 'Priya, first product brief', tilt: '-3deg' },
          { text: 'Landing page and splash. Sat in on every Lucknow interview.', source: 'Arjun, second year at Meesho', tilt: '2deg' },
          { text: 'Research plan, roadmap, and the argument with business over labels.', source: 'me', tilt: '-1deg' },
        ],
      },
    ],
  },
];

export const contact = {
  email: 'ultimateuttham@gmail.com',
  linkedin: 'https://www.linkedin.com/in/udatthu-uttham/',
  linkedinHandle: 'udatthu-uttham',
  phone: '+91 73819 52468',
  whatsapp: 'https://wa.me/917381952468',
};
