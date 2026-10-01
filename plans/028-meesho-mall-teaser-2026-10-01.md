# Meesho Mall, as a teaser — 2026-10-01

Uttham, with "Meesho Mall case study — teaser layout.html", its .md and a PDF print of it: "This
is for the second case study, just use the content from here, implement like we did for the
first 1."

## Implemented

- **`/work/meesho-mall` renders the teaser** through the same `CaseTeaser` as the product cards
  (made generic first, in 68402cd: content as sections and blocks, screens resolved per state from
  `src/assets/<dir>/` through an optional map, a `preview` slot for live tools). Content is
  `src/data/mall-case.ts`, his words verbatim with bold highlights added (CLAUDE.md). The deck-first
  chapters it replaces are in git history; `deck` stays on the study because the homepage tile
  stands its phone on `deck.screen`.
- **The phone shows the Mall deck's own exports**, already in `src/assets/mall/`:
  v1-tag → v1-plp-tag, v2-journey → v2-home, v3-pill → v3-landing, v3-nav → v3-home-pip,
  v3-splash, v3-ftux → v3-plp-ftux, v3-pdp, v3-landing-new → v3-landing. States with no screen of
  their own (v3-research, v3-labels, v3-landing-active, v3-ocp, v4-quote) show the nearest earlier
  one; dropping `src/assets/mall/<state>.png` gives a state its own. The two `v1-*-card` files are
  deck slides, not phone screens, and are not used.
- **Both quotes are on the page as sticky notes.** The Lucknow one was already published on the
  old page and in the public deck; neither is marked consent-open in Uttham's layout (the
  product-cards layout marked its fabric quote "Confirm consent before publishing").
- **Left out, because the layout marks them as placeholders**: the v3 year in Timeline ("this case
  is v3, *year*"), the Team row ("*Pod size and partner teams*"), and the full case study — its
  spec, `mall-case-study-context.md`, was not among the files. The gate card therefore shows its
  line but no button until that content exists.
- Responsive as the product cards: the phone beside the text from 768px, the floating mini player
  on phones.

## Verification (Chrome, dev server)

- 1280×800: five sections in order; facts Role and Timeline; two notes; seven screens wired; no
  horizontal overflow. Walked every state: v1-tag → v1-plp-tag, v2-journey → v2-home, the two
  research rows hold v2-home, v3-pill → v3-landing, v3-labels holds v3-landing, v3-nav →
  v3-home-pip, v3-splash, v3-ftux → v3-plp-ftux, v3-pdp.
- 375×812: the mini player appears mid-page and shows the Mall-tab screen at "Bottom-nav entry and
  onboarding"; no horizontal overflow.
- `npm run build` passes; the product-cards page is untouched by this change.

## Open (Uttham)

- `mall-case-study-context.md`: the full case study (v3 blocks — why / how / what worked — the
  research, the leadership layer) and the screen map it names.
- The v3 year, and the Team row (pod size and partner teams).
- Screens for v3-research, v3-labels, v3-landing-active, v3-ocp and v4 if he wants them distinct.
- The old page's "Download the deck (PDF)" link is not in the layout and is gone with it.
