# Phone screens for the Meesho Mall case study

The sticky phone on `/work/meesho-mall` shows one screen per state. Drop a Figma
export here named after its state (`v2-home.png`, …, .png, .jpg or .webp) and the
page picks it up on the next build. A state with no file borrows the previous
screen; before any exists the phone says "Screen coming soon".

This folder holds only what Uttham supplies for the case page (2026-10-02). The
Mall deck's exports in `../mall/` stay where they are: the homepage tile still
stands its phone on one of them.

Export phone screens at 1 : 2 (1080 × 2160 is ideal), at 2× or more (≥ 720px
wide), with dummy data only, and no status bar: the page's phone mock draws its
own (an Android status bar: the clock, the punch-hole camera) above the screen, its strips in the colour of each
export's top and bottom edge (a clip's, frame by frame while it plays, from
`src/data/clip-edges.json`: **after adding or replacing a clip in
`public/media/`, run `npm run clip-edges`** on a Mac, or its strips keep the
still's colours). The
phone is one constant size on the page, its display 1 : 2, and nothing is ever
cropped or stretched (Uttham, 2026-10-03): a 1 : 2 screen fills the display
exactly (the splash, the Mall tab and its PiP, the listing and product pages);
the 9 : 16 order confirmation fits its width on its own purple, standing at the
top because its top is patterned and its foot flat, so the fill runs on from the
foot without a seam (a screen with both edges alike would be centred); a page
capture taller than 1 : 2 (like `v2-home.png`) pans down it and back, or
scrolls by hand with reduced motion, its "Scroll ↓" chip in the phone's home
strip (in the 112px mini player, with reduced motion, it stands whole instead).
Until `v1-tag` arrives its phone is empty and says "Screen coming soon" in the
middle of the display, the mini player's too.

A state can show several files in turn (`screens.map`, e.g. `v3-nav`: the
modal, then the PiP), each with its own title and alt where `screens.titles` /
`screens.alts` name the file; with reduced motion the reading shows them in
turn as it passes through the row. A file with a clip in `screens.videos` plays
it once, from its first frame, each time its screen arrives, then settles on
the still in this folder; with reduced motion only the still shows. The still
is never what a clip opens on: the screen arrives once the clip's first frame
is ready (the screen before stays up until then, 1.5 s at most; past that the
still stands in and the clip waits for its next arrival). Its slideshow beat
waits for the clip plus a 1.2 s hold.

The list of states and their card titles is in `src/data/mall-case.ts`
(`screens.titles`).

On hand (2026-10-03, from Uttham):

| File | State(s) | Source |
|---|---|---|
| `v1-tag.png` | v1-tag (the page's first screen) | "Mall v1 PLP.png" |
| `v2-landing.png` (1074×2154) | none on the case page; the homepage tile's v2 phone | "Mall v2 landing page.png", its 3px frame stroke trimmed |
| `v2-home.png` (1080×2994, a tall page) | v2-home, and v2-usps / v2-pill via `screens.map` ("use the v2 home directly") | "Mall v2.png" |
| `v2-mixed-feed.png` (360×720, 1×) | v2-mixed-feed | "Mall v2 PLP.png" |
| `v3-pill.jpg` (360×720, 1×) | v3-pill, and v3-labels via `screens.map` | "Mall v3 PLP - FiFs.jpg" |
| `v3-pdp.jpg` | v3-pdp | "Mall v3 PDPmall PDP.jpg" |
| `v3-landing-new.png` | v3-landing-new, and v3-brands ("What happened": the landing, then the order confirmation) via `screens.map`; also the homepage tile | "Mall v3 Landing Page.png" (identical) |
| `v3-nav.png` + `public/media/mall-case/v3-nav.mp4` | v3-nav, first; and v3-ftux via `screens.map` ("v3-ftux is homepage ftux only, that is the animation") | Figma "Mall v3 Homepage - new entrypoint" |
| `v3-nav-pip.png` + `…/v3-nav-pip.mp4` | v3-nav, second | Figma "Mall v3 Homepage - PIP" |
| `v3-splash.png` + `…/v3-splash.mp4` | v3-splash | Figma "mall v3- Splash" |
| `v3-ocp.png` + `…/v3-ocp.mp4` (1080×1920, 9:16) | v3-ocp | Figma "success screen 2" |

The videos are Figma's own MP4 export of each frame (2 s, re-encoded to 720px
H.264, ~250–550 KB, the same proportion as their still); the PNG beside each is
its poster (what reduced motion shows) and the frame it settles on after
playing: the closing frame, or for v3-ocp the "Order Confirmed!" frame (its clip
ends mid-transition, so it fades back to the confirmation).
The two 360×720 files are 1× exports and read soft on a 2× screen; a 3× export
replaces them by name.

The composed landing clip (v3-landing-active) was removed on 2026-10-04 ("if it is not used delete it"); git history keeps it and `scripts/mall-landing-clip.mjs`.

