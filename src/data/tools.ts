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
// "View more", which opens the tool's page as "Read the case" opens a case (2026-10-02:
// "the ai cards should not have copy the plan as CTA, view more should be the
// CTA for it"; the prompt is copied on the tool's page). `helps` is NOT on the card: it moved to the tool's page,
// /ai/<slug>, which the whole card opens, along with the long version of "how
// to build it". The phone on the card is a running preview with no link of its
// own; on its page the same tool runs in the sticky phone
// (src/data/ai-pages.ts arranges the page).
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
  idea?: string; // the page's opening section, "The idea", in Uttham's words. Highlights in **bold**, one ^^beat^^.
  made?: {
    // the page's "How I made it", after "How it helps". Highlights in **bold**.
    lead: string; // how the tool was built, in Uttham's words
    pipeline: string; // one line over the steps
    heading: string; // the steps' sub-heading (it gets its own tick on the rail)
    steps: { label: string; text: string }[];
  };
  helps: string[]; // how it helps, one point each, shown on /ai/<slug>. Highlights in **bold**.
  action: string; // the card's action, which reads like a case tile's "Read the case"
  used?: { label: string; href: string }; // where it shows up in the case studies
  visit?: { label: string; href: string }; // a live thing you can open yourself: the page's "Open the prototype ↗", and the preview's src
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
    // HOW I MADE IT (Uttham, 2026-10-02). The lead is his, verbatim but for
    // grammar: "this is powered by /anthropic-skills:research-scripter for
    // generating and decoding the research objectives, we have added meesho
    // context from hero flows to about our users, past popular research
    // studies, trained internally on research methodologies, on how to conduct
    // research for meesho audience". He then settled it: the app triggers the
    // skill itself; the skill goes unnamed ("no need to give the names, just
    // this page is all about explaining my work"); "we" is him alone; his
    // phrases stay as written. The steps are the app's synthesis pipeline as he
    // had it read out of its code the same day — mechanism only: no file
    // names, model names, participant-ID format or known bugs, because this
    // repo is public.
    made: {
      lead: 'This is **powered by an AI skill I wrote** for generating and decoding the research objectives. I have added **Meesho context, from hero flows to who our users are,** and past popular research studies, and it is trained internally on research methodologies: **how to conduct research for the Meesho audience.**',
      pipeline: 'The synthesis is **a pipeline of separate model calls, each building on the ones before it** — never one big prompt. The discussion guide steers all of it.',
      heading: 'The synthesis, step by step',
      steps: [
        { label: 'Plan', text: 'The discussion guide becomes **a synthesis plan:** its themes, research questions and activities — a variant comparison, a card sort — are carried into every step after it.' },
        { label: 'Listen', text: 'Each recording comes back **transcribed and translated, speakers separated, with emotion and vocal cues** — calibrated for India, so a flat “haan haan” is not read as agreement.' },
        { label: 'Nuggets', text: 'The transcripts become atomic observations, **each with one exact quote,** the participant, their emotion and a topic.' },
        { label: 'Cluster', text: 'Observations are grouped under the guide’s themes; **without a guide, the model clusters them bottom-up.**' },
        { label: 'Synthesise', text: 'It works through **each research question, then the leftovers,** into insights, opportunities, pain points and any sections the plan asked for. A theme with no evidence is reported as uncovered, never invented, and a quote whose voice disagrees with its words becomes **a say–feel gap, the deepest kind of insight.**' },
        { label: 'How might we', text: 'How-might-we questions and ranked opportunity areas, **built only from findings more than one participant backs,** and a summary for stakeholders.' },
        { label: 'Verify', text: 'Every finding is **checked against the observations and the transcript.** Anything with a critical issue is flagged for review with a question for the researcher, who can answer it and have the audio heard again; **the finding is then updated.**' },
      ],
    },
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
