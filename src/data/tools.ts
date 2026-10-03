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
// "View more", which opens the tool's page as "Read the case study" opens a case (2026-10-02:
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
  value?: string; // the "Value added" fact on the tool's page, in Uttham's words; it replaces Kind (2026-10-02)
  idea?: string; // the page's opening section, "The idea", in Uttham's words. Highlights in **bold**, one ^^beat^^.
  made?: {
    // the page's "How I made it", after "How it helps". Highlights in **bold**.
    lead?: string; // one line under the section heading
    // one sub-group each, with its own tick on the rail: a heading, an
    // optional lead line, then ruled rows of prose or labelled steps
    groups: { heading: string; lead?: string; rows?: string[]; steps?: { label: string; text: string }[] }[];
  };
  next?: { lead: string; rows: string[] }; // the page's "Next steps", after How I made it. Highlights in **bold**.
  helps: string[]; // how it helps, one point each, shown on /ai/<slug>. Highlights in **bold**.
  action: string; // the card's action, which reads like a case tile's "Read the case study"
  used?: { label: string; href: string }; // where it shows up in the case studies
  visit?: { label: string; href: string }; // the running build the preview loads; never linked from the page (Uttham, 2026-10-03: "dont give link of real prototye")
  callout?: string; // a few words over the tool page's phone, when the reader can use the tool right there
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
    // Uttham, 2026-10-02, grammar and bold only: "all the teams who go on ground
    // use this tool for research planning in meesho. multiple designers and
    // product folks have appreciated about this tool"
    value: 'All the teams who go on the ground **use this tool for research planning at Meesho.** Multiple designers and product folks have appreciated this tool.',
    // HOW I MADE IT (Uttham, 2026-10-02: "it is not a skill … break it into 4
    // parts research planning … research execution … research synthesis … and
    // research library"). The planning, execution and library leads are his,
    // grammar and bold only; the rows explain each part. Mechanism only — no
    // tool, model or file names — because this repo is public; n8n is named
    // because he names it.
    made: {
      lead: 'Four parts, one for each stage of a study — the last one keeps it for the next.',
      groups: [
        {
          heading: 'Research planning',
          lead: 'Planning starts by **generating and decoding the research objectives.** I have added **Meesho context, from hero flows to who our users are,** and past popular research studies, and **trained it internally on research methodologies:** how to conduct research for the Meesho audience.',
          rows: [
            '**It knows the four types of research** — foundational, generative, tactical and evaluative — maps a goal to one and names the method in a line, such as a usability test with tasks. With no screens to show, it won’t script a usability test, and **a new idea, an iteration or something being scaled each point to a different type.**',
            '**No question is written** until the goal and the decision it feeds, the cohorts and, for a test of something built, the screens are confirmed. Then it picks **one of two formats:** a 30–40 minute session with up to six objectives, or a 10–15 minute call on the participant’s own phone with two at most.',
            'It proposes cohorts on what separates our shoppers — order history, feature use, digital comfort, gender, age and city tier — and **includes cash-on-delivery buyers and recent returners,** five to seven people a cohort.',
            '**Apt Meesho examples teach it which method a goal needs** — asking whether a new product page works points to a tactical test — **and how a question should sound,** with before-and-after rewrites for moments like paying, discounts, delivery and cash on delivery.',
            'Past popular studies taught it **what a guide must get right:** consent comes first, one question at a time, no asking shoppers to redesign the app, trust asked as what they checked before ordering, and **recruitment that says plainly what the session is about.**',
            'Questions are **tailored for Meesho shoppers.** Many are new to online shopping, browse more than they search and often share a phone on patchy data, so questions start from their last order, tasks are browse-first, and **prompts stay neutral, because people try to please someone from Meesho.**',
            '**Every question is in the participant’s language** — Hindi by default, a regional language for regional cohorts, in whichever script the moderator reads faster — in everyday words instead of app jargon, one idea per sentence.',
            'Every objective is **a task on the participant’s own phone first,** then probes that run from broad to narrow. Each question carries **up to four things for the moderator to watch,** and worries about delivery, returns or whether a product matches its photos are watched for, never asked.',
            '**The interview techniques are built in, unlabelled:** asking why until a real reason surfaces, laddering from a feature to what it means to them, “show me on your phone”, and “the last time this happened”, asked only after checking it did.',
            '**Before a guide is shown, every question passes a bias check** — leading, two in one, assuming, fishing for agreement, giving away what is tested, hypothetical, or a word a first-time shopper wouldn’t know — and anything that fails is rewritten.',
          ],
        },
        {
          heading: 'Research execution',
          // the description only (Uttham, 2026-10-02: "just the description in
          // portfolio, no need to add clear details about this")
          rows: ['It **actively listens to the conversations** and maps them to the research goals set in planning, **to help the research moderator.**'],
        },
        {
          heading: 'Research synthesis',
          lead: 'The synthesis is **a pipeline of separate model calls, each building on the ones before it** — never one big prompt. The discussion guide steers all of it.',
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
        {
          heading: 'Research library',
          // the description only (Uttham, 2026-10-02: "just the description in
          // portfolio, no need to add clear details about this")
          rows: ['All the research reports are **vectorised and embedded using n8n,** to store them and retrieve them effectively.'],
        },
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
    // THE IDEA is how the spark came (Uttham, 2026-10-02: "this is about how we
    // got the spark, we wanted to test discovery features like fast or adding
    // better title attributes, but it was hard for us to mimic in a figma
    // prototype covering all the cases and still keeping them interactive, so
    // we made this that give real app experience with relevant realistic data
    // (compress this long sentence to impactful wording)"), then his earlier
    // emphasis, kept with its one beat ("linkage to meesho services that
    // fetches realtime production data for actual users, all the values are
    // connected to backend table and proper logics are set in place").
    idea: 'We wanted to test discovery features like Fast delivery and better title attributes, but in Figma it was **hard to cover every case and keep it interactive.** So we built the real app experience instead: ^^a prototype linked to Meesho services that fetch real-time production data for actual users.^^ All the values are connected to backend tables, and **proper logic is set in place to make it realistic.**',
    // Uttham, 2026-10-02, grammar only: "all the design teams who work with
    // testing discovery or payment related flows have stareted using this to
    // get deeper insighrts"
    value: 'All the design teams who work on testing discovery or payment-related flows **have started using this to get deeper insights.**',
    // Uttham, 2026-10-02: "make it sound like the one we made is pilot and
    // everyone liked this, now leveraging tech team to create advance version
    // of this: built a sharable git repo and integrated few more meesho
    // services that can be scaled to entire design team, added a feature
    // config page to toggle different experiences with realtime ranked feed
    // for the particular user"
    next: {
      lead: 'The prototype running here is **the pilot, and everyone liked it.** Now, with the tech team’s support, we are **building the advanced version.**',
      rows: [
        'A shareable Git repo, with a few more Meesho services integrated, that **can be scaled to the entire design team.**',
        'A feature config page to **toggle different experiences,** with **a real-time ranked feed for each user.**',
      ],
    },
    helps: [
      '**Strong engagement from users,** as this web app has user data and Meesho design that emulate real app movements — giving great insights.',
      '**Complex flows like checkout and payments become testable** — users can emulate checkout, run journeys and track their orders.',
      '**Understand how people react to new features and content** — for example, Best of Jaipur product cards in the feed.',
    ],
    action: 'View more',
    visit: { label: 'Open the prototype', href: '/proto/feed-ux/index.html' },
    // over the phone on its page, which is the prototype itself (Uttham,
    // 2026-10-03: "let the prototype be interactable there only, and give
    // callout on top that it is interactable"). A short label, not his copy:
    // the wording is his to set.
    callout: 'Try it — tap and scroll',
  },
];
