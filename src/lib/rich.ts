// The site's emphasis markup, shared by every surface that prints prose.
// Project rule (CLAUDE.md): long sentences carry their highlights in bold, so a
// reader can skim only the bold and still get the argument.
//   **text**  → the normal highlight
//   ^^text^^  → one bigger beat, used sparingly
export const rich = (text: string | undefined | null) =>
  (text ?? '')
    .replace(/\^\^(.+?)\^\^/g, '<strong class="em em--lg">$1</strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="em">$1</strong>');
