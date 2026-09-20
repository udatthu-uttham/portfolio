# Bolt clearance — 2026-09-06

User requirement: nothing may cover the bolts; reserve padding around them.

Implemented shared hardware size, clearance and content-inset tokens. Every bolt has a 16px buffer beyond its 16px footprint, inset 18px from the frame. Case-artboard padding now belongs to the outer frame, reserving 50px top/bottom for both SVGs and placeholders. Hero/contact panels reserve 82px to accommodate tilted objects and entrance movement. The workboard reserves 96px; its bottom inset increases to 128px where magnetic hover applies.

Validation:

- Homepage bounds checked at 320, 360, 390, 640, 767, 768, 879, 900, 901, 1023, 1024, 1280 and 1440px. Compared content, photos, badges, notes, cards and tape against each bolt's rectangle expanded by 16px. No violations or horizontal overflow.
- Tested both maximum card-tilt directions using GSAP's actual transforms (perspective 400px, X 4°, Y ±2.5°, Z 4.5px), at 768, 879, 1024, 1440 and 1920px. This exposed insufficient bottom padding in the first pass; after the 128px correction all pass. Tightest observed gap: 16.195px at the maximum typography size.
- Checked all four case pages at 320, 640, 879 and 1440px: every artboard clears the expanded bolt rectangles, with no horizontal overflow.
- Temporary maximum-tilt route removed from `src/pages`; its source is retained at `tmp/bolt-clearance-check.astro` for future reproduction. Before-edit copies are in `tmp/bolt-clearance-before`.
- Production build passes for the five portfolio pages.

Recheck maximum projected card bounds if card content or magnetic motion changes. Decorative motion allowances supplement the shared buffer rather than replacing it.
