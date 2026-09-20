# People and agents in the hero — 2026-09-16

Implemented the approved caption, bot rider and varied flips in `SignalLoop.astro` and `index.astro`.

- Caption ends “clearing the road for people and AI agents.”
- Rear rider is a small bot: rounded rectangular head, two eyes, antenna and jointed arm. The existing motorcycle and muted livery remain shared.
- Pick one of seven nonempty rider combinations once per red cycle, excluding the previous combination. Each solo has weight 7, each pair 2.5, and all three 1.5. Every rider has equal opportunity; spins remain confined to the existing flight path.
- Retain frozen scene time off-screen and reduced-motion green still frame.
- Completed verification of the earlier desktop centre-alignment change: the scene/caption centres against the slab alone, while the portrait occupies the row above.

Validation: production build; lifecycle and seeded 60,000-cycle variation checks (`tmp/verify-signal-variation.mjs`); desktop/mobile visual inspection of bot, crossing and jumps; no horizontal overflow at 320, 390, 640, 898, 1023, 1024 and 1440px. Caption/art spacing is 12px throughout, and desktop centre error is less than 0.01px.
