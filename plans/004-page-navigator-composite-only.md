# 004 — PageNavigator: animate compositor properties only

- **Status**: DONE — checked 2026-09-06
- **Commit**: no VCS — written 2026-09-04
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/PageNavigator.astro`), ~8 lines

## Problem

```css
/* src/components/PageNavigator.astro:54–58 — current */
transition:
  max-width var(--dur-2) var(--ease-standard),   /* layout */
  gap var(--dur-2) var(--ease-standard),         /* layout */
  transform var(--dur-1) var(--ease-standard),
  box-shadow var(--dur-1) var(--ease-standard),
  opacity var(--dur-1) var(--ease-standard);

/* :118–127 — current: the cursor follower is positioned with layout properties on every pointermove */
left: var(--page-next-x, 50vw);
top: var(--page-next-y, 50svh);
transform: translate3d(-100%, -100%, 0) scale(0.96);
will-change: left, top, transform, opacity;
```

`max-width`/`gap` transitions trigger layout each frame; `left`/`top` updates per pointermove trigger layout + paint; `will-change: left, top` cannot promote anything.

## Target

```css
/* :54–58 */ transition: transform var(--dur-1) var(--ease-standard), box-shadow var(--dur-1) var(--ease-standard), opacity var(--dur-1) var(--ease-standard);
/* :118–127 */
left: 0; top: 0;
translate: calc(var(--page-next-x, 50vw) - 100%) calc(var(--page-next-y, 50svh) - 100%);  /* position: untransitioned, composited */
transform: scale(0.96);                                                                    /* transitioned */
transition: opacity var(--dur-1) var(--ease-standard), transform var(--dur-2) var(--ease-enter);
will-change: transform, opacity;
/* .is-visible */ transform: scale(1);
```

The script is unchanged: it keeps writing `--page-next-x/-y`.

## Repo conventions to follow

- The individual `translate` property is already used in `index.astro` (`.note-link`).
- Tokens: `--dur-1`, `--dur-2`, `--ease-standard`, `--ease-enter`.

## Steps

1. Remove the `max-width` and `gap` entries from the `.page-next` transition list (the size change snaps; the pill's growth is a low-frequency state change).
2. Replace `left/top` with `left: 0; top: 0;` + the `translate` declaration; reduce `transform` to `scale(0.96)`; set `will-change: transform, opacity`.
3. In `.page-next__cursor.is-visible`, set `transform: scale(1)`.

## Boundaries

- Do NOT touch the script or the anchor's accessibility attributes.
- Do NOT change durations.

## Verification

- **Mechanical**: `npm run build`; open a case page at ≥ 1024px, move the pointer in the lower half: the cursor label follows with no lag and no layout entries in the Performance panel.
- **Feel check**: the label still scales in from 0.96 over 220ms with the enter curve; following the pointer is 1:1 (position is not transitioned).
- **Done when**: no `left|top|max-width|gap` in any `transition`/`will-change` in the file.
