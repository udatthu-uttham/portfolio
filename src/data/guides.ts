// White-label guides for the AI Space tools. Each one is written so a designer
// on another team can paste the prompt into Claude Code or a Claude Project and
// be running the same afternoon. Nothing in here names Meesho data, people,
// files or figures — that is the point of white-label.
export type Guide = {
  slug: string; // matches Tool.slug
  title: string;
  intro: string; // one paragraph, highlights in **bold**
  get: string[]; // what you get
  need: string[]; // what you need
  prompt: string; // the prompt itself, copied verbatim
  adapt: string[]; // what to change for your team
};

export const guides: Guide[] = [
  {
    slug: 'context-layer',
    title: 'Run your own Context Layer',
    intro: 'A **record is a project**: one markdown file per line of work, with fixed headings, an ID, and outcomes written as direction only. An agent interviews you before it writes, so the record carries what the room argued and what stayed open, not just what shipped.',
    get: [
      'A `records/` folder, one file per line of work, plus a generated `index.md`.',
      'A `LEARNINGS.md` of platform-level truths promoted only when more than one record supports them.',
      'A `create-record` skill that interrogates you in two rounds, then writes the record and updates the index.',
      'A `debate` skill that reasons across records to plan the next cycle.',
    ],
    need: [
      'Claude Code on your machine and a git repository you control.',
      'A Claude Project with the records folder attached as knowledge, for the debate side.',
      'Fifteen minutes per record. The interrogation is the work; the writing is fast.',
      'Optional: a Figma file where each record renders as a card.',
    ],
    prompt: `You are the archivist for our team's design experiments. A record is one line of work; the experiments inside it are numbered locally (Experiment 1, 2, 3).

When I share a brief, links or a readout, do this:

1. Interrogate before you write. Two rounds. Round one: what was the belief, what changed on screen, what was the metric, who owned it, which surfaces, when. Round two: what did the room argue, what did users say (verbatims with source labels), what would we argue differently now, what is still open. Do not accept a vague answer twice.

2. Write records/<slug>.md with this front matter: id (REC-NNN, claim the next free id), name, slug, surface, status, owner, cycle, experiments, metric, outcome, hypothesis, dates, tags, sources, created, updated.

3. Use exactly these headings, in this order: Scope · What changed · Experiments · User learnings · Data reads · Reflection · Open questions · Next-cycle ideas. Mark anything unknown as TBD rather than guessing.

4. Metrics policy: direction-only. Record outcomes as direction and rough magnitude ("positive, small", "negative for the cash cohort"), never as figures. Convert any number I give you.

5. A learning is promoted to LEARNINGS.md only when more than one record, or one strong piece of research, supports it. Give it the next L-NNN, say where it holds, cite the records.

6. Regenerate records/index.md and end with three questions that would make this record stronger.`,
    adapt: [
      'Change the ID prefix and the heading list to your team’s vocabulary, then never change them again. The `debate` side depends on fixed headings.',
      'Keep direction-only metrics if the repo lives outside your company’s systems. A git commit cannot be recalled.',
      'Add a `review/` log for the judgements made while extracting from source documents. The extraction can be rebuilt; the judgements cannot.',
    ],
  },
  {
    slug: 'resona',
    title: 'Build your own Resona',
    intro: 'Resona is a pipeline, not a chat: **audio in, a coded report out**. The discussion guide is the coding frame, every insight must cite a timestamp, and the model is told to **doubt itself out loud** when a claim outruns the evidence.',
    get: [
      'Transcripts with speakers separated and each utterance tagged to a section of your discussion guide.',
      'Observations clustered into themes, insights scored by how many participants support them, verbatims pinned to timestamps.',
      'A key finding, how-might-we prompts per theme, and an “AI asks” list of claims that need your clarification.',
      'A report that exports cleanly and re-runs when a recording is added.',
    ],
    need: [
      'Transcription with speaker diarization for your languages (a Whisper-class model handles Hindi and Hinglish acceptably).',
      'A long-context model for the synthesis pass, and a place to run it: a script, a Claude Project, or a small web app.',
      'Your discussion guide, with sections and objectives written out.',
      'Consent from participants for recording and machine transcription.',
    ],
    prompt: `You are a research synthesist. Inputs: (a) a discussion guide with numbered sections and objectives, (b) transcripts with speaker labels and timestamps, one per session.

Work in this order and show your work:

1. Observations. For every substantive utterance by a participant, write one observation tagged with the guide section it answers, the session and speaker (S2_P1), and the timestamp. Quote the participant verbatim in their own language.

2. Clusters. Group observations into themes that follow the guide’s objectives. Name each theme as a question the guide asked.

3. Insights. For each theme, write insights as claims. Every insight carries: how many participants support it out of how many, an insight score (HIGH when most participants said it unprompted, MEDIUM when some, LOW when one), at least one verbatim with its timestamp, and a one-line design implication.

4. Doubt. If an insight claims more participants than the transcripts show, or generalises from one strong quote, do not publish it. Put it under “AI asks” with the exact gap and a question for the researcher.

5. Key finding. One paragraph a product leader can act on, in plain words.

6. How might we. Two prompts per theme, phrased as design questions, never as solutions.

Output as structured sections in this order: Key finding · Quality (observations, clusters, insights, HMWs counted) · Themes with insights · AI asks · How might we.`,
    adapt: [
      'Swap the scoring thresholds for your sample sizes. With four participants, “3 of 4” is HIGH; with twelve it is not.',
      'Keep verbatims in the participant’s language and translate in a footnote. Translation flattens the hesitation you are looking for.',
      'Add voice features later, if at all: pauses, sighs and pitch help spot the gap between what was said and what was felt, but the timestamp rule does most of the work.',
    ],
  },
];
