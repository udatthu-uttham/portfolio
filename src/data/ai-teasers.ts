// The AI Space tool pages, /ai/<slug>, as teasers (Uttham, 2026-10-01: "similar
// teaser for ai space things … the right side is running preview as we did for
// the project case studies"). Rendered by src/components/CaseTeaser.astro in
// live mode: the left column is the guide, the sticky phone runs the tool.
//
// NO COPY LIVES HERE. Every word comes from tools.ts (name, kicker, year, what,
// helps, visit) and guides.ts (title, intro, get, need, prompt, adapt) — Uttham's
// own lines, word for word (CLAUDE.md). This file only arranges them and says
// which step of the running tool each row shows.
//
// States are the running tool's own steps. Resona's preview walks prepare →
// setup → record → synth → insights, so every row names the step that shows
// what it says. The prototype's preview is the real app, which the reader can
// use in the phone; driving its routes from the reading would yank it out of
// their hands, so its rows carry no state and it simply runs.
import type { CaseRow, CaseTeaserData } from './case-teaser';
import { tools } from './tools';
import { guides } from './guides';

type Step = 'prepare' | 'setup' | 'record' | 'synth' | 'insights';
type StateMap = {
  helps?: Step[];
  get?: Step[];
  need?: Step[];
  prompt?: Step;
  adapt?: Step[];
};

const stateMaps: Record<string, StateMap> = {
  resona: {
    // methods and questions suggested · it listens · one store for everyone
    helps: ['setup', 'record', 'prepare'],
    // the setup step · coded transcripts · themes and scores · key finding and AI asks · the report · the store
    get: ['setup', 'synth', 'insights', 'insights', 'insights', 'prepare'],
    // transcription · the synthesis model · the discussion guide · consent to record
    need: ['record', 'synth', 'setup', 'record'],
    // the prompt is the synthesis pass; the phone shows what it produces
    prompt: 'insights',
    // scoring thresholds · verbatims in their own language (the home's records) · voice features
    adapt: ['insights', 'prepare', 'record'],
  },
};

const rows = (lines: string[], states?: Step[]): CaseRow[] =>
  lines.map((text, i) => ({ text, state: states?.[i] }));

export const aiTeaser = (slug: string): CaseTeaserData => {
  const tool = tools.find((t) => t.slug === slug);
  const guide = guides.find((g) => g.slug === slug);
  if (!tool || !guide) throw new Error(`No tool and guide for /ai/${slug}`);
  const map = stateMaps[slug] ?? {};

  return {
    title: guide.title,
    dek: guide.intro,
    back: { href: '/#ai', label: '← AI Space' },
    facts: [
      { label: 'Tool', value: tool.name },
      // the guide page's eyebrow, as it read before the teaser
      { label: 'Kind', value: `${tool.kicker} · White-label guide` },
      { label: 'Year', value: tool.year },
    ],
    visit: tool.visit,
    panelLabel: `${tool.name}, running`,
    sections: [
      {
        heading: 'How it helps',
        blocks: [
          { kind: 'p', text: tool.what },
          { kind: 'rows', rows: rows(tool.helps, map.helps) },
        ],
      },
      { heading: 'What you get', blocks: [{ kind: 'rows', rows: rows(guide.get, map.get) }] },
      { heading: 'What you need', blocks: [{ kind: 'rows', rows: rows(guide.need, map.need) }] },
      { state: map.prompt, heading: 'The prompt', blocks: [{ kind: 'prompt', text: guide.prompt, copy: 'Copy the prompt' }] },
      { heading: 'What to change for your team', blocks: [{ kind: 'rows', rows: rows(guide.adapt, map.adapt) }] },
    ],
  };
};
