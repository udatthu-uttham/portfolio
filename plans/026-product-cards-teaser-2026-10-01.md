# The product-cards case study, as a teaser — 2026-10-01

Uttham, with the layout and brief attached: "for the l2 of first project, this is the [teaser] —
implement with our website components and spacings and everything". After a first pass was
misread: "I asked you to build the teaser gate as shared in HTML, I want that as it is, and images
are not needed, on the right we want a preview with dynamic images changing with the scroll" —
references: shristishreya.vercel.app/case-study/bus-discovery (the sticky phone) and
pravalhika.com/payments (the teaser shape). On the phone: "I will give the figma screens, use
them, no need to code". On the gate: "Light gate only".

## Implemented

- **`/work/a-line-of-card-height` renders the teaser.** `src/components/CaseTeaser.astro`, opted in
  by `teaser: plpCase` on the study, so Meesho Mall's page renders exactly as before. The homepage
  tile still reads the study's own title, summary and cover.
- **Copy word for word from the HTML**, with bold highlights added (CLAUDE.md). Content lives in
  `src/data/plp-case.ts`; the six-chapter "exchange rate" draft it replaces is in git history.
- **Left: text only**, in the case page's paper recipe — h1 at `--text-hero` (19ch, as drawn),
  the dek, the facts as label/value rows between dashed rules, then Context, Problem, the scan
  order, Strategy and Outcome, `--section-y-sm` apart. Ruled rows use the case index's dashed
  recipe; the row being read takes an amber tick in the gutter (colour only).
- **Right: a sticky phone on bolted glass** (12-column grid: story 1/8, panel 8/-1 — 486px at
  1200), `top: header + --content-gap`, `height: min(100svh − header − 2 gaps, 720px)`. The phone
  (9 / 19.5, `--radius-media`) is sized off the pane's height and width through a size container,
  so it stands whole at every size. On the 8-column tablet grid (768–900px) the split is 5/3.
- **Phones (<768px) float the phone as a mini player**, the bus-discovery reference's answer
  (studied at 375×812: a fixed 132×273 phone bottom-right, shown once the hero is off screen, with
  expand and close). Ours: 112px wide, `--margin-side` from the right, `--space-5` above the safe
  area, `--z-float`; no pane at this size. It fades in once the hero has scrolled away, keeps
  following the reading (band = the screen's middle), opens the current screen full size in a
  `<dialog>` on a tap, hides on × with a "Show preview" sticker to bring it back, and steps away
  when "More cases" arrives. The brief's 300px top strip was tried first and dropped: it left a
  123px phone and covered ~half the reading area.
- **The phone follows the reading.** Every `data-state` is a trigger; the one nearest the centre
  of the reading band picks the screen — re-picked on every scroll frame, because the observer
  alone went stale under smooth scrolling and skipped every other row. Screens crossfade over
  `--dur-4 --ease-enter` in and `--dur-2 --ease-exit` out (the brief's 400–600ms and its exact
  curve are already the site's tokens). A state without a screen keeps the last one; the dev
  server names the missing screen.
- **Screens are Uttham's Figma exports** in `src/assets/plp/<state>.(png|jpg|webp)` — the README
  there lists all sixteen names. On hand: `stagger.jpg`, the staggered screen cut from
  `src/assets/cards/stagger.jpg`.
- **The gate.** The Outcome's paper card (the tiles' white stock — Uttham: "no need of glass for this,
  just use the card structure") holds the one primary sticker, "Read the full case study";
  it reveals a password field, and the right password expands the full case study in place, moves
  focus to it and keeps it open for the session. Light by choice: the text ships in the page.
  Only a SHA-256 is stored (`src/data/case-gate.ts`, set with `npm run case-password`, which never
  prints or stores the password). Unset: the dev server opens it with any entry; a production
  build for no one.
- **The full case study**: eight blocks from brief §4 — status pill, title, Why / How / What
  worked — each driving the phone with its state. Parts the brief marks "open" are omitted
  (Cleanup's How and What worked; Cleanup's and Bigger images' status).
- **250 million** is linked on first mention to Meesho's Q3 FY26 Shareholders' Letter on BSE (251M
  annual transacting users). CLAUDE.md now allows a public figure Meesho published, linked.
- **The fabric verbatim is built but off** (`verbatim.consent: false`) until consent is confirmed.
  "(verbatim above)" is dropped from Clearer titles' What worked while it is off.

## Verification (Chrome, dev server)

| | 1024×768 | 1280×720 | 1280×800 | 1440×900 | 1920×1080 | 768×1024 | 375×812 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Story / panel width | 520 / 365 | 653 / 460 | 653 / 460 | 690 / 486 | 690 / 486 | 423 / 246 | full / mini player |
| Panel height, sticky | 651 | 596 | 676 | 720 | 720 | 720 | fixed, bottom-right |
| Phone | 254×550 | 228×495 | — | 286×619 | 286×619 | 191×413 | 112×243 |
| Horizontal overflow | none | none | none | none | none | none | none |

All sixteen teaser states drive the panel in order (walked one by one); the staggered screen
appears at "Staggered feed" and stands in for the later rows that have no screen yet; rows before
it show an empty phone. Phones: hidden at the top, on mid-page, the tap opens the full-size
screen, × swaps in "Show preview" (focus follows), hidden again at "More cases". The gate opens on
the dev server, focus lands on the full study, and it stays open on reload. The production build
has no dev label, an empty hash and no verbatim text. Meesho Mall's page still renders its hero.

## Open (Uttham)

- **Screens**: fifteen states still need exports (README in `src/assets/plp/`).
- **Password**: run `npm run case-password` before publishing; until then nobody can open it.
- **Verbatim consent** for the fabric quote.
- **Brief items marked open**: the cleanup audit and zone/cap rule as written, the old card's
  element count and owning teams (the annotated state), the bigger-images rollout decision.
- **The tag-colour call** from the brief's leadership layer (inline green tested best; yellow
  shipped because the card was already green) is on no block yet: which block it belongs in —
  likely Clearer titles' How — waits on where consideration tags go (open item 5).
- **Claims his own records don't back** (raised, not rewritten — the copy is his): research in
  Delhi and Bengaluru (records: Jaipur and Kolar); "the new card is live for 250 million"; "each
  measured on its own" (staggering V1 was bundled); scan steps 3 and 5 worded differently from
  REC-011; cash price's What worked (the test has no read yet); "Third test scaled" and "Shipped".
