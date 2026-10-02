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
      state: 'before-annotated',
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
        {
          kind: 'steps',
          heading: '1. Remove what slows them down',
          steps: [
            { state: 'cleanup', label: 'Card framework', text: 'We started by understanding every case the card has to carry, then built a framework from them: **the right information architecture for browsing cards, and one that scales.**' },
            { state: 'titles', label: 'Clearer titles', text: 'Titles weren’t adding value: most of them had shop names in them. We replaced them with **the important facts shoppers need before making a decision.**' },
            { state: 'stagger', label: 'Staggered feed', text: 'Cards at their natural height, so more fit on a screen.' },
            { state: 'list', label: 'List or grid by category', text: 'Rows where details decide, grid where looks decide.' },
          ],
        },
        {
          kind: 'steps',
          heading: '2. Add what helps them decide',
          steps: [
            { state: 'scroll', label: 'Swipeable images', text: 'We added more swipeable images because **shoppers form better conviction from them** before opening the product. They show more of the product and the variations it comes in.' },
            { state: 'bigimg', label: 'Bigger images for fashion', text: 'Where the look is the decision.' },
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
    alts: {
      before: 'The old product card',
      'before-annotated': 'The old card, each element labelled with the team that added it',
      cleanup: 'The card framework: every case the card carries, in one structure',
      titles: 'The new card with fact chips where the title used to be',
      stagger: 'A product feed with staggered columns: each card at its natural height',
      list: 'List rows for a considered category',
      scroll: 'A card with swipeable images showing more of the product and its variations',
      bigimg: 'A fashion card with a taller 4:5 image',
      date: 'A fast-delivery product card with its delivery date',
      after: 'The new product card',
      cash: 'The new card with the cash-price row lit',
    },
    // the title on the card, above the phone (Uttham, 2026-10-02: "add title of
    // what images are shown on the prototype, this title should be on card and
    // above the preview")
    titles: {
      before: 'The old card',
      'before-annotated': 'Which team added what',
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
  },
};
