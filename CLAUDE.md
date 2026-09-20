# Portfolio — working instructions

## Prose: bold the highlights

**Every long sentence or paragraph carries its highlights in bold.** A reader
should be able to skim only the bold and still get the argument. This holds
everywhere on the site — hero copy, case-study chapters, section intros, card
summaries, AI Space blurbs — and it is a standing rule, not a per-task request
(Uttham, 2026-09-20).

Markup, as `rich()` in `src/pages/work/[slug].astro` parses it:

| Syntax | Renders | Use for |
|---|---|---|
| `**text**` | `<strong class="em">` | the normal highlight |
| `^^text^^` | `<strong class="em em--lg">` | one bigger beat per chapter, used sparingly |

In `.astro` templates the same effect is plain `<strong>` (see the hero lead in
`src/pages/index.astro`).

Rules of thumb:
- Highlight the **claim**, not the connective tissue. Bold what the sentence is
  *for*, never a whole clause of setup.
- Roughly one highlight per sentence, two at most. If most of a paragraph is
  bold, nothing is.
- Short lines (under ~15 words) usually need none.
- `^^` is a beat, not a second weight of `**` — at most one per chapter.

## Metrics: no Meesho business figures

**No confidential business numbers anywhere on the site** — NMV share, user
counts, adoption or conversion percentages, order volumes (Uttham, 2026-09-20).
Say direction and magnitude instead: "climbed", "hit the share the business
asked for", "most shoppers". This mirrors `metrics_policy: direction-only` in
the Context Layer repo.

Not covered by this rule, and fine to keep: dates, version numbers, and the
method detail of Uttham's own research (number of rounds, sample sizes,
locations).

## Motion: no hover motion

**Nothing lifts, tilts, straightens or peels on hover — anywhere** (Uttham,
2026-09-20). The magnetic-tilt system (`initMagneticTiles`, `data-magnetic`,
the `magnetic` prop on `InstaxFrame`) is removed, not disabled. Hover is carried
by colour, border and the arrow nudge only. Entrance reveals and the pointer
ride are unaffected; this rule is about hover states.

## Images: never full-bleed inside a glass panel

**An image or coloured cover sits as a card ON the pane, never filling it end to
end** (Uttham, 2026-09-20). Keep a margin on every side so the glass reads as the
surface underneath rather than as a frame around a picture. Size phone frames off
the container's *height* so they stand flush on an edge instead of being cut
mid-screen.

## AI Space previews: synthetic data only

**Every preview in the AI Space section renders invented data** (locked
2026-09-20). No real Context Layer record contents, no Figma file key, no
colleagues' records, no participant audio or verbatims, no Meesho figures. The
previews show the *mechanism*; the contents are always made up, and each card
says so in its status line. Copy and framing live in `src/data/tools.ts`.

## A tool preview keeps the tool's own identity

**A preview renders the tool's real UI, not a restyled version of it** (Uttham,
2026-09-20). Resona is black with magenta `#9F2089`, a numbered pill stepper
(`Preparation → Observations → Synthesised`), 16px radii and white chat bubbles —
taken from `Resona Web app/components`, not invented. Its frame gets
`frame--dark` so the chrome belongs to the app inside it. Only the *data* is
mock; the design language is the tool's own.
