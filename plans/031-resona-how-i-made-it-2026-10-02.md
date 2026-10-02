# Resona: How I made it; AI pages are one-pagers — 2026-10-02

Uttham: "In the research ai project, also add how me made it, this is powered by
/anthropic-skills:research-scripter for generating and decoding the research objectives, we have
added meesho context from hero flows to about our users, past popular research studies, trained
internally on research methodologies, on how to conduct research for meesho audience. lets debate
first before you add stuff to it"

## The debate (workflow wf_94d0d62e-5fe)

A fact-check against the research-scripter skill files, then four lenses (portfolio reader,
confidentiality, accuracy, page structure) and a synthesis. Its flags: the skill writes guides
only and does not synthesise; the skill's README drops the past study write-ups and the flow
screenshots; nothing is "trained"; the install handle reads as an Anthropic product.

Uttham settled it: **the app triggers the skill itself** ("you can trigger to run this"), and he
pasted the synthesis pipeline read out of the app's code, with "trust me what i said". His answers:
keep his phrases as written; **no names** ("just this page is all about explaining my work");
"we" is **him alone**; keep "actively listens… upskills them"; and **AI Space pages are
one-pagers, not teasers** ("for AI space cards, there is no need to have teaser, just a one pager
only"). Asked to choose, he kept the layout and dropped the word.

## Implemented

- **"How I made it"** on /ai/resona, after How it helps (`tools.ts` `made`, arranged in
  `ai-pages.ts`):
  - his lead, grammar fixed, the skill unnamed ("an AI skill I wrote"), first person;
  - one line on the pipeline;
  - "The synthesis, step by step": Plan, Listen, Nuggets, Cluster, Synthesise, How might we,
    Verify. Each step drives the phone: setup, record, synth, synth, insights, insights, insights.
  - It describes the mechanism only. Model names, file names, the participant-ID format and the
    known clustering bug stay off the page and out of the public repo.
- `CaseStep` text now goes through `rich()`, so steps carry bold highlights; plain step text on the
  case studies renders as before.
- `src/data/ai-teasers.ts` → `src/data/ai-pages.ts` (`aiPage`); comments and CLAUDE.md call them
  one-pagers. `CaseTeaser` keeps its name; the case studies are still teasers.

## Review (workflow wf_a5f8fd67-51c, 3 lenses, each finding verified)

Fixed:

- **The section's own state competed with its seven steps.** The picker takes the trigger nearest
  the band, and a tall section's centre sits mid-steps, so the phone jumped back to the home
  screen. The section carries no state now. A wheel sweep at 1440×900 ran Plan → Listen → Nuggets
  → Synthesise → How might we → Verify with no jump back.
- **Synthesise** no longer says "not the clusters" (the source doesn't say it), and it names what
  the step produces.
- **Verify** says only critical issues reach the researcher, and that the finding is then updated.
- "each building on the ones before it"; "transcribed and translated, speakers separated".
- The lead keeps his "This is".
- A highlight no longer opens a step's line, where it looked like a second label.
- The merged CSS comment.

Refuted as taste or already handled: guide-optional wording, the handoff between skill and
pipeline, the Listen screen, literal vs escaped characters, the public-repo comment.
