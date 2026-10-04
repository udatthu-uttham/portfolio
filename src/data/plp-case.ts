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
  facts: [
    { label: 'Role', value: 'Strategy and design lead for a pod of five' },
    { label: 'Timeline', value: 'Six months' },
  ],
  panelLabel: 'Card preview',
  rail: { top: true, sections: ['Problem', 'Strategy', 'Outcome'] },

  sections: [
    {
      state: 'before',
      heading: 'Context',
      blocks: [
        { kind: 'p', text: 'Most of our shoppers live in **tier 3 and tier 4 towns**, and some are new to e-commerce and shop only on Meesho. All 250 million of them just open Meesho whenever they have time and start browsing. They scan by picture only, and they operate in **a mode of rejection**. They are image-first: **they stop when the image is nice**, and everything else comes later.' },
      ],
    },
    {
      // no screen of its own: the old feed from Context stays on the phone
      // (Uttham, 2026-10-03: "we can ignore the annotated version")
      heading: 'Problem',
      blocks: [
        { kind: 'p', text: 'Over time, **more than ten teams** had added their own features to the card. Each addition made it taller, so **shoppers saw fewer products on every screen**, and the pictures they rely on got harder to compare.' },
        { kind: 'p', text: 'The pod’s mission: ^^help 250 million shoppers find the right product faster^^, whatever the category and whatever brings them to browse.' },
      ],
    },
    {
      heading: 'Strategy',
      blocks: [
        { kind: 'p', text: 'We worked on the card **in two directions, one experiment at a time**, each measured on its own.' },
        // Reworked from his notes (Uttham, 2026-10-03). Framework: "we optimised
        // and grouped information related to multiple prices offers,
        // consideration tags, detailed study inside". Titles: "rename it as
        // seller titles and say they are not adding value and we replaced them,
        // what we replaced we will talk in value additions". And "the other 2
        // things in remove what" (the staggered feed, list or grid) "bring the
        // last two things here" — under block 2, in their original order, ahead
        // of the two that were already there.
        {
          kind: 'steps',
          heading: '1. Remove what slows them down',
          steps: [
            { state: 'cleanup', label: 'Card framework', text: 'We started by understanding every case the card has to carry, then built a framework from them: **the right information architecture for browsing cards, and one that scales.** Inside it we **optimised and grouped the information**: multiple prices and offers, and consideration tags. The detailed study is inside the full case study.' },
            { state: 'titles', label: 'Seller titles', text: 'Seller titles **weren’t adding value**: most of them had shop names in them. **We replaced them**; what took their place comes under “Add what helps them decide”, next.' },
          ],
        },
        {
          kind: 'steps',
          heading: '2. Add what helps them decide',
          steps: [
            // what replaced the seller titles, promised by the row above (his
            // own sentence from before the rename, 2026-10-02)
            { state: 'titles', label: 'Facts in place of the title', text: 'We replaced them with **the important facts shoppers need before making a decision.**' },
            { state: 'stagger', label: 'Staggered feed', text: 'Cards at their natural height, so more fit on a screen.' },
            { state: 'list', label: 'List or grid by category', text: 'Rows where details decide, grid where looks decide.' },
            { state: 'scroll', label: 'Swipeable images', text: 'We added more swipeable images because **shoppers form better conviction from them** before opening the product. They show more of the product and the variations it comes in.' },
            { state: 'date', label: 'Delivery date', text: 'A clear day count instead of a promise, added **only on products where delivery is fast**, not on all of them.' },
          ],
        },
      ],
    },
    {
      state: 'after',
      heading: 'Outcome',
      blocks: [
        { kind: 'p', text: '**The new card is live** for 250 million shoppers. Results are confidential for a listed company; I walk through them in interviews.' },
        { kind: 'gate' },
        {
          kind: 'inside',
          lead: 'In the full case study:',
          items: [
            'Each of the eight changes: why, how, what worked',
            'Before and after screens for every change',
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
  experiments: [
    {
      state: 'cleanup',
      // renamed with the teaser (Uttham, 2026-10-02: "rephrase this with card framework")
      title: 'Card framework',
      why: '**More than ten teams had placed features on one card** with no shared rule for what earned a place. Each line pushed another product off the screen for a shopper who was only looking at pictures.',
      how: 'We started by understanding every case the card has to carry, then built a framework from them: **the right information architecture for browsing cards, and one that scales.**',
    },
    {
      state: 'titles',
      title: 'Clearer titles (minimum viable truths)',
      status: 'Live; next version in test',
      why: 'Seller-written titles were long, repetitive and stuffed with search words, and **most of them carried shop names**, which added no value. Shoppers glanced and read nothing. The facts that decide a purchase (fabric for a kurti, pack size for a snack) were not on the card, so **people opened products just to check.**',
      how: 'Defined a minimum viable truth per category: **the smallest set of facts that lets a shopper decide without opening the product.** Replaced the title with those facts as chips. A second version tightened the chips, added consideration tags (price drop / quality marks; built, not launched — too few products qualified), and **forced three rounds of catalogue cleanup so the chips were true.**',
      worked: 'Chips were noticed late but **valued once seen**; shoppers stopped opening products to check fabric. **Pack size was the most useful fact in ambiguous categories.** A chip the picture contradicts is not believed, so **catalogue quality had to come first.** Showing the prepaid price up front confused cash shoppers — fed the cash-price work.',
    },
    {
      state: 'stagger',
      title: 'Staggered feed (For You)',
      status: 'Inconclusive after three runs',
      why: 'The grid padded every row to its tallest card. Once chips and tags varied by product, that padding was whitespace, and by the third row **the shopper had lost a product she could have seen.**',
      how: 'Let each card take its natural height in the For You feed so columns stagger. Three runs, each bundled with other changes.',
      worked: '**Shoppers never noticed misaligned text under the images** (confirms picture-first). No clean read because of bundling; result stays open. Rule kept: **never force staggering** — it is what variable content does when the grid stops hiding it.',
    },
    {
      state: 'list',
      title: 'List or grid by category',
      status: 'Live, reading',
      why: 'Grid suits products judged on looks. Headphones and other considered categories are **judged on facts a grid card cannot carry.**',
      how: 'Full-width list rows for considered categories. **The platform picks list or grid by category; no user toggle.**',
      worked: 'Live, read in progress. Direction supports **rows where details decide, grid where looks decide.**',
    },
    {
      state: 'scroll',
      title: 'Swipeable images',
      status: 'Shipped',
      why: 'Shoppers judge from pictures and the card showed one; **every second view cost a tap in and a tap back.**',
      how: 'Up to three images swipe inside the card, showing **more of the product and the variations it comes in**, one autoplay to teach the gesture. An early version that rationed scrolling to selected products was **killed on day one — breadth was the point.**',
      worked: 'Taps into the product fell while orders per tap rose: one finding, not two. **The decision moved onto the listing.**',
    },
    {
      state: 'bigimg',
      title: 'Bigger images for fashion',
      why: 'For a garment on a body **the look is the decision**, and the standard image was too small to judge it.',
      how: 'Taller 4:5 image on fashion cards, tested across the feed and then by category.',
      worked: 'Fashion converted on fewer, larger cards; **non-fashion paid for it in the same feed.** The rule it points at is **intent, not a blanket change.**',
    },
    {
      state: 'cash',
      title: 'Cash price',
      status: 'Live',
      why: 'Most shoppers pay cash on delivery and the card showed the prepaid price. A higher number at the door cost the category, not one order — **shoppers stopped buying that kind of product.**',
      how: 'Cash price in its own row under the prepaid price; one rule for the card: **anything price-related lives in that row.**',
      worked: '**Cash shoppers stopped being surprised at the door**; the cohort that had been hidden from the real price responded.',
    },
    {
      state: 'date',
      title: 'Delivery date',
      status: 'Scaled',
      why: 'Shoppers assumed four to five days in cities and a week or more outside them; **“Free Delivery” on every card told them nothing.**',
      how: 'A day count at the foot of the card, **shown only on products where delivery is fast**, not on all of them. Three tests, including one with a “FAST” mark in front of the number.',
      worked: '**The date did the work; the word in front of it carried nothing.** Third test scaled.',
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
    // fashion has none either and no export shows a taller 4:5 image, so it
    // still borrows the swipe clip, under that clip's own title, until he
    // supplies one.
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
      swipe: 'A feed of different kurtis whose cards carry swipeable images: the first swipes to a kurti in another colour, two more to their own back view, and back, the dots under each picture following',
      bigimg: 'A fashion card with a taller 4:5 image',
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
      bigimg: 'Bigger images for fashion',
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
      date: [
        { text: 'Fast, with a day count', x: 0.02, y: 0.782 }, // DRAFT: touching the kurti's FAST mark (from x 0.035)
        { text: 'None where it isn’t fast', x: 0.016, y: 0.407 }, // DRAFT: touching the shirt's rating, its last row, with no delivery line
      ],
    },
  },
};
