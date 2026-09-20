# A line of card height — case study build (2026-09-20)

**Status: first full draft live at /work/a-line-of-card-height, for Uttham's review. Title is still the working title.**

## Sources read
- Context Layer repo: `records/mvt-new-framework.md` (REC-001), `records/mvt-old-framework.md` (REC-002), `records/plp-staggering.md` (REC-003), `LEARNINGS.md` (L-001…L-009, L-005 open), `review/picks.json` + `comments.json` for the three records.
- Drive: KRD – Personalised UX (problem context, past-experiment learnings, PLP design principles); Discovery Weekly Review (Personalised UX Wk1–Wk7: UT results, D7 MVT read, feed-layout experiment update); Marketplace Connect (August cycle review: price_3, top-quality tags, scale-to-prepaid decision); Discussion Guide: Feed UX Info changes (N=14, cohorts, task blocks, summary table).
- Figma: Context Layer cards 199-21 / 199-286 / 199-125; BrowseX Playground 2026 nodes 6149-2224 (MVT variants), 6180-23873 (price rows), 6180-21555 (staggering control vs test) exported at 3× → `src/assets/cards/*.jpg` (1600w).
- Feed UX Proto (`~/Desktop/Projects/Feed UX Proto copy`): built with `--base=/proto/feed-ux/` into `public/proto/feed-ux/`; `src/main.jsx` got a `basename` and an `/index.html` guard; absolute public paths rewritten post-build.

## Shape
Hero: title, summary, cover render (staggering control vs test, cropped landscape) as a card on the pane.
Chapters: 1 The card · 2 Minimum viable truths (live prototype embed) · 3 The price row · 4 Staggering · 5 The exchange rate · 6 How I led it. Each chapter: one or two paragraphs with bold highlights, a figure, a folded "working" note; verbatims as sticky notes; one `^^` beat per chapter at most.
Rules followed: CLAUDE.md — no business figures (direction only; research sample sizes kept), highlights in bold, images as cards with margins, no hover motion.

## Open with Uttham
1. Title. "A line of card height" was chosen by a previous session, not approved.
2. Chapter 6 "How I led it" — confirm the intent-prediction argument and the research claims (14 in-person sessions, Hindi moderation) are his to make.
3. L-005 contradiction: which is right, the six-arm read or "did not conclude"? Chapter 4 currently says "structure, not a result".
4. Whether the prototype embed should open on the PLP lab (`/plp-lab`) rather than the home feed.
5. Prototype product images: a handful 404 under the sub-path (data-embedded absolute URLs) — check before publish.
