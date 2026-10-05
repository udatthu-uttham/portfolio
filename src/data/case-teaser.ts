// The shape of a teaser page — the layout Uttham drew for the case studies
// (2026-10-01) and reused for the AI Space tools: sections of text on the left,
// a sticky preview on the right that follows the reading, and an optional full
// study behind a light gate. Rendered by src/components/CaseTeaser.astro.
//
// Any element with a `state` drives the preview: in screens mode it picks the
// screens `screens.map[state] ?? state` from `src/assets/<screens.dir>/` (one
// file, or several that play in turn), each shown whole — never cropped; with
// a `preview` slot (a live tool) it is announced as a `case:state` event
// instead.

// A shopper's own words on a sticky note. consent: false keeps it off the page
// (on a preview page it shows, labelled as needing his consent); a translation,
// when the words are not in English, sits under them; a placeholder (preview
// only) is a dashed empty note saying where one of his verbatims could go.
export type CaseQuote = { text: string; source: string; translation?: string; consent?: boolean; placeholder?: boolean; id?: string };
// a labelled ruled row; highlights in **bold**. `why` is the row's one reason,
// a line under its text, always labelled "Why this design:"; `quote` a
// verbatim on a note in the row
export type CaseStep = { state?: string; label: string; text: string; why?: string; quote?: CaseQuote };
export type CaseRow = { state?: string; text: string }; // one ruled row of prose; highlights in **bold**

export type CaseBlock =
  | { kind: 'p'; text: string } // a paragraph; highlights in **bold**
  | { kind: 'steps'; heading?: string; lead?: string; steps: CaseStep[] } // an optional h3 and lead line over ruled rows
  | ({ kind: 'quote' } & CaseQuote) // a sticky note; consent: false keeps it off the page
  // several insights from one source, one sticky card each, side by side
  // (Uttham, 2026-10-05: "when you have multiple insights create multple
  // cards, like the house holde review of lucknow has 3 insights")
  | { kind: 'quotes'; id?: string; source: string; items: (CaseQuote & { insight?: string })[] }
  | { kind: 'inside'; lead: string; items: string[] } // "In the full case study:" and its list
  | { kind: 'rows'; heading?: string; lead?: string; rows: CaseRow[] } // ruled rows of prose, each its own trigger (the AI Space pages)
  | { kind: 'prompt'; text: string; copy: string } // the prompt card: a preview of `text` and a button (`copy` its label) that copies all of it
  | { kind: 'gate' }; // the light-gate card (needs `gate` on the page)

export type CaseSection = { state?: string; heading: string; blocks: CaseBlock[] };

// A handwritten note beside the case card's phone, as the homepage tiles have
// them (Uttham, 2026-10-03: "the framework card should come inside the image,
// and the wordings outside as you did on home page"): `text` is a few words,
// never a number; `y` is where its arrow's tip lands on the screen's left edge,
// as a fraction of THAT screen's height (0 = top, 1 = bottom). The words stand
// left of the arrow, on the page, never over the screen.
// A note beside the phone: its line starts ON the thing it names, inside the
// screen, at (x, y), and runs out to its words, which stand at `ty` in the
// notes column (shares of the screen's width and height; `ty` defaults to y).
// `isNew` (preview only): a draft note the live page does not have, shown on
// the yellow of new wording so the preview's legend holds for the notes too.
export type ScreenNote = { text: string; y: number; x?: number; ty?: number; isNew?: boolean };

export type Experiment = {
  state: string;
  title: string;
  status?: string; // omitted while the brief marks it open
  why: string;
  how?: string; // omitted while the brief marks it open
  worked?: string; // omitted while the brief marks it open
  quote?: CaseQuote; // a verbatim on a note under What worked, its evidence; consent: false keeps it off the page
};

export type CaseTeaserData = {
  title: string;
  dek: string; // `{source}` becomes the sourced link below
  source?: { label: string; href: string; title: string };
  back?: { href: string; label: string }; // defaults to "← All projects"
  visit?: { href: string; label: string }; // a live thing to open in its own tab, under the facts (no page passes one since 2026-10-03)
  callout?: string; // a live phone's short line above the device, e.g. that the tool can be used right there
  facts: { label: string; value: string }[];
  sections: CaseSection[];
  gate?: { text: string; cta: string };
  experiments?: Experiment[]; // the full study behind the gate; none → the card has no button
  screens?: {
    dir: 'plp' | 'mall-case'; // a folder under src/assets/ holding this page's screens
    map?: Record<string, string | string[]>; // state → file name, when it is not the state's own name; several play in turn, a beat (or a clip) each, or with reduced motion as the reading passes through the row
    videos?: Record<string, string>; // file name → an MP4 under public/ that plays once, from its first frame, each time that screen arrives; the file's still is its poster (reduced motion) and the frame it settles on, never the one it opens on
    alts: Record<string, string>; // state or file name → what its screen shows (a file's own wins, e.g. the second of a state's screens)
    titles?: Record<string, string>; // state or file name → the short title on the card, above the phone (a state's first screen takes the state's, a later one its file's)
    notes?: Record<string, ScreenNote[]>; // file name → handwritten notes beside the phone while that screen shows, in priority order
  };
  // The scroll points: by default every section and sub-group heading. A page
  // can limit them to the top of the page and the sections it names (Uttham,
  // 2026-10-02: "the scroll stepper should also have limited things").
  rail?: { top?: boolean; sections: string[] };
  panelLabel?: string; // the preview's accessible name
  // A storyline preview for Uttham's approval (2026-10-04): a banner says the
  // page is not live and what the marks mean (src/lib/rich.ts), and verbatims
  // still waiting on consent show, labelled. Never set on a page that is live.
  preview?: boolean;
};
