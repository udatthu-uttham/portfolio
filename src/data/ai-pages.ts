// The AI Space tool pages, /ai/<slug>: one-pagers, not teasers (Uttham,
// 2026-10-02: "for AI space cards, there is no need to have teaser, just a one
// pager only") — everything on the page, nothing gated. They keep the case
// studies' layout (2026-10-01: "the right side is running preview as we did for
// the project case studies"), so they render through
// src/components/CaseTeaser.astro in live mode: the left column explains the
// tool, the sticky phone runs it.
//
// NO COPY LIVES HERE. Every word comes from tools.ts (name, kicker, year, what,
// helps, idea, made, callout) and guides.ts (title, intro, get, prompt) — Uttham's
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
  made?: Step[][]; // per How I made it group, per row or step
  get?: Step[];
  prompt?: Step;
};

const stateMaps: Record<string, StateMap> = {
  resona: {
    // methods and questions suggested · it listens · one store for everyone
    helps: ['setup', 'record', 'prepare'],
    // How I made it, group by group. Neither the section nor a group carries a
    // state of its own: a box that holds triggers would compete with them (the
    // picker takes the trigger whose centre is nearest the band, and a tall
    // box's centre sits mid-rows), so only rows and steps drive the phone.
    made: [
      // planning: types and method · the gate and formats · cohorts on the New Notes form;
      // examples · past studies · tailoring · language · tasks · techniques · bias on the home
      ['setup', 'setup', 'setup', 'prepare', 'prepare', 'prepare', 'prepare', 'prepare', 'prepare', 'prepare'],
      // execution: its description, on the listening sheet
      ['record'],
      // synthesis: plan · listen · nuggets · cluster · synthesise · how might we · verify
      ['setup', 'record', 'synth', 'synth', 'insights', 'insights', 'insights'],
      // library: its description, on the home with its search and past studies
      ['prepare'],
    ],
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
      // "Value added" replaces "Kind" where Uttham has given one (2026-10-02:
      // "remove the kind - and say value added")
      tool.value
        ? { label: 'Value added', value: tool.value }
        : { label: 'Kind', value: `${tool.kicker} · White-label guide` },
      { label: 'Year', value: tool.year },
    ],
    // No link out to the running build (Uttham, 2026-10-03: "dont give link
    // of real prototye let the prototype be interactable there only, and give
    // callout on top that it is interactable"): the phone is the prototype,
    // and its callout says it can be used there. tool.visit stays the
    // preview's source only.
    callout: tool.callout,
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
      // 2026-10-02), in one sub-group per stage. Only tools that carry `made`
      // get it.
      ...(tool.made
        ? [{
            heading: 'How I made it',
            blocks: [
              ...(tool.made.lead ? [{ kind: 'p' as const, text: tool.made.lead }] : []),
              ...tool.made.groups.map((g, gi) =>
                g.steps
                  ? { kind: 'steps' as const, heading: g.heading, lead: g.lead, steps: g.steps.map((st, i) => ({ ...st, state: map.made?.[gi]?.[i] })) }
                  : { kind: 'rows' as const, heading: g.heading, lead: g.lead, rows: rows(g.rows ?? [], map.made?.[gi]) },
              ),
            ],
          }]
        : []),
      // Where the work goes next (Uttham, 2026-10-02: "Add next steps"). Only
      // tools that carry `next` get it.
      ...(tool.next
        ? [{ heading: 'Next steps', blocks: [{ kind: 'p' as const, text: tool.next.lead }, { kind: 'rows' as const, rows: rows(tool.next.rows) }] }]
        : []),
      // The recipe comes after the story: the prompt, then what it gets you
      // (Uttham, 2026-10-02: "what you get should be after the prompt section
      // for both the ai projects"). "What you need" (2026-10-02: "can we ignore
      // what you need") and "What to change for your team" ("the prompt I
      // believe is whitelabelled") are gone; the prompt asks for the reader's
      // own context instead.
      { state: map.prompt, heading: 'The prompt', blocks: [{ kind: 'prompt', text: guide.prompt, copy: 'Copy the prompt' }] },
      { heading: 'What you get', blocks: [{ kind: 'rows', rows: rows(guide.get, map.get) }] },
    ],
  };
};
