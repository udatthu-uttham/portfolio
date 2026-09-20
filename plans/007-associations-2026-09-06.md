# Layout associations — 2026-09-06

Implemented from the user's tablet screenshot and request to inspect relationships across the page. No VCS is present; before-edit copies are in `tmp/association-pass-before/`.

## Changes

- Removed the hero statement's 34ch cap and stretched its mask to the glass content width.
- Placed the portrait behind the glass in an isolated stage, with a 64px left inset and 32px overlap; its rotated edge clears the top-left bolt.
- Applied compact-section top/bottom panel padding so the CTA clears the lower bolts.
- Made the scene and explanation one semantic figure, with the caption directly below the drawing and a 12px gap. Trimmed unused SVG canvas space and limited the stacked figure to 600px. Desktop groups align along their lower edge in normal flow.
- Removed doubled section separation, tightened heading-to-board spacing, and used compact spacing for supporting case details.
- Restored 16–17px body text while keeping supporting receipts at 14px. Corrected scoped selector specificity so principle subtitles sit 8px from their headings and receipts receive their intended extra spacing.
- Made the two unavailable AI previews equal compact frames instead of oversized device-shaped empty regions.
- Reserved contact-badge space within the photo group, removed duplicate spacing above it, and gave contact notes consistent dimensions. Email wrapping occurs naturally before the domain. The missing ride-photo label sits above the lower badges; its actual text bounds clear all three badges at 320px.
- Preserved the two-family system, shared radii/materials, CV download, scene narrative, off-screen motion gating and mobile card/tape stacking.

## Verification

- Rendered and inspected homepage compositions at 320, 390, 640, 879, 1024 and 1440px, including project tape, principles, previews and contact.
- Measured layout at 360, 641, 767, 768, 900, 901, 1023 and 1280px boundaries in addition to the rendered widths. No document horizontal overflow; only General Sans and Caveat in text; 12px scene/caption gap; hero content fills the padded panel; CTA is at least 14px clear of the lower bolt.
- Mobile project cards retain approximately 29–31px clearance above the following card's tape, with earlier cards layered above later cards.
- Checked all four case pages at 320, 640, 879 and 1440px. No horizontal overflow; supporting details use 48–72px separation, with the correct one/two-column transition.
- Browser error/warning log empty. Production build passed for all five pages.

## Remaining content

Missing project visuals, plugin/prototype previews and the separate ride photo remain honestly labeled; this pass does not invent those assets or outcomes.
