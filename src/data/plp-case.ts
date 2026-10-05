// The product-cards case study, built from Uttham's teaser layout (2026-10-01,
// "PLP card case study — teaser layout.html") and its brief
// (plp-case-study-context.md). The words are his; only the **bold** highlights
// are ours (CLAUDE.md). Every element with a `state` drives the sticky phone:
// its screen is src/assets/plp/<state>.(png|jpg|webp), dropped in by Uttham.
//
// CONFIDENTIALITY: direction and status only — no lifts, rates or internal
// counts. The one figure on the page, 250 million, is Meesho's own public
// number (Q3 FY26 Shareholders' Letter, 251M annual transacting users); it is
// not linked (2026-10-02). Items the brief marks "open" are left out
// rather than shown as placeholders.
//
// 2026-10-02 (Uttham): a catchier title; Role "strategy and design lead for pod
// of 5", Timeline "6months", no Research row; his Context; the Problem's second
// paragraph as a mission statement; "what shoppers look at - we can omit this
// section" (it took the consent-open fabric quote with it); Strategy rewritten
// from his notes, with cash out of the teaser ("ignore the cash price thing
// here"); a title on the card for each screen; the rail limited to the top,
// Problem, Strategy and Outcome.

import type { CaseTeaserData } from './case-teaser';

export const plpCase: CaseTeaserData = {
  // before: "Helping shoppers understand products better at first glance"
  title: 'From a glance to a decision',
  // Unlinked (Uttham, 2026-10-02: "the 250mn users in first project has a link
  // please remove that"). The figure is Meesho's own public number (Q3 FY26
  // Shareholders' Letter, 251 million annual transacting users). The sentence
  // is under 15 words, so no bold.
  dek: 'Rethinking Meesho’s product card for 250 million people who browse by picture.',
  // his highlight and his year (Uttham, 2026-10-05: "can we highlight
  // strategy and design lead"; "in bracket add (2026)"). The page's SEO reads
  // the Role through plain(), and a Timeline that is not a span of years gives
  // its JSON-LD no dates
  facts: [
    { label: 'Role', value: '**Strategy and design lead** for a pod of five' },
    { label: 'Timeline', value: 'Six months (2026)' },
  ],
  panelLabel: 'Card preview',
  // the rail names the full headings; its tooltips still cut at the colon, so
  // they read Problem / Strategy / Outcome. Context stays off it (2026-10-02).
  rail: { top: true, sections: ['Problem: too full and too empty', 'Strategy: make room, then spend it', 'Outcome: enough to say yes'] },

  // THE STORYLINE (approved 2026-10-05, after a preview: "Now make these
  // changes and update the git and website"): two jobs (Context) → too full
  // and too empty (Problem) → make room, then spend it (Strategy) → the turn,
  // facts cost height (the staggered feed's reason) → enough to say yes
  // (Outcome). Each Strategy row is his line, then at most one
  // reason, labelled "Why this design:". Nothing claims the new card shipped:
  // the Outcome keeps only his own "Results are confidential…" sentence.

  sections: [
    {
      state: 'before',
      // "image-first" is his word in the paragraph below; his records scope
      // "rejection" to search (L-002), browsing to image-first (L-001)
      heading: 'Context: image-first',
      blocks: [
        // his live paragraph. "All 250 million of them" lost its figure (the
        // page's fourth 250 million read as name-dropping; the dek and the
        // mission keep it)
        { kind: 'p', text: 'Most of our shoppers live in **tier 3 and tier 4 towns**, and some are new to e-commerce and shop only on Meesho. All of them just open Meesho whenever they have time and start browsing. They scan by picture only, and they operate in a mode of rejection. They are image-first: **they stop when the image is nice**, and everything else comes later.' },
        // the two jobs the page pays off: the first in Strategy, the second in
        // the Outcome's heading. Two highlights, the rule's most
        // the two jobs, as Uttham edited them (2026-10-05: "now without
        // opening, say need to open more products should reduce")
        { kind: 'p', text: 'So the card has two jobs: **keep the pictures coming while they scan**, and **give them enough to say yes**, so they need to open fewer products.' },
      ],
    },
    {
      // no screen of its own: the old feed from Context stays on the phone
      // (Uttham, 2026-10-03: "we can ignore the annotated version")
      heading: 'Problem: too full and too empty',
      blocks: [
        // "too full", his live paragraph; the section's one ^^ beat is the cost
        { kind: 'p', text: 'Over time, **more than ten teams** had added their own features to the card. Each addition made it taller, so ^^shoppers saw fewer products on every screen^^, and the pictures they rely on got harder to compare.' },
        // the pain voice, straight after the "too full" line it backs: his
        // shopper's quote (2026-10-05); the translation is ours. Two insights in his shopper's one sentence, one card each (Uttham,
        // 2026-10-05: "when you have multiple insights create multple cards …
        // similarly do for product cards"); split at "isliye"; labels and
        // translations are ours
        { kind: 'quotes', id: 'V2', source: 'Shopper', items: [
          { id: 'V2a', consent: true, insight: 'Too much on the card', text: '“Bahut saare chezein aata hai…”', translation: 'So much comes up…' },
          { id: 'V2b', consent: true, insight: 'So the picture decides', text: '“…isliye mai bas image dek kar aage bad jaati hun.”', translation: '…so I just look at the image and move on.' },
        ] },
        {
          kind: 'steps',
          // "too empty": the turn from the height above to what was missing
          lead: 'Yet for all that height, the card left out what shoppers needed.',
          steps: [
            // his labels (Uttham, 2026-10-05: "Instead of facts, lets say there
            // was no enough non visual cues"; "Picture was the only source they
            // relied"); the first row's text is moved up from the full study
            { state: 'before', label: 'There weren’t enough non-visual cues', text: 'The facts that decide a purchase (fabric for a kurti, pack size for a snack) were not on the card, so **people opened products just to check.**' },
            { state: 'before', label: 'The picture was the only source they relied on', text: 'Shoppers judge from pictures and the card showed one; **they needed to go inside to get more image data.**' },
          ],
        },
        { kind: 'p', text: 'Our pod’s mission: **help 250 million shoppers find the right product faster**, whatever the category and whatever brings them to browse.' },
      ],
    },
    {
      // "make room, then spend it": the shape of his two blocks (remove, then
      // add) and the trade between them, claiming no rule (the zone/cap rule
      // is open, plan 026)
      heading: 'Strategy: make room, then spend it',
      blocks: [
        // his live line, its tail ("one experiment at a time, each measured on
        // its own") left out: the changes were bundled, not measured one by one
        { kind: 'p', text: 'We worked on the card **in two directions**.' },
        // Reworked from his notes (Uttham, 2026-10-03): the framework, then the
        // seller titles ("say they are not adding value and we replaced them"),
        // then "the other 2 things in remove what … bring the last two things
        // here", under block 2 in their original order.
        {
          kind: 'steps',
          heading: '1. Remove what slows them down',
          steps: [
            {
              state: 'cleanup',
              label: 'Card framework',
              // his live row, its last sentence ("The detailed study is inside
              // the full case study.") left out until the full study holds the
              // framework detail. The prices-and-tags list is his note
              text: 'We started by understanding every case the card has to carry, then **built a framework from them**: the right information architecture for browsing cards, and one that scales. Inside it we optimised and grouped the information: multiple prices and offers, and consideration tags.',
              // his full-study Why, its second half ("…with no shared rule for
              // what earned a place"), as its own sentence: why a framework
              why: 'There was no shared rule for what earned a place.',
            },
            {
              state: 'titles',
              label: 'Seller titles',
              // his live row; its reason is in it. The signpost after "We
              // replaced them" is left out: the next row says it
              text: 'Seller titles **weren’t adding value**: most of them had shop names in them. We replaced them.',
            },
          ],
        },
        {
          kind: 'steps',
          heading: '2. Add what helps them decide',
          steps: [
            {
              state: 'titles',
              label: 'Facts in place of the title',
              // his live sentence, "the seller titles" for his "them" (a block
              // heading now stands between) and the chips named, since the
              // staggered feed's reason talks about them
              text: 'We replaced the seller titles with **the important facts shoppers need before making a decision**, shown as chips.',
              // his Why (2026-10-05)
              why: 'To help users understand **non-visual cues like material**, and remove ambiguity about how many units. **That helped them pick the right products in the first place.**',
            },
            {
              state: 'stagger',
              label: 'Staggered feed',
              text: 'Cards at their natural height, so more fit on a screen.',
              // his whole full-study Why, moved up: the cost the chips raised
              why: 'The grid padded every row to its tallest card. Once chips and tags varied by product, that padding was whitespace, and by the third row **the shopper had lost a product she could have seen.**',
            },
            {
              state: 'list',
              label: 'List or grid by category',
              // his live line carries its own reason (details decide), so his
              // full-study Why stays in the full study
              text: 'Rows where details decide, grid where looks decide.',
            },
            {
              state: 'scroll',
              label: 'Swipeable images',
              text: 'We added more swipeable images because **shoppers form better conviction from them** before opening the product. They show more of the product and the variations it comes in.',
              // his Why (2026-10-05)
              why: 'To help users form a **better understanding of the product and its variations**, and help them pick relevant products.',
            },
            {
              state: 'date',
              label: 'Delivery date',
              // his live row
              text: 'A clear day count instead of a promise, added **only on products where delivery is fast**, not on all of them.',
              // his meaning (Uttham, 2026-10-05: "we wanted to solve for people
              // who wanted products faster"); what shoppers assumed stays in the
              // full study's Why
              why: 'We wanted to solve for **people who wanted their products faster.**',
            },
          ],
        },
        // Not placed: his cash-on-delivery verbatim (git 444d9e3^). It is
        // evidence for the cash-price row, which the teaser leaves out
        // (2026-10-02: "ignore the cash price thing here").
      ],
    },
    {
      state: 'after',
      // a call back to Context's "give them enough to say yes", claiming no result
      heading: 'Outcome: enough to say yes',
      blocks: [
        // the Problem's own words answered; "the new card", never "now on the
        // card", which would claim it shipped. The section's one ^^ beat
        { kind: 'p', text: 'The picture still comes first, and ^^the facts that decide a purchase are on the new card.^^' },
        // the claim, then the shopper saying it, as Mall's "What happened". The
        // source is his own line from the 09-20 draft (git 444d9e3^); the method
        // line under it is still his to give. consent: false keeps it off the
        // live page until he confirms the participant's consent
        { kind: 'quote', id: 'V1', consent: false, text: '“Fabric pahle andar jaake dekhti thi, ab idhar se hi pata lag raha hai.”', translation: 'I used to open the product to check the fabric. Now I can tell from here.', source: 'Shopper, usability session.' },
        // his live Outcome's second sentence, alone: its first, "The new card
        // is live for 250 million shoppers", is not backed by his records
        // (REC-001 TBD; REC-002 holds the scale-up), so it is left out
        { kind: 'p', text: 'Results are confidential for a listed company; I walk through them in interviews.' },
        { kind: 'gate' },
        {
          kind: 'inside',
          lead: 'In the full case study:',
          // only what the full study holds: his two items promised every
          // change's why, how and what worked, and screens for each
          items: [
            'How we built the changes, and what worked where we know',
            // what died was the rationing, not the swipe ("An early version that
            // rationed scrolling to selected products was killed on day one")
            'How swipeable images evolved: what worked and what didn’t', // his line (2026-10-05)
            // "Three runs, each bundled with other changes"; "No clean read
            // because of bundling"
            'The three runs of facts in place of the title (minimum viable truths)', // his correction (2026-10-05: "3 runs for MVTs facts on title variant")
          ],
        },
      ],
    },
  ],
  gate: {
    text: 'The full case study expands here. Live, it sits behind a password that comes with my application.',
    cta: 'Read the full case study',
  },

  // The full case study (brief §4): one block per experiment, Why / How / What
  // worked, direction and status only. Not yet placed: the brief's tag-colour
  // call (inline green tested best; yellow shipped because the card was already
  // green) — which block it belongs in waits on Uttham (open item 5).
  // A sentence the open teaser carries is left out here (move, don't copy); a
  // part left empty prints nothing, and a block with no part left prints
  // nothing.
  experiments: [
    {
      state: 'cleanup',
      // renamed with the teaser (Uttham, 2026-10-02: "rephrase this with card framework")
      title: 'Card framework',
      // his live Why's first sentence is on the teaser (the ten teams in his
      // Problem, the rule as the framework row's reason) and its How is the
      // teaser's own row; its second sentence, the cost, stays here. The block
      // still owes his framework detail (the audit, the named zones and their
      // caps, how the ten teams agreed to them)
      why: 'Each line pushed another product off the screen for a shopper who was only looking at pictures.',
      how: '',
    },
    {
      state: 'titles',
      title: 'Clearer titles (minimum viable truths)',
      status: 'Live; next version in test',
      // his third sentence is the teaser's first Problem row now
      why: 'Seller-written titles were long, repetitive and stuffed with search words, and **most of them carried shop names**, which added no value. Shoppers glanced and read nothing.',
      how: 'We defined a minimum viable truth per category: **the smallest set of facts that lets a shopper decide without opening the product.** We replaced the title with those facts as chips, **over three runs of the facts-on-title variant.** A second version tightened the chips, added consideration tags (price drop / quality marks; some scaled, and the others are going through restructuring and further validation), and **forced three rounds of catalogue cleanup so the chips were true.**',
      worked: 'Chips were noticed late but **valued once seen**; shoppers stopped opening products to check fabric. **Pack size was the most useful fact in ambiguous categories.** A chip the picture contradicts is not believed, so **catalogue quality had to come first.** Showing the prepaid price up front confused cash shoppers — this fed the cash-price work.',
      // his pack-size verbatim, the evidence for "Pack size was the most
      // useful fact" (REC-001). The translation is ours; consent: false keeps
      // it off a live page until he confirms consent
      quote: { id: 'V3', consent: false, text: '“Yaha pe nya pack ka information aa rha hai, ki kitna saman milega, ye badiya hai.”', translation: 'The new pack information here tells me how much I’ll get. That’s great.', source: 'Shopper, usability test.' },
    },
    {
      state: 'stagger',
      title: 'Staggered feed (For You)',
      status: 'Inconclusive',
      // his Why is the teaser row's reason now
      why: '',
      how: 'We let each card take its natural height in the For You feed so columns stagger.', // the three runs were the MVTs' (his correction, 2026-10-05)
      // "read" is the team's word for a result: plain words for readers outside
      worked: '**Shoppers never noticed misaligned text under the images** (which confirms that shoppers are picture-first). No clean result yet; it stays open. Rule kept: **never force staggering** — it is what variable content does when the grid stops hiding it.',
    },
    {
      state: 'list',
      title: 'List or grid by category',
      // "reading" in plain words
      status: 'Live; results pending',
      why: 'A grid suits products judged on looks. Headphones and other considered categories are **judged on facts a grid card cannot carry.**',
      how: 'Full-width list rows for considered categories. **The platform picks list or grid by category; no user toggle.**',
      worked: 'Live; results pending. The direction supports **rows where details decide, grid where looks decide.**',
    },
    {
      state: 'scroll',
      title: 'Swipeable images',
      status: 'Shipped',
      // his Why became the teaser's second Problem row (his "image data" line)
      why: '',
      how: 'Up to three images swipe inside the card, showing **more of the product and the variations it comes in**, with one autoplay to teach the gesture. An early version that rationed scrolling to selected products was **killed on day one — breadth was the point.**',
      worked: 'Taps into the product fell while orders per tap rose: one finding, not two. **The decision moved onto the listing.**',
    },
    {
      state: 'cash',
      title: 'Cash price',
      status: 'Live',
      why: 'Most shoppers pay cash on delivery and the card showed the prepaid price. A higher number at the door cost the category, not one order — **shoppers stopped buying that kind of product.**',
      how: 'Cash price in its own row under the prepaid price; one rule for the card: **anything price-related lives in that row.**',
      // his What worked is a result his cash-price record (REC-002) has as
      // "TBD — experiment is currently running" (plan 026), so it is left out
      worked: 'The test is still running.',
    },
    {
      state: 'date',
      title: 'Delivery date',
      status: 'Scaled',
      // his reason first, as on the teaser row (2026-10-05: "we wanted to
      // solve for people who wanted products faster"), then what shoppers
      // assumed and what the old line told them
      why: 'We wanted to solve for **people who wanted their products faster.** Shoppers assumed four to five days in cities and a week or more outside them. **“Free Delivery” on every card told them nothing.**',
      how: 'A day count at the foot of the card, **shown only on products where delivery is fast**, not on all of them. Three tests, including one with a “FAST” mark in front of the number.',
      worked: '**The date did the work; the word in front of it carried nothing.** The third test scaled.',
    },
  ],

  // Uttham's exports in src/assets/plp/, each named after its state.
  screens: {
    dir: 'plp',
    // the staggered feed is the new feed (2026-10-03: "stagger, you can reuse the
    // overall new one"). cleanup, titles, list and date are phone screens
    // composed from his reference boards by scripts/plp-compose.mjs (Uttham,
    // 2026-10-03: "I want you to show the final version only … when I gave 4
    // product cards I want you to place thme in a mbile grid and explain not use
    // as it is, similarly for framework the framework card should comeinside the
    // image, and the wordings outside"); the boards themselves stay in
    // src/assets/plp/boards/ as the script's source and are never shown raw.
    // Where his boards and his Kurti capture repeat one yellow kurti, the
    // composed titles grid and the swipe clip's feed take other kurtis from
    // the realistic prototype's catalogue (Uttham, 2026-10-04: "the images are
    // repititive … take it from prototype porject"; scripts/plp-photos.mjs).
    // The cash-price row has no screen of its own yet (his "new card with the
    // cash-price row lit" is still to come), so it shows the old feed, whose
    // cards carry the cash price in its own row under the prepaid (UPI) price
    // (2026-10-04 audit: it had borrowed the swipe clip). Bigger images for
    // fashion came out of the study (2026-10-04: "remove this").
    map: { stagger: 'after', cleanup: 'framework', scroll: 'swipe', cash: 'before' },
    // Swipeable images as a composed clip (Uttham, 2026-10-03: "please mock by
    // moving images … for other 1 or 2 products atleast"): scripts/plp-swipe-clip.mjs
    videos: { swipe: '/media/plp/swipe.mp4' },
    alts: {
      before: 'The old product card',
      cleanup: 'The card framework: one product card, large on the feed, its zones running from the picture down through its fact chips, price and timer, rating and Trusted mark, to the Fast delivery line',
      titles: 'A feed of four cards: a yellow kurti under the seller’s title, a teal kurti with one fact chip in its place, a grey kurti with two, and a Mall shampoo whose Ad and Mall tags share the row with its facts',
      stagger: 'A product feed with staggered columns: each card at its natural height',
      list: 'Earphones as list rows: each row a picture beside its fact chips, price, cash price and rating',
      scroll: 'A feed whose cards carry swipeable images, with the dots under each picture',
      swipe: 'A feed of different kurtis whose cards carry swipeable images: the first swipes to a kurti in another colour, two more to their own back views, and back, the dots under each picture following',
      date: 'The new feed with a kurti that shows Fast and its day count at its foot, among cards with no delivery line',
      after: 'The new product card',
      // for his cash.png when it comes (drop `cash: 'before'` from the map then)
      cash: 'The new card with the cash-price row lit',
    },
    // the title on the card, above the phone (Uttham, 2026-10-02: "add title of
    // what images are shown on the prototype, this title should be on card and
    // above the preview")
    titles: {
      before: 'The old card',
      cleanup: 'The card framework',
      titles: 'Facts in place of the title',
      stagger: 'A staggered feed',
      list: 'List view by category',
      scroll: 'More views and variations',
      date: 'Dates on fast deliveries',
      after: 'The new card',
      cash: 'The cash-price row',
    },
    // Handwritten notes beside the phone: each line STARTS ON the thing it
    // names, inside the screen (Uttham, 2026-10-03: "the pointers should have
    // the origins from inside so it is easy to understand what point we are
    // highlighting"), at (x, y) as shares of that screen's width and height
    // (scripts/plp-compose.mjs prints the framework's), and runs out to its
    // words, which stand at `ty` in the notes column — spread out, so the
    // spacing stays generous ("I want the spacing to be generous here"). The
    // framework's words are the labels on his board ("Fast Program" in the
    // site's spelling); the rest are DRAFT wording for Uttham. No numbers.
    // EVERY DOT ON ITS ELEMENT (Uttham, 2026-10-03: "In card framework the
    // arrows and the dots are not matching please fix them"): each (x, y) is
    // read off the export's own pixels — on the element's left part, or for a
    // line of text in the card's margin touching its first letter — and
    // checked in the browser against the rendered screen.
    notes: {
      framework: [
        { text: 'Product comprehension', x: 0.25, y: 0.36, ty: 0.36 }, // on the picture: the green kurti (x 0.21–0.47)
        { text: 'Comprehension', x: 0.115, y: 0.619, ty: 0.56 }, // on the first fact chip's left end, clear of its text (chip x 0.11–0.43, y 0.60–0.64)
        { text: 'Price', x: 0.09, y: 0.674, ty: 0.68 }, // touching the price's ₹ (₹350 from x 0.11)
        { text: 'Quality', x: 0.118, y: 0.777, ty: 0.8 }, // on the rating pill's left end, clear of the 5 (pill x 0.11–0.26, y 0.75–0.80)
        { text: 'Fast programme', x: 0.094, y: 0.831, ty: 0.92 }, // touching the delivery line's FAST mark (from x 0.11)
      ],
      titles: [
        { text: 'The seller’s title', x: 0.014, y: 0.411 }, // DRAFT: touching "Anarkali Kurti", first row (its text from x 0.03)
        { text: 'Facts in its place', x: 0.014, y: 0.76 }, // DRAFT: touching the Kurti chip, second row (from x 0.03)
      ],
      list: [
        { text: 'A row per product', x: 0.05, y: 0.231 }, // DRAFT: on the first row's picture
        { text: 'Facts beside the picture', x: 0.39, y: 0.578 }, // DRAFT: touching the third row's Noice Cancellation chip (from x 0.40)
      ],
      // DRAFT notes on the old card ("too full" was only told, never shown):
      // three of the lines the teams had stacked under the picture, each named
      // by what it is, not by the team that owns it (open in his brief). Read
      // off before.png's pixels: the shirt's title from x 0.025 (y 0.3667),
      // its cash row from x 0.024 (y 0.4264), its Trusted mark from x 0.357
      // (y 0.4553); the words spread down the column at `ty`
      before: [
        { text: 'The seller’s title', x: 0.012, y: 0.367, ty: 0.3 }, // DRAFT: touching "KMX striped shirt"
        { text: 'A second price, for cash', x: 0.012, y: 0.426, ty: 0.43 }, // DRAFT: touching "₹260 with CASH"
        { text: 'A trust mark', x: 0.364, y: 0.455, ty: 0.56 }, // DRAFT: on the Trusted mark's left end
      ],
      date: [
        // his draft, as it was live. It is true to the screen, which shows FAST
        // before the day count
        { text: 'Fast, with a day count', x: 0.02, y: 0.782 }, // DRAFT: touching the kurti's delivery line at its FAST mark (from x 0.035)
        { text: 'None where it isn’t fast', x: 0.016, y: 0.407 }, // DRAFT: touching the shirt's rating, its last row, with no delivery line
      ],
    },
  },
};
