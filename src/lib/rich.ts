// The site's emphasis markup, shared by every surface that prints prose.
// Project rule (CLAUDE.md): long sentences carry their highlights in bold, so a
// reader can skim only the bold and still get the argument.
//   **text**  → the normal highlight
//   ^^text^^  → one bigger beat, used sparingly
//
// PREVIEW MARKS (2026-10-04, the product-cards storyline preview; Uttham: "can
// you create a preview, dont change without my approval, I am not able to
// understand with the text"). A line proposed for his approval is wrapped by
// where its words come from, with a short ID:
//   [[new:C2|text]]   → new wording: a yellow highlight, a tiny NEW tag
//   [[full:P3a|text]] → his own sentence from the gated full study, moved up:
//                       a blue highlight, a tiny FROM FULL STUDY tag
//   [[slot:X1|text]]  → a place only he can fill: a grey dashed box saying
//                       what goes there, a tiny YOURS TO FILL tag
// The fourth mark, a real shopper's words still waiting on consent, is a green
// note (CaseTeaser.astro), not inline markup. A line proposed for a cut is
// left out of the page rather than struck, and a question goes to the preview
// branch's notes file (kept off main, since the repo is public) rather than
// onto the page.
// Hovering a mark shows its ID. Bold and beats work inside a mark; marks never
// nest. With PREVIEW_MARKS off, new and full print as their plain text and a
// slot prints nothing, so the preview can be switched off in one place before
// any of it goes live; `unmark` gives a marked string's plain text (ids, the
// rail). It is off on main: both storylines were approved and merged with every
// mark stripped (2026-10-05); a storyline preview branch turns it on, with
// `preview: true` on the page's data for the banner.
export const PREVIEW_MARKS = false;

const MARK = /\[\[(new|full|slot):([^|\]]+)\|(.+?)\]\]/g;
const TAG = { new: 'NEW', full: 'FROM FULL STUDY', slot: 'YOURS TO FILL' } as const;
// what a mark leaves once the marks are off
const HIDDEN = new Set(['slot']);

export const unmark = (text: string | undefined | null) =>
  (text ?? '').replace(MARK, (_, kind: keyof typeof TAG, _id: string, body: string) => (HIDDEN.has(kind) ? '' : body));

export const rich = (text: string | undefined | null) =>
  (text ?? '')
    .replace(MARK, (_, kind: keyof typeof TAG, id: string, body: string) =>
      PREVIEW_MARKS
        ? `<mark class="pv pv--${kind}" title="${id}" data-pv="${id}">${body}<sup class="pv__tag" aria-hidden="true">${TAG[kind]}</sup></mark>`
        : HIDDEN.has(kind)
          ? ''
          : body
    )
    .replace(/\^\^(.+?)\^\^/g, '<strong class="em em--lg">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="em">$1</strong>');
