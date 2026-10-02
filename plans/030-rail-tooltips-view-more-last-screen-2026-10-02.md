# Tick rail with tooltips, "View more", the prototype's idea, the last screen — 2026-10-02

Uttham: "the sticky notes as scroll points in l2 is weird lets do the one you initially made but
the active or hover state show these as tooltips. also the prototype is failiing to show the
images and it is glitching please fix that. remove want to change for your team section, and the
prompt I believe is whtelablelled. also the ai cards should not have copy the plan as CTA, view
more should be the CTA for it. emphasis the idea of this prototype which has linkage to meesho
services that fetches realtime production data for actual users, all the values are connected to
backend table and proper logics are set in place to make this a realistic prototype. also reduce
the space between footer and last section., so whole contact with footer can come in one viewport"

## Implemented

- **Scroll points: the tick rail is back** (`CaseTeaser.astro`, `.ct-points`), in the right
  gutter as in 759e3f2. The bookmark tabs and the pane's tab column are gone. **The current tick
  and the hovered or focused tick show their title as a small paper tooltip**, one at a time
  (hovering another tick hides the current one's). Sub-groups get a shorter tick. The links carry
  `aria-label`; the tooltip is decoration. The rail box ignores the pointer, so the phone and page
  under it stay live (checked with `elementFromPoint`).
- **Prototype images** (`public/proto/feed-ux`, e29f1b1): the build rendered 1,353 `<img>`
  eagerly, all from images.meesho.com; the CDN closed connections under the burst
  (`ERR_CONNECTION_CLOSED` / `ERR_QUIC_PROTOCOL_ERROR`) and the app's `onError` swapped the
  failures to its placeholder, which read as broken images and flicker. Every `img` call in the
  bundle now carries `loading:"lazy", decoding:"async"` (83 of 83). After: 0 broken of 815 loaded,
  the rest wait for the scroll. The source lives outside the repo; rebuilding it from source will
  drop the patch unless the same attributes go into the source.
- **AI teasers end on the prompt**: "What to change for your team" and `guide.adapt` are gone.
- **The prototype's idea opens its teaser** as "The idea", his words with grammar fixed, the
  claim as the page's one `^^` beat (`tools.ts` `idea`).
- **AI cards: "View more →"** in the "Read the case" style; the copy buttons, hidden textareas
  and their script are gone. The title's stretched link still opens the whole card.
- **Contact and the footer share the last screen** (`index.astro`): Contact has no bottom pad and
  a min-height that leaves the footer room; the footer pads `--section-y-sm` / `--card-padding`
  (the 96px bottom pad was for a page navigator that is no longer on the page); a jump to
  `#contact` lands its content one `--space-6` under the header. The photo budget was re-measured:
  412px of everything else, plus `--space-6` of air and the footer.

## Verification (dev server, built-in browser)

| Viewport | Content + footer | Available | Air under header | Photo |
|---|---|---|---|---|
| 1024×768 | 670 | 692 | 22 | 150 |
| 1280×800 | 673 | 724 | 51 | 150 |
| 1366×768 | 686 | 692 | 6 | 150 |
| 1440×900 | 767 | 824 | 57 | 238 |
| 1512×982 | 856 | 906 | 50 | 319 |
| 1536×864 | 755 | 788 | 33 | 201 |
| 1920×1080 | 902 | 1004 | 102 | 340 |

- Header "Contact" jump at 1440×900 lands at the page's end with the footer's bottom on the
  viewport's bottom edge.
- Both "View more" actions hit the card's link (`/ai/resona`, `/ai/realistic-prototype`); no
  horizontal overflow at 375px.
- `/work/a-line-of-card-height`: the current tick shows its tooltip; keyboard focus on another
  tick crossfades to it. `/ai/realistic-prototype`: The idea → How it helps → What you get → What
  you need → The prompt, five ticks; the feed's images load in the phone.
- `npm run build` passes.

## Open (Uttham)

- **The idea vs the synthetic-data rule.** CLAUDE.md still says every AI Space preview renders
  invented data, and the guide's "What you need" and its prompt tell readers to mock the
  catalogue. The new line says the prototype fetches real-time production data for actual users.
  The rule was not changed; it is his to retire or keep.
- **The photo is smaller on laptops** (1440×900: 301 → 238px; 1280×800: 234 → 150px). That is
  the price of the footer on the same screen.
