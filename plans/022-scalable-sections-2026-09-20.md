# Scalable Projects and AI Space (agreed 2026-09-20)

**Principle:** a board shows a few, an index holds the rest. One data source per section.

## Projects
- Layer 1: featured tiles on the glass board (`Study.featured`), auto-fit grid — two share a row, a third fits at desktop, one column on phones.
- Layer 2: `CaseIndex` rows under the board for every unfeatured case — year, kicker, title, one line, arrow. No media. Also used at the end of every case page as "More cases" (replaces PageNavigator there).
- No filter pills (Uttham: "get rid of them"). Current work sorts first by array order.
- Decision 20 Sep 2026 (late): no glass board; each tile’s media well is the glass (the first “option 2” mock). Mock pages deleted after the decision.

## AI Space
- One bench (`ToolBench`): list on the left (kicker, name, one line), the selected tool's live preview on the right, three answers under it — What is this · How it helps at Meesho · How to replicate it — as three columns. Hover peeks, click commits, only one panel visible.
- Replicate column ends in "Copy the prompt" and "Read the guide" → `/ai/<slug>`, a white-label guide page (`src/data/guides.ts`: what you get, what you need, the prompt, what to change). No Meesho data in guides.
- Adding a tool = one entry in `tools.ts` + one guide. Feed UX prototype stays inside the card-height study only; ShopX proto dropped.

## Open
- Bench default = first `featured` tool (Context Layer). Uttham to confirm.
- Whether hover-peek should also apply on the Projects index (currently colour + arrow only).
