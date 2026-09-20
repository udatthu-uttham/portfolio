// AI Space — the tools, not the case studies. These are evidence for the third
// leadership principle ("raise the org's speed limit"): things built so a team
// can do in a day what used to take a sprint.
//
// CONFIDENTIALITY (locked 2026-09-20): every preview renders SYNTHETIC data.
// No real record contents, no Figma file key, no colleagues' records, no
// participant audio or verbatims, no Meesho figures. The previews show the
// mechanism; the contents are always invented.
//
// One tool is "on the bench" at a time (plans/022): the list on the left picks
// it, the frame on the right runs it, three answers sit under the frame, and a
// white-label guide (src/data/guides.ts) lets another team replicate it.
export type Tool = {
  slug: string;
  kicker: string; // the pill: what kind of thing this is
  name: string;
  year: string;
  claim: string; // the one line in the bench list. Highlights in **bold**.
  what: string; // What is this. Highlights in **bold**.
  helps: string; // How it helps at Meesho. Highlights in **bold**.
  replicate: string; // How to replicate it, in one breath; the guide has the rest. Highlights in **bold**.
  chrome: string; // the address bar inside the frame
  status: string; // the small note beside the address bar
  used?: { label: string; href: string }; // where it shows up in the case studies
  featured?: boolean; // on the bench when the page loads
};

export const tools: Tool[] = [
  {
    slug: 'context-layer',
    kicker: 'Method',
    name: 'Context Layer',
    year: '2026—',
    claim: 'Design decisions kept **durable, arguable and cumulative.**',
    what: 'A repository of design experiments: **one markdown record per line of work**, written by an agent that interrogates you until the record is worth reading a year later. A Claude Project loads the records for debate; Figma renders them as cards.',
    helps: 'Dozens of experiments run each cycle and the readouts used to die in weekly review decks. Now a designer can ask **“what have we learned about card height?”** and get an answer with sources, and the next cycle is planned against the records, not memory.',
    replicate: 'A folder of markdown with fixed headings, a skill that asks the hard questions before it writes, and a debate skill inside a Claude Project. **No infrastructure**: a git repo, a Claude Project, one Figma file.',
    chrome: 'context-layer / records / fitment-badge.md',
    status: 'Synthetic record',
    used: { label: 'A line of card height', href: '/work/a-line-of-card-height' },
    featured: true,
  },
  {
    slug: 'resona',
    kicker: 'Internal tool',
    name: 'Resona',
    year: '2026',
    claim: 'Session recordings in, **a research report you can argue with** out.',
    what: 'A research assistant for the design research pod: **session audio in, a coded research report out**, with insights scored by evidence and verbatims pinned to the second they were said.',
    helps: 'Interviews arrive as Hindi and Hinglish audio. Synthesis that took the pod days now lands the same afternoon, and the report **flags its own overclaims** before anyone quotes them in a review.',
    replicate: 'Transcription with speaker separation, the discussion guide as the coding frame, and a model pass that must cite a timestamp for every insight. **Make it ask when the evidence is thin.** That one rule is the product.',
    chrome: 'resona / research / fitment-check',
    status: 'Invented study',
  },
];
