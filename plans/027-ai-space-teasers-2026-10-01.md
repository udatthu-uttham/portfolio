# The AI Space tools, as teasers — 2026-10-01

Uttham: "use another agent to do similar teaser for ai space things. and in the ai prototype card,
no need to add view prototype link, clicking on the card will move to ai space teaser page, where
the right side is running preview as we did for the project case studies, similar for the first ai
tool as well".

## Implemented

- **`/ai/resona` and `/ai/realistic-prototype` render through `CaseTeaser`**, the product-cards
  layout (plans/026), in live mode — no second layout. `src/pages/ai/[slug].astro` passes the
  running tool in the `preview` slot with the new `frame="phone"`: the tool stands in the teaser's
  own 9/19.5 phone, sized off the pane exactly like the screens, and fills it.
- **Content is Uttham's existing copy only.** `src/data/ai-teasers.ts` holds no words: it arranges
  `tools.ts` (name, kicker, year, what, helps, visit) and `guides.ts` (title, intro, get, need,
  prompt, adapt) and says which step each row shows. The page keeps the guide page's sections, in
  its order: hero = guide title + intro, then facts (Tool / Kind / Year — "Kind" is the old page's
  eyebrow, "Internal tool · White-label guide"), **How it helps** (the card's `what` line, then the
  `helps` rows), **What you get**, **What you need**, **The prompt**, **What to change for your
  team**. Back link "← AI Space" to `/#ai`.
- **Bold highlights** added to the `get`, `need` and `adapt` lines in `guides.ts` (CLAUDE.md; grammar
  and bold only — no word changed). The prompt carries none: it is copied as plain text.
- **New block kinds**, additive in `case-teaser.ts` / `CaseTeaser.astro`:
  - `rows` — ruled rows of prose (the `steps` recipe, amber tick on the row being read), each row
    its own trigger when it has a `state`.
  - `prompt` — the guide's bolted glass panel with the prompt as a white card on it and the page's
    one primary sticker, "Copy the prompt". The copy reads the `<pre>`, so what is read is what is
    copied; with the clipboard blocked it selects the prompt and tries the old copy command; a
    visually hidden status says "Copied".
  - `visit` on the page data — "Open the prototype ↗" under the facts (new tab).
- **Resona follows the reading** (`<ResonaPreview fill follow />`). Every row names one of the
  app's own steps: How it helps → setup, record, prepare; What you get → setup, synth, insights ×3,
  prepare; What you need → record, synth, setup, record; The prompt → insights (what it produces);
  What to change → insights, prepare (the home's Hinglish records are "verbatims in the
  participant's language"), record. It reads the panel's `data-showing` once on start, in case the
  teaser announced its first state before the preview's script ran. The homepage card keeps its
  loop.
- **The prototype just runs, and is usable in the phone** (`<ProtoPreview fill interactive />`) —
  at 1440×900 it is 286px wide, a 0.89 scale of its own 320px viewport. Its rows carry no state:
  driving its routes from the reading would pull it out of the reader's hands, and its deep routes
  need app state a URL cannot give.
- **Phones (<768px).** The mini player is the same 112px phone. A live phone **opens full size in
  place** on a tap (moving an iframe into the screens' `<dialog>` would reload it): the panel
  grows to `min(100vw − 2 × margin, 320px, (100svh − header − 48px) × 9/19.5)` centred under the
  header, over a dimmed page; × (relabelled "Shrink the preview"), Escape or the dimmed page
  shrinks it; × on the mini player hides it as before. Going back past the hero or reaching the end
  shrinks it too. The header stays on top: the teaser is its own stacking context under it.
- **The reading band's tail.** These pages end on their last rows, which can never scroll up to
  the middle of the screen, so they never drove the phone. Now, only where the last trigger cannot
  reach the middle, the band slides from the middle down to that row over the last half screen of
  scrolling and every trigger is a candidate. A page whose rows all reach the middle never takes
  this path. (The product-cards page takes it only with the full study open at 1440×900, where its
  last block, "date", sat 42px short of the band and could not be reached before either.)
- **Homepage AI cards.** `ProtoPreview` on the card is now only a running preview: no link, no
  "Open the prototype" pill, frame off the pointer. The stretched title link is the card's only
  link, so the `:has(a)` well workaround is gone; a click anywhere on either card — paper, glass or
  phone — opens `/ai/<slug>`, and the copy button still sits above the link.
- **Spacing**, per the coordinator's in-flight ladder for `CaseTeaser` (merge pending): the prompt
  panel takes `--group-gap` as a sub-group, rows or the prompt straight under a section's h2 take
  `--head-gap`, the visit link `--group-gap`; `.ai-page` pads `--header-height + --section-pad`
  like the case page. Existing spacing rules were not edited.

## Verification (Chrome, dev server on :4330, own tab)

| | 1440×900 | 1280×800 | 768×1024 | 375×812 |
| --- | --- | --- | --- | --- |
| Story / panel width | 690 / 486 | 653 / 460 | 423 / 246 | full / mini player |
| Panel height, sticky | 720 | 676 | 720 | fixed, bottom-right |
| Phone (whole in the pane) | 286×619 | 265×575 | 191×413 | 112×243; enlarged 308×668 |
| Tool scale (of 320px) | 0.89 | 0.82 | 0.59 | 0.34; enlarged 0.96 |
| Horizontal overflow | none | none | none | none |

- **Resona**: all 17 triggers walked one by one at 1440×900; each made its row current and put its
  step on the phone, the last three via the tail band (at the very bottom, "Add voice features
  later" → record).
- **Prototype**: runs whole in the pane, its bottom nav on the frame's edge; every point of the
  phone hit-tests to the iframe (pointer events on, nothing above it) and the app's own viewport
  scrolls inside the frame. The test browser's synthetic wheel and taps do not route into iframes,
  so a real hand on the feed is still worth one look on a device.
- **Copy**: "Copy the prompt" hands over the `<pre>` exactly — 1,664 characters for Resona, 1,692
  for the prototype, identical to the homepage card's source textarea — then reads "Copied" for
  1.6s; the blocked-clipboard path selects all 1,692 characters and runs the copy command. The
  homepage "Copy the prompt" / "Copy the plan" buttons still copy their guide's prompt.
- **Homepage**: each AI card has exactly one link; centre of the phone, corner of the well and the
  paper all hit `/ai/resona` and `/ai/realistic-prototype`; the copy button hits itself. No pill.
- **Phones**: hidden over the hero; appears after it; tap enlarges (focus to ×), ×/Escape/dimmed
  page shrink (focus back), × on the mini hides it, "Show preview" restores, back over the hero
  shrinks and hides. Product-cards' screens dialog still opens the current screen.
- **Product-cards page unchanged**: the built `dist/work/a-line-of-card-height/index.html` has
  identical text (182 runs) and identical body markup. The only differences are build artefacts:
  `CaseTeaser`'s script grew past Vite's 4 KB inline limit, so it is now an external module, and
  its CSS, now shared by two routes, is split into its own chunk (one more `<link>` in the head —
  Meesho Mall's page gets the same extra link and nothing else).
- `npx astro build` passes.

## Open

- A "More in AI Space" index after the teaser (like "More cases") was not added — not asked for.
- Whether the prototype should walk its own routes as the guide is read (feed → product → cart →
  orders) is a call for Uttham; it would need the app to accept a route from its parent.
