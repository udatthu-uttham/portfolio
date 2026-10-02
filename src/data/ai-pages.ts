// The AI Space tool pages, /ai/<slug>: one-pagers, not teasers (Uttham,
// 2026-10-02: "for AI space cards, there is no need to have teaser, just a one
// pager only") — everything on the page, nothing gated. They keep the case
// studies' layout (2026-10-01: "the right side is running preview as we did for
// the project case studies"), so they render through
// src/components/CaseTeaser.astro in live mode: the left column explains the
// tool, the sticky phone runs it.
//
// NO COPY LIVES HERE. Every word comes from tools.ts (name, kicker, year, what,
// helps, idea, made, visit) and guides.ts (title, intro, get, prompt) — Uttham's
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
  madeSteps?: Step[];
  get?: Step[];
  prompt?: Step;
};

const stateMaps: Record<string, StateMap> = {
  resona: {
    // methods and questions suggested · it listens · one store for everyone
    helps: ['setup', 'record', 'prepare'],
    // plan · listen · nuggets · cluster · synthesise · how might we · verify.
    // The section itself carries no state: a section that holds triggers of
    // its own would compete with them (the picker takes the trigger whose
    // centre is nearest the band, and a tall section's centre sits mid-steps),
    // so its lead keeps the home screen from the last "How it helps" row.
    madeSteps: ['setup', 'record', 'synth', 'synth', 'insights', 'insights', 'insights'],
    // the setup step · coded transcripts · themes and scores · key finding and AI asks · the report · the store
    get: ['setup', 'synth', 'insights', 'insights', 'insights', 'prepare'],
    // the prompt is the synthesis pass; the phone shows what it produces
    prompt: 'insights',
  },
};

const rows = (lines: string[], states?: Step[]): CaseRow[] =>
  lines.map((text, i) => ({ text, state: states?.[i] }));

export const aiPage = (slug: string): CaseTeaserData => {
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
      // The tool's own idea, ahead of everything (Uttham, 2026-10-02: "emphasis
      // the idea of this prototype"). Only tools that carry one get it.
      ...(tool.idea ? [{ heading: 'The idea', blocks: [{ kind: 'p' as const, text: tool.idea }] }] : []),
      {
        heading: 'How it helps',
        blocks: [
          { kind: 'p', text: tool.what },
          { kind: 'rows', rows: rows(tool.helps, map.helps) },
        ],
      },
      // How the tool was built, right after what it does for you (Uttham,
      // 2026-10-02), and before the white-label recipe. Second, not first like
      // the prototype's idea: it explains how the tool works rather than what
      // it is. Only tools that carry `made` get it.
      ...(tool.made
        ? [{
            heading: 'How I made it',
            blocks: [
              { kind: 'p' as const, text: tool.made.lead },
              { kind: 'p' as const, text: tool.made.pipeline },
              {
                kind: 'steps' as const,
                heading: tool.made.heading,
                steps: tool.made.steps.map((st, i) => ({ ...st, state: map.madeSteps?.[i] })),
              },
            ],
          }]
        : []),
      { heading: 'What you get', blocks: [{ kind: 'rows', rows: rows(guide.get, map.get) }] },
      // "What you need" came off on 2026-10-02 (Uttham: "can we ignore what you
      // need"); the page goes from what you get straight to the prompt.
      // The page ends on the prompt. "What to change for your team" came off on
      // 2026-10-02 (Uttham: "remove want to change for your team section, and
      // the prompt I believe is whitelabelled") — the prompt already asks what
      // you are trying to learn and leaves the catalogue to you.
      { state: map.prompt, heading: 'The prompt', blocks: [{ kind: 'prompt', text: guide.prompt, copy: 'Copy the prompt' }] },
    ],
  };
};
