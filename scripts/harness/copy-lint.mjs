#!/usr/bin/env node
// Copy check for the website (CLAUDE.md: "The site speaks in the first person"
// and "No copy ships without a grammar and tone check"). Reads the visible
// strings of one or more copy files and flags what the rules forbid:
//   - narration about Uttham in the third person ("Uttham" on its own, he/his/him)
//   - American spellings where the site writes British English
//   - straight quotes and apostrophes in prose (the site uses curly ones)
//   - ** or ^^ markers left open
//   - storyline-preview marks ([[new:…]], [[full:…]], [[slot:…]])
//   - business figures: percentages, lakh/crore, NMV/GMV, any "million" but 250
// It cannot judge meaning or tense; it catches the mechanical slips so the
// careful read can spend its attention there.
//
// Usage:
//   node scripts/harness/copy-lint.mjs <file>...       check files, exit 1 on findings
//   node scripts/harness/copy-lint.mjs --hook          read a Claude Code hook payload
//                                                      on stdin; exit 2 with findings
//                                                      so they reach the model
//   node scripts/harness/copy-lint.mjs --all           every copy file in the repo
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(new URL('../..', import.meta.url).pathname);
const COPY = /\/src\/(data\/[^/]+\.ts|pages\/.+\.astro|components\/[^/]+\.astro)$/;
// files whose strings are not the site's voice: the tools' own UI and the
// prototype preview (CLAUDE.md, "A tool preview keeps the tool's own identity")
const SKIP_FILES = /(ResonaPreview|ProtoPreview|SignalLoop|TownBackdrop|IntentArtwork|RepurchaseArtwork|GridOverlay|PointerRide)\.astro$|\/case-teaser\.ts$|\/ai-pages\.ts$/;

const AMERICAN = [
  ['color', 'colour'], ['colors', 'colours'], ['colored', 'coloured'], ['behavior', 'behaviour'],
  ['favorite', 'favourite'], ['gray', 'grey'], ['catalog', 'catalogue'], ['center', 'centre'],
  ['centered', 'centred'], ['organize', 'organise'], ['organized', 'organised'], ['recognize', 'recognise'],
  ['recognized', 'recognised'], ['optimize', 'optimise'], ['optimized', 'optimised'], ['prioritize', 'prioritise'],
  ['prioritized', 'prioritised'], ['realize', 'realise'], ['realized', 'realised'], ['analyze', 'analyse'],
  ['analyzed', 'analysed'], ['customize', 'customise'], ['summarize', 'summarise'], ['synthesize', 'synthesise'],
  ['visualize', 'visualise'], ['minimize', 'minimise'], ['maximize', 'maximise'], ['program', 'programme'],
  ['programs', 'programmes'], ['kickoff', 'kick-off'], ['traveled', 'travelled'], ['labeled', 'labelled'],
];

// Pull the human-visible strings out of a file, with their line numbers.
function strings(file, text) {
  const out = [];
  const lines = text.split('\n');
  const isAstro = file.endsWith('.astro');
  let fm = isAstro ? 0 : 1; // .astro: 0 before frontmatter, 1 inside, 2 template
  let inStyle = false, inScript = false, inBlockComment = false;
  lines.forEach((raw, i) => {
    const n = i + 1;
    const line = raw.trim();
    if (isAstro && line === '---') { fm = fm === 0 ? 1 : 2; return; }
    if (inBlockComment) { if (/\*\/|-->/.test(line)) inBlockComment = false; return; }
    if (/^(\/\*|\{\/\*)/.test(line) && !line.includes('*/')) { inBlockComment = true; return; }
    if (/^<!--/.test(line) && !line.includes('-->')) { inBlockComment = true; return; }
    if (/^(\/\/|\*|\/\*|\{\/\*|<!--)/.test(line)) return;
    if (isAstro && fm === 2) {
      if (/<style/.test(line)) inStyle = true;
      if (/<script/.test(line)) inScript = true;
      if (inStyle || inScript) { if (/<\/style>/.test(line)) inStyle = false; if (/<\/script>/.test(line)) inScript = false; return; }
      // template text: what lies between tags, and alt / aria-label / title values
      const attrs = [...raw.matchAll(/\b(?:alt|aria-label|title|caption|label)="([^"]{3,})"/g)].map((m) => m[1]);
      const textOnly = raw.replace(/\{\/\*.*?\*\/\}/g, ' ').replace(/<!--.*?-->/g, ' ').replace(/<[^>]*>/g, ' ')
        .replace(/[\w:@.-]+=("[^"]*"|\{[^}]*\})/g, ' ').replace(/\{[^}]*\}/g, ' ').trim();
      for (const s of attrs) if (/[a-z]{2,}\s+[a-z]{2,}/i.test(s)) out.push({ n, s, kind: 'attr' });
      if (/[a-z]{2,}\s+[a-z]{2,}/i.test(textOnly)) out.push({ n, s: textOnly, kind: 'template' });
      return;
    }
    // code: single-quoted, double-quoted and backtick strings with real words in them
    const code = raw.replace(/([;,{(]\s*)\/\/.*$/, '$1');
    for (const m of code.matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g)) {
      const s = m[1] ?? m[2] ?? m[3] ?? '';
      if (s.length < 12 || s.length > 600) continue; // keys, paths, and the copyable prompts
      if (!/[a-z]{2,}\s+[a-z]{2,}/i.test(s)) continue;
      if (/^[./@#~]|https?:\/\/|\.(png|jpe?g|webp|mp4|svg|pdf)\b|^[a-z-]+(\s+[a-z-]+)*$/.test(s) && !/\s[A-Z]?[a-z]+\s/.test(s)) continue;
      out.push({ n, s, kind: 'string', quote: m[0][0], raw: m[0] });
    }
  });
  return out;
}

function lint(file) {
  const text = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  const findings = [];
  const add = (n, msg, s) => findings.push(`${rel}:${n}  ${msg}\n    ${s.length > 140 ? s.slice(0, 140) + '…' : s}`);
  for (const { n, s, kind, quote, raw } of strings(file, text)) {
    // a verbatim (it opens on a curly quote) keeps its speaker's words
    const verbatim = /^[“‘]/.test(s.trim());
    if (/\[\[(new|full|slot):/.test(s)) add(n, 'storyline-preview mark left in the copy', s);
    if (!verbatim) {
      const third = s.match(/\bUttham\b(?!\s+Udatthu)|\b(he|his|him|himself)\b/i);
      if (third && !/Uttham Udatthu/.test(s)) add(n, `third person ("${third[0]}"): narration is "I/my/me", the team is "we"`, s);
      for (const [us, uk] of AMERICAN) {
        const re = new RegExp(`\\b${us}\\b`, 'i');
        if (re.test(s) && !(us === 'program' && /\bprogrammes?\b/i.test(s))) add(n, `American spelling "${us}": the site writes "${uk}"`, s);
      }
    }
    const bold = (s.match(/\*\*/g) || []).length, beat = (s.match(/\^\^/g) || []).length;
    if (bold % 2) add(n, 'a ** highlight is left open', s);
    if (beat % 2) add(n, 'a ^^ beat is left open', s);
    if (/\d+(\.\d+)?\s?%|\b(lakh|crore|NMV|GMV)\b/i.test(s)) add(n, 'looks like a business figure (CLAUDE.md, "Metrics")', s);
    const mil = s.match(/\b(\d[\d,.]*)\s*(million|mn|bn|billion)\b/i);
    if (mil && mil[1] !== '250') add(n, `a figure other than the public 250 million ("${mil[0]}")`, s);
    // straight quotes in prose: an apostrophe inside a word, or a straight
    // double quote around words, in a template or a single-quoted string
    if (kind === 'template' && /[A-Za-z]'[A-Za-z]|"[A-Za-z][^"]*"/.test(s)) add(n, 'straight quote or apostrophe: the site uses ’ “ ”', s);
    if (kind === 'string' && quote === "'" && /\\'/.test(raw)) add(n, "straight apostrophe (\\'): the site uses ’", s);
    if (kind === 'string' && quote !== '"' && /(^|\s)"[A-Za-z][^"]*"/.test(s)) add(n, 'straight double quotes: the site uses “ ”', s);
  }
  return findings;
}

function allCopyFiles() {
  const files = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (COPY.test(p) && !SKIP_FILES.test(p)) files.push(p);
    }
  };
  walk(join(ROOT, 'src'));
  return files;
}

const args = process.argv.slice(2);
if (args[0] === '--hook') {
  let payload = '';
  for await (const chunk of process.stdin) payload += chunk;
  let file = '';
  try {
    const j = JSON.parse(payload);
    file = j.tool_input?.file_path || j.tool_response?.filePath || '';
  } catch { process.exit(0); }
  if (!file || !COPY.test(file) || SKIP_FILES.test(file) || !existsSync(file)) process.exit(0);
  const findings = lint(file);
  if (!findings.length) process.exit(0);
  process.stderr.write(`Copy check (CLAUDE.md voice and grammar rules) — ${findings.length} to look at; fix the real ones, ignore a false alarm:\n${findings.join('\n')}\n`);
  process.exit(2);
}
const files = args[0] === '--all' ? allCopyFiles() : args.map((f) => resolve(f));
const findings = files.flatMap((f) => (COPY.test(f) && !SKIP_FILES.test(f) ? lint(f) : []));
if (findings.length) {
  console.log(findings.join('\n'));
  console.log(`\n${findings.length} finding(s) in ${files.length} file(s).`);
  process.exit(1);
}
console.log(`Copy check: clean (${files.length} file(s)).`);
