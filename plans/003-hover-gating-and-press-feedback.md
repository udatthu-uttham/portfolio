# 003 — Gate hover motion to fine pointers and add press feedback

- **Status**: DONE — checked 2026-09-06
- **Commit**: no VCS — written 2026-09-04
- **Severity**: MEDIUM
- **Category**: Accessibility · Physicality & origin · Interruptibility
- **Estimated scope**: 3 files (`src/pages/index.astro`, `src/styles/global.css`, `src/components/Header.astro`), ~40 lines moved/added

## Problem

Hover motion is ungated, so on touch a tap leaves elements in their hover state (sticky hover):

```css
/* src/pages/index.astro:559 — current */
.tile:hover { transform: translateY(-2px); box-shadow: var(--shadow-lift); border-color: rgba(22, 20, 14, 0.3); }
/* :623 */ .tile:hover .tile__arr { transform: translateX(4px); }
/* :747 */ .note-link:hover { rotate: 0deg; translate: 0 -4px; box-shadow: 0 16px 22px -10px rgba(22, 20, 14, 0.3); }
/* src/styles/global.css:387, 415, 433, 455 */ .cta:hover, .cta--primary:hover, .cta--ghost:hover, .cta--glass:hover { … }
/* src/components/Header.astro:135 */ .site-header__nav a:hover::after { transform: scaleX(1); }
```

Pressable cards and notes have no `:active` state anywhere, so touch users get no acknowledgement of a tap. The CTA's press and release share one duration (`transform var(--dur-1)`), so the deliberate press and the system's snap-back feel identical.

## Target

```css
/* every hover rule above, unchanged, wrapped once per file in: */
@media (hover: hover) and (pointer: fine) { /* …hover rules… */ }

/* press feedback — subtle, transform only */
@media (hover: none), (pointer: coarse) {
  .tile:active { transform: scale(0.98); }          /* GSAP owns transform on fine pointers, so coarse only */
}
.note-link:active {                                   /* pressed flat: tilt returns, lift gone, shadow shrinks */
  rotate: var(--note-tilt);
  translate: 0 0;
  box-shadow: 0 4px 8px -6px rgba(22, 20, 14, 0.3);
  transition-duration: 100ms;
}

/* asymmetric CTA timing: deliberate press, snappy release */
.cta { transition: transform 100ms var(--ease-standard), box-shadow 100ms var(--ease-standard); }
.cta:active { transition-duration: var(--dur-1); }
```

## Repo conventions to follow

- The coarse-pointer block already exists in `index.astro` (`@media (hover: none), (pointer: coarse) { .tile { transition: … } }`) — add `.tile:active` inside it.
- Tokens: `--dur-1` (150ms), `--ease-standard`; the note's tilt variable is `--note-tilt` (set inline per note).
- Exemplar of a gated hover: none yet in the repo; follow the AUDIT pattern `@media (hover: hover) and (pointer: fine) { .element:hover { … } }`.

## Steps

1. `index.astro`: move `.tile:hover`, `.tile:hover .tile__arr`, `.note-link:hover` into one `@media (hover: hover) and (pointer: fine)` block placed right after the existing coarse-pointer block; add `.tile:active` inside the coarse block; add `.note-link:active` after `.note-link:focus-visible`.
2. `global.css`: move the four `.cta*:hover` blocks into one `@media (hover: hover) and (pointer: fine)` block after `.cta--glass:active`; split `.cta--ghost:hover, .cta--ghost:active` so `:active` stays ungated. Change `.cta`'s transition durations to `100ms` and add `.cta:active { transition-duration: var(--dur-1); }`.
3. `Header.astro`: wrap `.site-header__nav a:hover::after` in the same media query.

## Boundaries

- Do NOT change hover values — only where they apply.
- Do NOT add `:active` transforms for `.tile` on fine pointers (GSAP writes inline `transform` every frame there).
- Do NOT touch focus-visible rules.

## Verification

- **Mechanical**: `npm run build`; in DevTools emulate a touch device (Sensors → touch), tap a tile and a note: nothing stays lifted after the tap; a 150ms `scale(0.98)` appears during the press.
- **Feel check**: with a mouse, hover/press a CTA — the press eases in over 150ms, the release snaps in 100ms; spam-click a note and the transition retargets without restarting from zero.
- **Done when**: no `:hover` rule outside the media query in the three files, `.tile:active` and `.note-link:active` exist, and the CTA base transition reads `100ms`.
