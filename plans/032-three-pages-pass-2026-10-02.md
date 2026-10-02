# Three pages, section by section — 2026-10-02

Uttham went page by page: Resona, then the realistic prototype, then the product-cards case study.
Copy came from three workflows (wf_61a45948-858, wf_8ad92a16-a08, wf_2855cd31-2ad), each a
draft, a review and a revision. Layout changes were made by hand and checked in the browser.

## Resona (/ai/resona)

- **Headline:** "A research tool that plans, listens, synthesises and remembers" (before: "Build
  your own research allrounder"). The summary covers all four parts.
- **Value added**, his words, replaces Kind.
- **How I made it** is four sub-groups: planning, execution, synthesis, library.
  - Planning, execution and library each open with his lead, then rows that drive the phone.
    Synthesis keeps its seven steps.
  - Nothing calls it a skill.
  - n8n is named because he names it.
- **The prompt** gains two modes. Run backs up the moderator during a session: answers mapped to
  the objectives, what is still uncovered, the next neutral probe. Library files a finished study,
  checks what past studies know, and sets up a searchable store. It stays white-label.
- **Not in the local code:** live listening during a session, a Meesho-tailored question writer
  inside the apps, and the n8n vector library. The planning logic lives in the guide-writing skill
  outside both repos. The page states his account of the tool ("trust me what i said").

## Realistic prototype (/ai/realistic-prototype)

- **Title:** "Real app, real data, real reactions". Alternatives were offered to Uttham.
- **Description:** kept, after a second look.
- **Value added** replaces Kind.
- **The idea** is now how the spark came: Figma could not cover every case and stay interactive.
  It then keeps the real-data claim, with its beat.
- **Next steps:** the pilot, then the advanced version with the tech team: a shareable repo with
  more services, and a feature config page with a real-time ranked feed per user.

## Both AI pages

- **The prompt comes before What you get.**
- Facts take bold highlights (`rich()` on the value).

## Product cards (/work/a-line-of-card-height)

- **Title:** "From a glance to a decision".
- **Facts:** Role, "Strategy and design lead for a pod of five"; Timeline, "Six months"; the
  Research row is gone.
- **Context** is his words. The Problem's second paragraph is a mission statement, with the
  chapter's one beat.
- **"What shoppers look at" is gone**, and the consent-open fabric quote went with it.
- **Strategy:**
  - part 1 now runs Card framework, Clearer titles, Staggered feed, List or grid;
  - part 2 runs Swipeable images (more views and the variations), Bigger images for fashion, and
    Delivery date (only on fast deliveries);
  - cash is out of the teaser. The full study keeps it until he decides.
- **Rail:** only the title (top), Problem, Strategy and Outcome.
- **The phone card hugs the phone.** At 1440 it went from 486 to 368px wide, with an even
  `--card-padding` all round. The card has a title above the phone, one per screen
  (`screens.titles`).
- **Screens he still needs to export:** see `src/assets/plp/README.md`: ten for the teaser (one
  on hand), plus `cash` if the full study keeps it.

## Checked

- 1440×900 and 375px on all three pages: no horizontal overflow.
- The rail shows four ticks on the product cards.
- The card title follows the screen shown. A state with no export borrows the earlier screen and
  its title.
- `npm run build` passes.
