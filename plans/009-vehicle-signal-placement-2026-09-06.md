# Vehicle signal placement — 2026-09-06

Moved the roadside signal from x=570 to x=410, overlapping the ramp's left edge and to the left of the zebra crossing. The crossing/jump anchor remains x=570 (stripes centred at x=550), so the ramp, flight path, backflip and landing keep their existing geometry and timing. Signal placement is now independent of that anchor. Shifted the nearby shoulder-rock cluster left to clear the relocated footing; the signal remains outside the road.

Verified the crossing/backflip frame using production SVG/CSS and the existing animation script at 900px and 390px; the final rightward nudge was rechecked at 390px. At 390px the signal's right edge is 30px left of the zebra crossing and 25px clear of the flipping rider. Production build passed for all five pages. Temporary scene-check page moved back to `tmp/scene-story-check.html`; no verification page remains in the public directory.
