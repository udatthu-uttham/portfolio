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

export type CaseStep = { state?: string; label: string; text: string }; // a labelled ruled row; highlights in **bold**
export type CaseRow = { state?: string; text: string }; // one ruled row of prose; highlights in **bold**

export type CaseBlock =
  | { kind: 'p'; text: string } // a paragraph; highlights in **bold**
  | { kind: 'steps'; heading?: string; lead?: string; steps: CaseStep[] } // an optional h3 and lead line over ruled rows
  | { kind: 'quote'; text: string; source: string; consent?: boolean } // a sticky note; consent: false keeps it off the page
  | { kind: 'inside'; lead: string; items: string[] } // "In the full case study:" and its list
  | { kind: 'rows'; heading?: string; lead?: string; rows: CaseRow[] } // ruled rows of prose, each its own trigger (the AI Space pages)
  | { kind: 'prompt'; text: string; copy: string } // the prompt card: a preview of `text` and a button (`copy` its label) that copies all of it
  | { kind: 'gate' }; // the light-gate card (needs `gate` on the page)

export type CaseSection = { state?: string; heading: string; blocks: CaseBlock[] };

export type Experiment = {
  state: string;
  title: string;
  status?: string; // omitted while the brief marks it open
  why: string;
  how?: string; // omitted while the brief marks it open
  worked?: string; // omitted while the brief marks it open
};

export type CaseTeaserData = {
  title: string;
  dek: string; // `{source}` becomes the sourced link below
  source?: { label: string; href: string; title: string };
  back?: { href: string; label: string }; // defaults to "← All projects"
  visit?: { href: string; label: string }; // a live thing to open in its own tab, under the facts ("Open the prototype ↗")
  facts: { label: string; value: string }[];
  sections: CaseSection[];
  gate?: { text: string; cta: string };
  experiments?: Experiment[]; // the full study behind the gate; none → the card has no button
  screens?: {
    dir: 'plp' | 'mall-case'; // a folder under src/assets/ holding this page's screens
    map?: Record<string, string | string[]>; // state → file name, when it is not the state's own name; several play in turn, a beat (or a clip) each
    videos?: Record<string, string>; // file name → an MP4 under public/ that plays once each time that screen arrives; the file's still is its poster and the frame it settles on
    alts: Record<string, string>; // state or file name → what its screen shows (a file's own wins, e.g. the second of a state's screens)
    titles?: Record<string, string>; // state or file name → the short title on the card, above the phone (a state's first screen takes the state's, a later one its file's)
  };
  // The scroll points: by default every section and sub-group heading. A page
  // can limit them to the top of the page and the sections it names (Uttham,
  // 2026-10-02: "the scroll stepper should also have limited things").
  rail?: { top?: boolean; sections: string[] };
  panelLabel?: string; // the preview's accessible name
};
