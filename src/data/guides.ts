// White-label guides for the AI Space tools. Each one is written so a designer
// on another team can paste the prompt into Claude Code or a Claude Project and
// be running the same afternoon. Nothing in here names Meesho data, people,
// files or figures — that is the point of white-label.
//
// Rendered on /ai/<slug>, a one-pager (src/data/ai-pages.ts arranges it). The
// lines carry their highlights in **bold** (CLAUDE.md); the prompt never does —
// it is copied as plain text, word for word.
export type Guide = {
  slug: string; // matches Tool.slug
  title: string;
  intro: string; // one paragraph, highlights in **bold**
  get: string[]; // what you get
  need: string[]; // what you need
  prompt: string; // the prompt itself, copied verbatim
};

export const guides: Guide[] = [
  {
    slug: 'resona',
    title: 'Build your own research allrounder',
    intro: 'It is a pipeline, not a chat: **a study set up, sessions recorded, a coded report out**. The discussion guide is the coding frame, every insight must cite a timestamp, the model is told to **doubt itself out loud** when a claim outruns the evidence, and every finished study **stays searchable for the next one.**',
    get: [
      'A setup step that **pins the objective, cohort, method and discussion guide** before a single recording is loaded.',
      'Transcripts with speakers separated and **each utterance tagged to a section of your discussion guide**.',
      'Observations clustered into themes, **insights scored by how many participants support them**, verbatims pinned to timestamps.',
      'A key finding, how-might-we prompts per theme, and **an “AI asks” list of claims that need your clarification**.',
      'A report that exports cleanly and re-runs when a recording is added.',
      'A store of finished studies anyone can search, so **the next study starts from what is already known**.',
    ],
    need: [
      '**Transcription with speaker diarization for your languages** (a Whisper-class model handles Hindi and Hinglish acceptably).',
      '**A long-context model for the synthesis pass**, and a place to run it: a script, a Claude Project, or a small web app.',
      'Your discussion guide, with sections and objectives written out.',
      'Consent from participants for recording and machine transcription.',
    ],
    prompt: `You are a research synthesist. Inputs: (a) a study brief \u2014 objective, cohort, method, date, researchers, (b) a discussion guide with numbered sections and objectives, (c) transcripts with speaker labels and timestamps, one per session.

Before anything else: if the brief is missing the objective, the cohort or the method, ask for them and stop. A study without a stated objective cannot be coded against one.

Work in this order and show your work:

1. Observations. For every substantive utterance by a participant, write one observation tagged with the guide section it answers, the session and speaker (S2_P1), and the timestamp. Quote the participant verbatim in their own language.

2. Clusters. Group observations into themes that follow the guide’s objectives. Name each theme as a question the guide asked.

3. Insights. For each theme, write insights as claims. Every insight carries: how many participants support it out of how many, an insight score (HIGH when most participants said it unprompted, MEDIUM when some, LOW when one), at least one verbatim with its timestamp, and a one-line design implication.

4. Doubt. If an insight claims more participants than the transcripts show, or generalises from one strong quote, do not publish it. Put it under “AI asks” with the exact gap and a question for the researcher.

5. Key finding. One paragraph a product leader can act on, in plain words.

6. How might we. Two prompts per theme, phrased as design questions, never as solutions.

Output as structured sections in this order: Key finding · Quality (observations, clusters, insights, HMWs counted) · Themes with insights · AI asks · How might we.`,
  },
  {
    slug: 'realistic-prototype',
    title: 'Build a prototype people forget is a prototype',
    intro: 'Not a click-through. A **small web app with the real product\u2019s shape** \u2014 a catalogue that reads like the catalogue, a cart that adds up, a payment step that fails when you make it fail. Participants stop performing for you, because **there is nothing to perform for.**',
    get: [
      '**A running app on a URL** you can send to a moderator, a participant, or a stakeholder.',
      '**Every page a participant could wander into** \u2014 feed, category, product, cart, payment, order placed, past orders \u2014 not only the ones on the happy path.',
      'A mock catalogue with prices, ratings, review counts and delivery promises that **read like the real thing**.',
      'Checkout and payment that **run end to end on dummy instruments**, so complex flows become testable.',
      'A place to drop a new feature or a new content row in and **watch people meet it cold**.',
    ],
    need: [
      '**A front-end you can stand up quickly** \u2014 Vite and React is plenty \u2014 and any static host.',
      'A catalogue fixture: a few hundred items with images, prices and ratings. **Invent them; do not export production data.**',
      '**The product\u2019s real type scale, spacing and components**, taken from the design system rather than eyeballed.',
      'A phone to test on. Everything about this falls apart on a desktop window.',
    ],
    prompt: `Build me a realistic, clickable prototype of a mobile shopping app as a small Vite + React web app. Treat it as a research rig, not a demo.

Rules, in order of importance:

1. It must not feel like a prototype. Every screen a participant can reach must exist. No dead links, no "coming soon", no jump back to the home screen because I did not build that page. If a tap has nowhere to go, build the somewhere.

2. Use routes, not screens-as-slides: / (feed), /category/:slug, /product/:id, /cart, /product/:id/payment, /order/success, /orders, /orders/:id. Back must work. Refresh must work. Deep links must work.

3. Mock the catalogue, do not export it. Generate a few hundred items with plausible names, prices, discounts, ratings, review counts, delivery promises and badges. Vary them the way a real catalogue varies — a few outliers, a few with no reviews. Never use real customer, seller or business data.

4. Checkout must complete. Add to cart, change quantity, pick an address, pick a payment instrument, place the order, land on an order-placed screen, find the order in past orders. Give me a switch to make payment fail, so I can test the recovery path too.

5. Match the real product's type scale, spacing, radii and components. A prototype that is nearly right in layout but wrong in type reads as fake within seconds.

6. Make it phone-first: 375px viewport, thumb-reachable controls, real scroll momentum, no hover-only affordances.

7. Put the things I want to test behind a flag, so I can turn a new row, badge or landing surface on for one session and off for the next.

Ask me what I am trying to learn before you start, then tell me which screens that makes load-bearing.`,
  },
];
