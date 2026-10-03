# Phone screens for the Meesho Mall case study

The sticky phone on `/work/meesho-mall` shows one screen per state. Drop a Figma
export here named after its state (`v2-home.png`, …, .png, .jpg or .webp) and the
page picks it up on the next build. A state with no file borrows the previous
screen; before any exists the phone says "Screen coming soon".

This folder holds only what Uttham supplies for the case page (2026-10-02). The
Mall deck's exports in `../mall/` stay where they are: the homepage tile still
stands its phone on one of them.

Export phone screens portrait (about 9 : 19.5), at 2× or more (≥ 720px wide),
with dummy data only.

The list of states and their card titles is in `src/data/mall-case.ts`
(`screens.titles`).

On hand (2026-10-03, from Uttham): `v3-landing-new.png` (the Mall landing page), which the
homepage tile also shows in its phone.
