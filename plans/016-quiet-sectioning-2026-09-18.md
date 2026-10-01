# Quiet sectioning — 2026-09-18

> **Superseded 2026-10-01 by [plans/024](024-one-section-per-screen-2026-10-01.md)** on the peek: the hero now fills the first screen and nothing of Projects shows in it. The one-heading rule and the highlighter stand.

Uttham: the handwritten chapter label plus sentence headline plus deck reads as the generated-site cliché
("every Claude website is having it"). Reference review (Freiberg, Coursey, Lovin: one plain heading and
whitespace; Kowalski: a small label that *is* the heading; the anti-slop catalog: "remove the eyebrow; the
heading already carries the hierarchy") → option A, approved.

**Implemented.**
- One heading per section: the nav word ("Projects", "AI Space") in the interface sans at the h3 size, one
  content gap above its content, a full section gap below the previous section. No label, no deck. The two
  sentence headlines and the Projects deck are removed. Contact carries no heading: the principles open it
  and "Let's catch up" on the glass is its voice. Caveat is marginalia only again.
- Peek: the first section after the hero sits one small step (`--section-y-sm`) below it so its heading
  shows inside the first fold. Measured at 1440×900 / 1280×800 / 1024×768: "Projects" top at 797 / 752 /
  707 px with the workboard's edge behind it. Projects and AI Space are each taller than a viewport, so
  the next heading cannot peek from their tops without shrinking their content — noted, not forced.
- Highlighter: `mark.hl`, an amber marker stroke (amber-400 at ~70 %, multiplied, tapered ends, clone across
  wraps) on "people and AI agents" in the hero caption. A few words, never a line.
- `docs/design-tokens.md` sectioning guideline replaced; `plans/010`'s label rule is superseded.
