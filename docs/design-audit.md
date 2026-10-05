# Design audit — Phase 1 (read-only)

**Date:** 2026-09-25 · **Status:** audit only, nothing changed. Awaiting approval before Phase 2.

---

## 0. Premise correction

The brief describes "this React/Vite project". **It isn't one.** `package.json` has three
dependencies — `astro`, `gsap`, `lenis`. There is no React, no JSX/TSX, no Tailwind, no CSS
modules, no styled-components. Everything below is written for what the repo actually is:

- **Astro 5.18.2**, 19 `.astro` files, each with an optional scoped `<style>` block
- **One global stylesheet**, `src/styles/global.css` (619 lines), whose `:root` already holds
  **111 custom properties**
- Three rendered routes (`/`, `/work/[slug]`, `/ai/[slug]`) producing 5 pages
- `public/proto/feed-ux/` — a 2.2 MB **pre-built React bundle with no source in this repo**,
  embedded in an iframe

Two consequences for the brief: the Tailwind theme-mapping step is moot, and `*.studio.tsx`
has no meaning here — §6 proposes what replaces it.

**The headline finding: this codebase is already ~90% tokenised.** The brief anticipates a mess
of hardcoded values; the reality is a disciplined single-stylesheet system. Only **four raw hex
values** exist in real site chrome, and every one of them is `#fff`. Phase 2 is therefore much
smaller than the brief assumes — and the real work is elsewhere: two token sources that have
drifted, 47 components that were never extracted from page CSS, and a handful of live bugs this
audit turned up.

---

## 1. Styling approaches in use

| Mechanism | Where | Count |
|---|---|---|
| Global stylesheet | `src/styles/global.css` — all tokens + 26 top-level class rules | 1 file |
| Astro scoped `<style>` | every `.astro` file; `index.astro` alone is 837 lines | 19 blocks |
| `:global()` escapes | reaching `rich()` output, child components, and JS-toggled classes | 27 |
| Inline `style=""` | **all 16 set a CSS custom property**, never a property directly | 16 |
| JS writing style | GSAP inline transforms (`motion.js`), `setProperty` in two previews | 2 writers |

**The cascade split is deliberate and lopsided:** `global.css` owns *material* (`.glass`, `.bolt`,
`.cta`, `.text-link`, `.hl`, `.on-glass`, `.sr-only`, `.skip-link`) plus every token. Components own
*layout*. That split is what makes a token-driven studio viable at all.

**The Astro specificity trap is real and already bites.** A scoped rule gains a
`[data-astro-cid-*]` attribute, so `.glass` at `(0,1,0)` loses to any scoped rule at `(0,2,0)`+.
Consequence for the studio: **CSS custom properties are the only thing that crosses cleanly.**
A studio stylesheet cannot restyle component internals by selector. Every knob must be a variable.

**31 custom properties are defined outside `:root`** — `--tilt`, `--note-tilt`, `--tile-layer`,
`--tape-overhang`, `--k`, `--vh`, `--moto-tilt` and friends. These are local knobs, not tokens, and
they mark the boundary of what the studio should expose globally.

---

## 2. Component inventory

83 components. **Only 16 are real `.astro` files** — 47 exist solely as CSS classes inside a page's
`<style>` block, 10 in `global.css`, 10 inside other components. That gap is the single biggest
obstacle to a studio: *you cannot preview a component that has no component.*

| Level | Count |
|---|---|
| Atom | 38 |
| Molecule | 27 |
| Organism | 18 |

| Component | File | Defined as | Level | Variants | Uses | Pages |
|---|---|---|---|---|---|---|
| `Base` | `src/layouts/Base.astro` | component | organism | 2 | 3 | /, /work/[slug], /ai/[slug] |
| `Header` | `src/components/Header.astro` | component | organism | 1 | 3 | /, /work/[slug], /ai/[slug] |
| `PointerRide` | `src/components/PointerRide.astro` | component | atom | 0 | 1 | /, /work/[slug], /ai/[slug] |
| `GridOverlay` | `src/components/GridOverlay.astro` | component | atom | 0 | 3 | /, /work/[slug], /ai/[slug] |
| `SectionRule` | `src/components/SectionRule.astro` | component | molecule | 2 | 4 | / (Projects, AI Space, Contact, footer) |
| `CaseIndex` | `src/components/CaseIndex.astro` | component | organism | 2 | 2 | / (Projects, currently renders 0 rows), /work/[slug] (More c |
| `InstaxFrame` | `src/components/InstaxFrame.astro` | component | molecule | 5 | 2 | / (hero portrait, contact photo) |
| `HiSticker` | `src/components/HiSticker.astro` | component | atom | 0 | 1 | / (hero, over the portrait's top-right corner) |
| `MotoSticker` | `src/components/MotoSticker.astro` | component | molecule | 4 | 2 | / (contact panel photo: forest, speed) |
| `SignalLoop` | `src/components/SignalLoop.astro` | component | organism | 3 | 1 | / (hero aside) |
| `TownBackdrop` | `src/components/TownBackdrop.astro` | component | molecule | 3 | 1 | / (inside SignalLoop's <svg>) |
| `ResonaPreview` | `src/components/ResonaPreview.astro` | component | organism | 3 | 1 | / (AI Space, Resona card well) |
| `ProtoPreview` | `src/components/ProtoPreview.astro` | component | molecule | 1 | 1 | / (AI Space, Realistic prototype card well) |
| `PageNavigator` | `src/components/PageNavigator.astro` | component | organism | 3 | 0 |  |
| `IntentArtwork` | `src/components/IntentArtwork.astro` | component | atom | 1 | 0 |  |
| `RepurchaseArtwork` | `src/components/RepurchaseArtwork.astro` | component | atom | 2 | 0 |  |
| `.glass` | `src/styles/global.css` | global CSS | atom | 1 | 11 | / (hero slab, 4 tile wells, contact panel), /work/[slug] (ar |
| `.glass-lamp` | `src/styles/global.css` | global CSS | atom | 0 | 1 | / (hero bed, behind the slab) |
| `.bolt` | `src/styles/global.css` | global CSS | atom | 4 | 20 | / (hero slab, contact panel), /work/[slug] (artboard, every  |
| `.cta` | `src/styles/global.css` | global CSS | molecule | 3 | 2 | / (hero 'Download CV'), PageNavigator (orphaned) |
| `.text-link` | `src/styles/global.css` | global CSS | atom | 2 | 6 | / (tile 'Read the case', AI card action), /work/[slug] ('← A |
| `.skip-link` | `src/styles/global.css` | global CSS | atom | 0 | 3 | /, /work/[slug], /ai/[slug] |
| `.sr-only` | `src/styles/global.css` | global CSS | atom | 0 | 1 | / (the h1) |
| `.hl` | `src/styles/global.css` | global CSS | atom | 0 | 2 | / (hero signals line), /work/[slug] (chapter pull-quote mark |
| `.on-glass` | `src/styles/global.css` | global CSS | atom | 0 | 2 | / (contact panel title), site header wordmark |
| `.sticky-piece` | `src/styles/global.css` | global CSS | atom | 0 | 0 |  |
| `.em / .em--lg` | `src/lib/rich.ts` | page CSS | atom | 2 | 9 | / (tile summaries, tool helps, principle bodies), /work/[slu |
| `.wrap` | `src/pages/index.astro` | page CSS | atom | 0 | 4 | / (#work, #ai, #contact, footer) |
| `.section` | `src/pages/index.astro` | page CSS | atom | 0 | 3 | / (#work, #ai, #contact) |
| `.sec-head / .sec-sub` | `src/pages/index.astro` | page CSS | molecule | 0 | 2 | / (Projects, AI Space) |
| `.rv (scroll reveal)` | `src/pages/index.astro` | page CSS | atom | 3 | 8 | / (section heads, tiles, principles sheet, principle items,  |
| `.mask` | `src/pages/index.astro` | page CSS | atom | 0 | 2 | / (hero lead, hero signals caption) |
| `.hero` | `src/pages/index.astro` | page CSS | organism | 0 | 1 | / (#about) |
| `.tile` | `src/pages/index.astro` | page CSS | organism | 2 | 2 | / (Projects: 2 rendered, AI Space: 2 rendered) |
| `.tile-reveal` | `src/pages/index.astro` | page CSS | atom | 0 | 2 | / (Projects, AI Space) |
| `.tiles` | `src/pages/index.astro` | page CSS | molecule | 1 | 2 | / (Projects, AI Space) |
| `.workboard` | `src/pages/index.astro` | page CSS | atom | 0 | 2 | / (Projects, AI Space) |
| `.tape` | `src/pages/index.astro` | page CSS | atom | 0 | 2 | / (every Projects tile, every AI Space tile) |
| `.pill` | `src/pages/index.astro` | page CSS | atom | 0 | 2 | / (Projects tiles, AI Space tiles) |
| `.tile__media` | `src/pages/index.astro` | page CSS | molecule | 3 | 2 | / (Projects, AI Space) |
| `.tile__deck` | `src/pages/index.astro` | page CSS | atom | 0 | 1 | / (Meesho Mall tile) |
| `.tile__cover` | `src/pages/index.astro` | page CSS | atom | 0 | 1 | / (A line of card height tile) |
| `.tile__ph` | `src/pages/index.astro` | page CSS | atom | 0 | 1 | / (would render only for a study with neither deck nor cover |
| `.tool__helps` | `src/pages/index.astro` | page CSS | molecule | 0 | 1 | / (AI Space cards) |
| `.tool__go` | `src/pages/index.astro` | page CSS | molecule | 1 | 1 | / (AI Space cards) |
| `.tool__promptsrc` | `src/pages/index.astro` | page CSS | atom | 0 | 1 | / (AI Space cards) |
| `.prin` | `src/pages/index.astro` | page CSS | organism | 1 | 1 | / (#contact, above the glass panel) |
| `.contact-panel` | `src/pages/index.astro` | page CSS | organism | 1 | 1 | / (#contact) |
| `.note-link` | `src/pages/index.astro` | page CSS | molecule | 1 | 3 | / (#contact: email, LinkedIn, WhatsApp) |
| `.note-row` | `src/pages/index.astro` | page CSS | atom | 0 | 1 | / (#contact) |
| `.footer-sticker` | `src/pages/index.astro` | page CSS | atom | 1 | 1 | / (footer colophon) |
| `.site-footer` | `src/pages/index.astro` | page CSS | molecule | 0 | 1 | / |
| `.case-page` | `src/pages/work/[slug].astro` | page CSS | organism | 0 | 1 | /work/[slug] (2 rendered pages) |
| `.case-hero` | `src/pages/work/[slug].astro` | page CSS | organism | 2 | 1 | /work/[slug] |
| `.eyebrow` | `src/pages/work/[slug].astro` | page CSS | atom | 0 | 10 | /work/[slug] (kicker line, each chapter, Focus, Scope), /ai/ |
| `.back-link` | `src/pages/work/[slug].astro` | page CSS | atom | 0 | 2 | /work/[slug] ('← All projects'), /ai/[slug] (as .guide__back |
| `.case-artboard` | `src/pages/work/[slug].astro` | page CSS | organism | 3 | 1 | /work/[slug] |
| `.deck-cover` | `src/pages/work/[slug].astro` | page CSS | molecule | 0 | 1 | /work/meesho-mall |
| `.cover-card` | `src/pages/work/[slug].astro` | page CSS | molecule | 0 | 1 | /work/a-line-of-card-height |
| `.chapter` | `src/pages/work/[slug].astro` | page CSS | organism | 4 | 1 | /work/[slug] (13 rendered: 6 + 7) |
| `.chapter__figure` | `src/pages/work/[slug].astro` | page CSS | organism | 4 | 1 | /work/[slug] (8 rendered figures) |
| `.chapter__note` | `src/pages/work/[slug].astro` | page CSS | molecule | 2 | 2 | /work/[slug] (8 rendered: 5 notes + 3 verbatims) |
| `.chapter__quote` | `src/pages/work/[slug].astro` | page CSS | atom | 0 | 1 | /work/[slug] (2 rendered) |
| `.chapter__numbers` | `src/pages/work/[slug].astro` | page CSS | molecule | 0 | 1 | /work/meesho-mall (1 rendered, 3 cells) |
| `.chapter__working` | `src/pages/work/[slug].astro` | page CSS | molecule | 0 | 1 | /work/[slug] (9 rendered) |
| `.phone` | `src/pages/work/[slug].astro` | page CSS | atom | 3 | 3 | /work/[slug] (10 rendered: 8 in phone-rows, 1 deck cover, 1  |
| `.phone-row` | `src/pages/work/[slug].astro` | page CSS | molecule | 0 | 1 | /work/meesho-mall (2 rendered, 4 screens each) |
| `.case-details` | `src/pages/work/[slug].astro` | page CSS | molecule | 0 | 1 | /work/[slug] (2 rendered) |
| `.more-cases` | `src/pages/work/[slug].astro` | page CSS | atom | 0 | 1 | /work/[slug] |
| `.guide` | `src/pages/ai/[slug].astro` | page CSS | organism | 0 | 1 | /ai/[slug] (2 rendered pages) |
| `.guide__cols` | `src/pages/ai/[slug].astro` | page CSS | molecule | 0 | 1 | /ai/[slug] |
| `.guide__prompt` | `src/pages/ai/[slug].astro` | page CSS | organism | 0 | 1 | /ai/[slug] |
| `.guide__copy` | `src/pages/ai/[slug].astro` | page CSS | molecule | 0 | 1 | /ai/[slug] |
| `.rp / .rp__phone / .rp__screen` | `src/components/ResonaPreview.astro` | comp. CSS | molecule | 0 | 1 | / (AI Space, Resona card) |
| `Resona app chrome (.rs-bar, .rs-ava, .rs-id, .rs-tags, .rs-icons)` | `src/components/ResonaPreview.astro` | comp. CSS | molecule | 1 | 1 | / (AI Space, Resona card) |
| `Resona .rs-step` | `src/components/ResonaPreview.astro` | comp. CSS | organism | 3 | 5 | / (AI Space, Resona card) |
| `Resona form atoms (.rs-field, .rs-in, .rs-chips, .rs-drop)` | `src/components/ResonaPreview.astro` | comp. CSS | atom | 4 | 6 | / (AI Space, Resona card — setup step) |
| `Resona buttons (.rs-cta, .rs-ghost)` | `src/components/ResonaPreview.astro` | comp. CSS | atom | 4 | 5 | / (AI Space, Resona card) |
| `Resona feedback atoms (.rs-halo, .rs-wave, .rs-prog, .rs-steps)` | `src/components/ResonaPreview.astro` | comp. CSS | molecule | 2 | 4 | / (AI Space, Resona card — record and synth steps) |
| `Resona content atoms (.rs-search, .rs-seg, .rs-h, .rs-promo, .rs-rec, .rs-ins, .rs-fold, .rs-sheet, .rs-note, .rs-listen)` | `src/components/ResonaPreview.astro` | comp. CSS | molecule | 6 | 12 | / (AI Space, Resona card) |
| `.pp / .pp__phone / .pp__stage / .pp__frame` | `src/components/ProtoPreview.astro` | comp. CSS | molecule | 0 | 1 | / (AI Space, Realistic prototype card) |
| `.pp__open` | `src/components/ProtoPreview.astro` | comp. CSS | atom | 0 | 1 | / (AI Space, Realistic prototype card) |
| `.case-art` | `src/components/IntentArtwork.astro` | comp. CSS | atom | 3 | 0 |  |

**Three components ship nothing** — `PageNavigator.astro` (430 lines), `IntentArtwork.astro` and
`RepurchaseArtwork.astro` are imported by no page and are absent from the built output. Decide
whether the studio previews them or they get deleted.

---

## 3. Duplicates and near-duplicates

17 groups. **Nothing merged — this is a list for your decision.** The six that matter most:

### 3.1 The phone frame — built 4 times
| Where | Aspect | Radius |
|---|---|---|
| `src/pages/index.astro:765` `.tile__deck` | 9/15 | `18px 18px 0 0` |
| `src/components/ResonaPreview.astro:218` `.rp__phone` | 9/15 | `18px 18px 0 0` |
| `src/components/ProtoPreview.astro:72` `.pp__phone` | 9/15 | `18px 18px 0 0` |
| `src/pages/work/[slug].astro:292` `.phone` | **9/18** | **`--radius-media` (24px, all corners)** |

The first three are byte-identical on seven declarations; `18px` exists in no token. **The fourth is
a different object** and must not be merged into the same token — see §7 blockers.

### 3.2 The preview well wrapper — an exact duplicate
`.rp` (ResonaPreview:206) and `.pp` (ProtoPreview:59) are the **same eight declarations in the same
order**. Zero differences. Both exist only to cancel the uppercase/centred/tracked text that
`.tile__media` applies.

### 3.3 The 320px scaler script — copy-pasted
`ResonaPreview:157` and `ProtoPreview:45` are character-identical apart from the selector name and
one parameter. *(Merging these is component behaviour — out of scope by your own line. Listed for
completeness only.)*

### 3.4 The uppercase micro-label — 13 implementations
12px / 500 / 0.06em / uppercase / `--ink-600`, re-declared from scratch in thirteen places with no
shared class. `work/[slug].astro:202` and `ai/[slug].astro:74` are byte-identical.
**Caution:** `.prin__tag` is 14px and `.cta` is 14px/600 — they are *not* the same label.

### 3.5 The bold highlight `.em` — 7 identical rules across 4 files
`color: var(--ink-900); font-weight: 600`, repeated verbatim. Each exists because `rich()` output
ships with **no** `data-astro-cid`, so a scoped rule in one component cannot reach another's markup.

### 3.6 Others
The amber sticky note (4 impls, two different ambers), the white paper sheet (3, differing only in
border ink), the bolted glass panel (5 sites × 4 hand-written bolt spans = 20 identical lines, with
**three** different padding recipes), the outlined pill (3, one a bare `li` selector that leaks
across a page), the dark chip, the media well, the image-on-glass card (3 radii), the em-dash list
(3), the arrow nudge (3, one is 3px instead of 4px).

---

## 4. Hardcoded design values

107 distinct literals. **40 are marked keep-raw** (see §8), leaving **67 candidates**.

| Category | Distinct literals |
|---|---|
| Spacing | 37 |
| Colour | 25 |
| Other (durations, breakpoints, transforms, z-index) | 25 |
| Font size | 8 |
| Shadow | 5 |
| Line height | 3 |
| Radius | 3 |
| Font weight | 1 |

### Colour is essentially clean
Only **four** raw hex values in real site chrome, all `#fff`
(`index.astro:774`, `work/[slug].astro:279,292`, `ProtoPreview.astro:82`) → `--paper-1`.
`HiSticker.astro:7-8` bakes `#C8871F` / `#F3B44A` as SVG attributes — byte-exact matches for
`--amber-700` / `--amber-500`, but unreachable by CSS.

### Near-identical clusters worth collapsing
| Cluster | Collapse to | Note |
|---|---|---|
| `#fff` ×3 | `#ffffff` (`--paper-1`) | safe |
| `rgba(255,255,255,0.55)` ×2 | `0.6` | sheen |
| `rgba(255,255,255,0.35)` | `0.3` | sheen |
| `rgba(58,55,46,.55)` / `.65` | pick one | artwork stroke — **a visible change** |
| `1.6` line-height | `1.55` (`--lh-body`) | `ai/[slug].astro:83` |
| `1.25` line-height | `1.15` (`--lh-heading`) | **BLOCKER — see §7** |
| `outline-offset: 4px` ×3 | `2px` | **BLOCKER — see §7** |
| `translateX(3px)` | `4px` | **a rendered change** |
| `650/660/680px` breakpoints | `640px` | 3 one-off breakpoints |
| `100ms` ×4 | `--dur-1` (150ms) | **a rendered change** |
| `scale(0.98/0.97/0.96)` | `0.98` | press feedback |

Breakpoints are the messiest axis: `global.css` re-declares layout tokens at 900/640/360 while
components branch at 1024, 1023, 901, 767, 641, 640, 639 and 560. **Untokenised and inconsistent.**

---

## 5. Proposed tokens

### 5.1 Foundation tier — keep the existing names

**Decision (2026-10-01): do NOT rename to the brief's `--color-*` / `--space-*` scheme.** This
was the recommendation; the owner has now chosen it — "keep consistent tokenised elements". The
existing names stay. See §10, decision 1.

The brief's example names imply a rewrite of ~900 `var()` references across 22 files. Worse, it
would orphan **207 token-name mentions across 13 prose files** in `plans/` and
`docs/design-tokens.md` — the design rationale archive, which no codemod can touch. `plans/023`
argues about `--section-y` by name; `plans/008` about `--bolt-content-inset`. Renaming turns that
archive into fiction.

The existing scheme is already a foundation tier in everything but name:
`--paper-*`, `--ink-*`, `--amber-*`, `--line-*` (colour) · `--text-*`, `--track-*`, `--lh-*`,
`--font-*` (type) · `--space-1..12` + the rhythm ladder (spacing) · `--radius-*` · `--shadow-*` ·
`--dur-*`, `--ease-*` (motion).

**Cost of keeping:** the studio's UI must group by prefix rather than by a `--color-` namespace —
a mapping table in the studio, not a migration. That is the cheap side of the trade by a wide margin.

### 5.2 Component tier — this is what's genuinely missing

**There are currently zero component-level tokens.** Every component reads foundations directly, so
"change the primary CTA background without changing every amber thing" is impossible today. This is
the real deliverable of Phase 2.

```css
/* CTA */
--cta-primary-bg:      var(--amber-500);
--cta-primary-ink:     var(--ink-900);
--cta-radius:          var(--radius-control);
--cta-sheen:           rgba(255, 255, 255, 0.3);

/* Tile / card */
--tile-bg:             var(--paper-1);
--tile-edge:           var(--line-1);
--tile-edge-hover:     rgba(22, 20, 14, 0.3);   /* NOT --line-mark, see §7 */
--tile-radius:         var(--radius-sm);
--tile-pad:            var(--card-padding);
--tile-shadow:         var(--shadow-rest);

/* Pill */
--pill-edge:           var(--line-1);
--pill-ink:            var(--ink-600);
--pill-radius:         var(--radius-pill);

/* Text link */
--link-ink:            var(--ink-900);
--link-rule:           var(--amber-700);
--arrow-nudge:         4px;                      /* ProtoPreview is 3px today — a change */

/* Glass panel */
--glass-fill / --glass-edge / --glass-blur       /* already exist */
--panel-pad:           var(--bolted-panel-padding);

/* Media well */
--well-aspect:         4 / 3;
--well-pad-block:      var(--space-5);           /* bottom MUST stay 0 — see §7 */

/* Sticky note */
--note-bg:             var(--amber-400);
--note-radius:         var(--radius-sm);
--note-shadow:         var(--shadow-stuck);

/* Phone frame (the three 9/15 ones only) */
--phone-aspect:        9 / 15;
--phone-radius:        18px 18px 0 0;
--phone-bg:            var(--paper-1);
```

---

## 6. File plan for Phases 2–4

| Path | Phase | Purpose |
|---|---|---|
| `src/design/tokens.json` | 2 | Single source of truth, both tiers, with `$value` + `$note` |
| `src/styles/tokens.css` | 2 | **Generated to disk**, imported by `Base.astro` |
| `scripts/gen-tokens.mjs` | 2 | tokens.json → tokens.css; runs on `predev` and `prebuild` |
| `src/studio/StudioPage.astro` | 3 | **Outside `src/pages/`** — see below |
| `src/studio/integration.mjs` | 3 | `injectRoute` gated on `command === 'dev'` |
| `src/studio/vite-studio.mjs` | 3 | Vite plugin, `apply: 'serve'`, POST `/__studio/save` |
| `src/design/manifest.json` | 4 | Generated inventory |
| `scripts/gen-manifest.mjs` | 4 | Scans `src/`, runs on dev start and build |
| `src/**/*.studio.ts` | 4 | Variant/state declarations — **`.ts`, not `.tsx`** |
| `scripts/guard-tokens.mjs` | 4 | Build guard |
| `design-guard-allowlist.json` | 4 | Justified exceptions |

**Generated to disk, not a virtual module** — so the tokens are greppable in `src/`, carry their
`$note` comments, and survive a cold start.

**Dev-only routing (empirically verified on 5.18.2, not assumed):**
- `import.meta.env.DEV` does **not** remove a page from the build — a guarded probe page still
  emitted `dist/zzprobe/index.html`.
- A filename starting with `_` *is* excluded from routing (`core/routing/manifest/create.js:82`).
- **The working mechanism:** `injectRoute` inside `astro:config:setup` gated on
  `command === 'dev'`, with the page file living **outside `src/pages/`** (or file-based routing
  builds it anyway). Verified: 200 in dev, zero build output.
- **The save endpoint:** `astro:server:setup` + `server.middlewares.use('/__studio/save', …)`.
  The hook never fires during `astro build`, so it is structurally absent — no flag to forget.
- `src/pages/api/*.ts` is the **wrong** answer: this project is static output with no adapter, so
  an endpoint prerenders to a file and POST is not servable.

**`*.studio.ts`, not `.tsx`** — there is no React. A plain `.ts` module exporting a variant/state
array, consumed by one generic Astro renderer, is the Astro-native equivalent. **It must not live
in `src/pages/`**, or Astro will route and build it.

---

## 7. Blockers found by adversarial review

The synthesis pass proposed several tokens that **would change rendered output**, violating your
"must not change how the site looks" constraint. Three verifiers caught them. Each needs your call
before Phase 2:

| # | Proposed | Live value | What breaks |
|---|---|---|---|
| 1 | `--em-lg-lh: var(--lh-heading)` = 1.15 | `1.25` (`work/[slug].astro:288`) | Re-leads **10 `^^` beats** |
| 2 | `--focus-ring-offset: 2px` | `4px` at `.tile`, `.tool__go`, `.note-link` | **Halves 3 focus rings** |
| 3 | `--glass-fill-opaque` cool grey | warm `(250,248,243)` (`global.css:613`) | **Temperature flip** for reduced-transparency users on 5 surfaces |
| 4 | Split `.glass` background into sheen + fill | single `background` shorthand | The reduced-transparency override stops removing the sheen |
| 5 | `--phone-aspect`/`--phone-radius` on `.phone` | 9/18, 24px all corners | **Re-crops every phone screenshot** |
| 6 | `--well-pad-deck: var(--space-5)` | `var(--space-5) var(--space-5) 0` | Loses the `0` bottom — **phone stops standing flush** (CLAUDE.md) |
| 7 | `--well-aspect-tool` at ≤640px | real breakpoint is **560px** | Changes the AI well from 561–640px |
| 8 | `--arrow-nudge: 4px` | 3px in ProtoPreview | Rendered change sold as a dedupe |
| 9 | `--phone-k: 0.8` | 0.7 in ResonaPreview | Changes first paint before JS runs |
| 10 | Unit normalisation (`8s` for `8000ms`) | `pointer-ride.js:463` `parseFloat` | **LINGER becomes 8ms** — the `\|\| 8000` guard never fires |

Two further corrections to the plan itself:

- **HMR will not be silent.** In Astro 5.18.2 a CSS edit **always triggers a full page reload**
  (`vite-plugin-astro-server/css.js:20-23` SSR-imports stylesheets with `?inline`). Your brief asks
  for "No reload" on live edit — that is satisfied by the **postMessage path**, not by HMR. Saving
  will reload the page. Worth knowing before Phase 3.
- **`dist/` will not contain a plain `tokens.css`.** Astro bundles imported CSS into content-hashed
  chunks (`dist/_astro/index.C7AUzvu6.css` etc.). The Phase 2 exit test must compare **normalised
  CSS text**, not `dist/` bytes.

---

## 8. Risks — what cannot be tokenised cleanly

1. **The washi tape** — `public/assets/stickers/washi.svg` is loaded via `<img src>`, so no CSS
   variable, rule or `currentColor` reaches inside it. Its cyan palette exists in no token.
2. **SignalLoop** — `readFileSync`s the rider SVG at build, string-replaces six known hexes, and
   **throws a build error if the fill counts change**. A blind "retokenise the SVGs" pass fails the
   build by design. It also breaks if `outDir` moves (verified: ENOENT).
3. **`/proto/feed-ux`** — 2.2 MB pre-built bundle, no source, 148 hex literals in its CSS. It is an
   **iframe**, so custom properties do not cross the document boundary. Out of reach, permanently.
4. **ResonaPreview / ProtoPreview** — deliberately another product's design language (CLAUDE.md).
   **But ResonaPreview is not hermetic:** it still inherits `--font-paper`, `--dur-3`,
   `--ease-standard`, `--line-1`, `--shadow-rest`. Editing site motion or type silently changes it.
5. **GSAP owns `transform`** on `[data-magnetic]` (5 cards), written inline every pointer frame.
   Inline style beats everything short of `!important`. **The studio must never touch transform
   on those.**
6. **Motion tokens are duplicated as JS numbers** — `motion.js:10-11` hardcodes
   `DUR = {micro:0.15, standard:0.22, …}` mirroring `--dur-1..4`. Editing the CSS token
   desynchronises GSAP.
7. **`pointer-ride.js` bakes sprites at init** from `--graphite` and `--dust-alpha`
   (the gas since 2026-10-05). Live edits do nothing until reload.
8. **The grain** — a custom property cannot be interpolated into a `url("data:…")`. The ink,
   frequencies, seeds and 38 hand-authored fibres are literal, and the recipe is duplicated.
9. **16 raster screenshots** of real product UI are colour-baked. `--mall-purple` / `--mall-lavender`
   were sampled *from those pixels* — moving them makes panel and screenshot drift apart.
10. **No `prefers-color-scheme` anywhere.** If the studio offers a dark theme, the photos, the
    screenshots and the washi tape are exactly what will not follow.

---

## 9. Live bugs this audit found (not studio work)

Surfaced while reading; each is a real defect today. **None fixed** — flagging only.

1. **`docs/design-tokens.json` is stale and would corrupt Phase 2 if used as the source.**
   8 value conflicts, all CSS-new / JSON-old — including `--paper-0` `#e9ebec` vs `#FAF9F4` and
   `--paper-2` `#dbdee0` vs `#F0ECE3`. Generating CSS from it **would flip the entire page
   background from cool grey to warm cream**. 18 live variables are missing from it; 4 entries are
   dead. **Recommendation: `src/styles/global.css` becomes the formal source; delete the JSON.**
2. **The reduced-transparency glass fallback is the wrong temperature** — `global.css:615` is still
   warm cream `rgba(250,248,243,0.97)` on the now-cool `#e9ebec` board. The paper retune missed it.
3. **Two contrast figures in the docs are wrong and one is now failing.** Both were computed against
   the retired `#FAF9F4`. On the live board `--ink-400` is **2.96:1** — under the 3:1 large-text
   floor the docs license it for.
4. **Two phantom variables** — `CaseIndex.astro:52` reads `var(--amber-600, …)` and
   `ai/[slug].astro:75` reads `var(--text-h1, …)`. Neither is defined; both silently render the
   fallback. A studio that *defines* them would change the page.
5. **`.cta:active` reads a per-element tilt.** Splitting `--cta-tilt` into two `:root` tokens would
   make the second button snap on press.
6. **Dead weight:** 14 `:root` tokens have no consumers, 3 components are imported nowhere,
   7 SVGs in `public/` are referenced nowhere, `--radius-card` (16px) has zero consumers, and
   `docs/design-tokens.html` + `docs/design-tokens-guide.html` are byte-identical stale copies
   freezing the 2026-09-16 palette. **Five artifacts claim to describe the token set.**

---

## 10. Open decisions — I need your call

**Status (2026-10-01):** decision 1 is decided. **Decisions 2–6 are still open**, and **Phase 2
(the migration in §5.2 and §6) has NOT started** — no `tokens.json`, no generator, no component
tokens, no relocation.

1. **Token naming — DECIDED 2026-10-01: keep** `--ink-900` / `--paper-1` / `--space-5` /
   `--section-y` and the rest of the existing names. The owner's words: "keep consistent tokenised
   elements". The brief's `--color-*` / `--space-*` rename is off the table. **Consequence:** the
   future studio **groups tokens by prefix through a mapping table** (§5.1); there is **no codemod**,
   the ~900 `var()` references stay as written, and the 207 token-name mentions in the `plans/`
   archive and `docs/design-tokens.md` **stay true**.
2. **The 10 blockers in §7** — each is a pixel change. Approve individually, or hold them all and
   ship Phase 2 as pure relocation?
3. **The 47 inline components** — extract them to real `.astro` files so the studio can preview
   them, or have the studio render page-scoped classes in a synthetic harness? *(Extraction is
   markup rewriting, which you reserved.)*
4. **Component merges in §3** — all 17 are listed, none done. Which, if any?
5. **`docs/design-tokens.json`** — delete it, or regenerate it from `global.css` as an export?
6. **The 3 unused components** — preview them in the studio, or delete?

---

## 11. What I did not do

No file in `src/`, no token, no component and no config was changed. `astro.config.mjs` and
`package.json` are byte-identical to their committed state; `npm run build` passes with the same
5 pages. One audit agent created probe files under `src/design/` to verify Astro's dev-only routing
empirically and removed them before finishing — verified gone, and the build confirms it.

**One caveat on "no foundational changes":** the spacing pass you asked for earlier today is still
in the working tree — `--section-y`, `--section-y-hero`, `--head-gap` and `--card-padding` in
`src/styles/global.css` (`plans/023`). That predates this audit and was your request, so I have left
it. Say the word and I will revert it. *(Point-in-time note: `--section-y-hero` was retired on
2026-10-01 by `plans/024` and is no longer in `global.css`; `--section-pad` took its place in the
ladder.)*
