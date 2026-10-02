// AI Space — the tools, not the case studies. These are evidence for the third
// leadership principle ("Boosting design workflows for improving efficiency."): tools that
// automate repetitive tasks and boost a team's workflow with AI.
//
// CONFIDENTIALITY (locked 2026-09-20): every preview renders SYNTHETIC data.
// No real record contents, no Figma file key, no colleagues' records, no
// participant audio or verbatims, no Meesho figures. The previews show the
// mechanism; the contents are always invented.
//
// LAYOUT (Uttham, 2026-09-21; 2026-10-01; 2026-10-02): two cards, built out of
// the Projects tile — tape, title, lead line, the phone in its glass well, and
// "View more", which opens the teaser as "Read the case" opens a case (2026-10-02:
// "the ai cards should not have copy the plan as CTA, view more should be the
// CTA for it"; the prompt is copied on the teaser page). `helps` is NOT on the card: it moved to the tool's teaser page,
// /ai/<slug>, which the whole card opens, along with the long version of "how
// to build it". The phone on the card is a running preview with no link of its
// own; on the teaser page the same tool runs in the sticky phone
// (src/data/ai-teasers.ts arranges the page).
//
// THE COPY IS UTTHAM'S (2026-09-21): `what` and `helps` are his own words, and
// only grammar and the bold rule have been touched. Do NOT shorten them to fit
// a layout — condensing them changed what they meant. If the card needs to be
// shorter, take it out of the layout, not out of the sentence.
export type Tool = {
  slug: string;
  kicker: string; // the pill: what kind of thing this is
  name: string;
  year: string;
  what: string; // the card's lead line. Highlights in **bold**.
  idea?: string; // the teaser's opening section, "The idea", in Uttham's words. Highlights in **bold**, one ^^beat^^.
  helps: string[]; // how it helps, one point each, shown on /ai/<slug>. Highlights in **bold**.
  action: string; // the card's action, which reads like a case tile's "Read the case"
  used?: { label: string; href: string }; // where it shows up in the case studies
  visit?: { label: string; href: string }; // a live thing you can open yourself: the teaser's "Open the prototype ↗", and the preview's src
};

export const tools: Tool[] = [
  {
    slug: 'resona',
    kicker: 'Internal tool',
    name: 'Research allrounder',
    year: '2026',
    what: 'A central tool for **research preparation and insight capture** — and for reaching past research, so each study is run better than the last.',
    helps: [
      '**Non-designers can be confident,** as this tool suggests the right research methods and research questions.',
      '**They can learn, follow and improve,** as the tool actively listens to their research and upskills them.',
      '**Centralised research storage** that is accessible to everyone.',
    ],
    action: 'View more',
  },
  {
    slug: 'realistic-prototype',
    kicker: 'Research rig',
    name: 'Realistic prototype',
    year: '2026',
    what: 'A web app that **looks like Meesho, with realistic user data,** built for better research.',
    // Uttham, 2026-10-02, verbatim but for grammar: "emphasis the idea of this
    // prototype which has linkage to meesho services that fetches realtime
    // production data for actual users, all the values are connected to backend
    // table and proper logics are set in place to make this a realistic prototype"
    idea: 'This prototype is ^^linked to Meesho services that fetch real-time production data for actual users.^^ All the values are connected to backend tables, and **proper logic is set in place to make it a realistic prototype.**',
    helps: [
      '**Strong engagement from users,** as this web app has user data and Meesho design that emulate real app movements — giving great insights.',
      '**Complex flows like checkout and payments become testable** — users can emulate checkout, run journeys and track their orders.',
      '**Understand how people react to new features and content** — for example, Best of Jaipur product cards in the feed.',
    ],
    action: 'View more',
    visit: { label: 'Open the prototype', href: '/proto/feed-ux/index.html' },
  },
];
