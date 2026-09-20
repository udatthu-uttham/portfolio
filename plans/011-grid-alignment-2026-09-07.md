# Column guide alignment — 2026-09-07

Implemented the user's request to make the decorative paper guides follow the actual layout.

- GridOverlay uses the same centred 1200px maximum container as page content. Real CSS grid tracks follow the existing 12/8/4 columns and 24/20/16px gutters. Subtle dashed lines mark both column edges.
- The header shares the content bounds, without duplicate tablet padding.
- The desktop hero spans eight columns for the slab and four for its caption/scene. Stacked scenes use centred eight-of-twelve or six-of-eight spans, then all four columns on phones.
- Projects, principles and AI use the foundation horizontal gutter. Hardware padding, vertical section rhythm and the caption-before-artwork order remain intact.
- Token documentation and rendered guides describe the shared geometry.

Validation: browser geometry at 320, 390, 640, 641, 767, 768, 898, 900, 901, 1023, 1024, 1440 and 1920px found no horizontal overflow. Main column edges match guide edges within 0.15px. Visual checks at 390, 898 and 1440px. Bolt clearance checks at 320, 768, 898, 1024 and 1440px found no content intersecting the 16px hardware buffer. Shared case-page bounds verified at 320, 898, 1440 and 1920px. Production build passes.

Source backups: `tmp/grid-alignment-before-2026-09-07/`.
