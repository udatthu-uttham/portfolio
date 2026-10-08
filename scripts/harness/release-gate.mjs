#!/usr/bin/env node
// Release gate for the website: nothing half-finished or confidential reaches
// uttham.fyi. Runs from the git pre-push hook (.githooks/pre-push) on every
// push, and from /ship on the built site.
//
// Source checks (always):
//   - PREVIEW_MARKS is false in src/lib/rich.ts and no page sets `preview: true`
//   - no storyline-preview mark ([[new:…]], [[full:…]], [[slot:…]]) in src/data
//   - no preview notes file is tracked (the repo is public)
//   - the copy check (scripts/harness/copy-lint.mjs --all) is clean
// Built-site checks (with --dist <dir>):
//   - no preview mark, banner or "YOURS TO FILL" in any page
//   - no verbatim marked `consent: false` in src/data appears in any page
//   - no figma.com link
//
// Usage: node scripts/harness/release-gate.mjs [--dist <dir>]
// Exit 1 lists what blocked the release. SKIP_COPY_CHECK=1 skips only the copy
// check, for a push whose findings are known false alarms; say so in the commit.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const ROOT = resolve(new URL('../..', import.meta.url).pathname);
const problems = [];
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const list = (dir, re) => readdirSync(join(ROOT, dir)).filter((f) => re.test(f)).map((f) => join(dir, f));

// --- source --------------------------------------------------------------
if (!/export const PREVIEW_MARKS = false;/.test(read('src/lib/rich.ts'))) problems.push('src/lib/rich.ts: PREVIEW_MARKS must be false on main');
for (const f of list('src/data', /\.ts$/)) {
  const text = read(f);
  text.split('\n').forEach((line, i) => {
    if (/^\s*\/\//.test(line)) return;
    if (/\bpreview:\s*true\b/.test(line)) problems.push(`${f}:${i + 1}: \`preview: true\` must not ship`);
    if (/\[\[(new|full|slot):/.test(line)) problems.push(`${f}:${i + 1}: storyline-preview mark left in the copy`);
  });
}
const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n');
for (const f of tracked) if (/PREVIEW-NOTES/i.test(f)) problems.push(`${f}: a preview notes file is tracked; the repo is public`);
if (process.env.SKIP_COPY_CHECK !== '1') {
  const lint = spawnSync(process.execPath, [join(ROOT, 'scripts/harness/copy-lint.mjs'), '--all'], { encoding: 'utf8' });
  if (lint.status !== 0) problems.push(`copy check found issues:\n${lint.stdout.trim()}`);
}

// --- built site ------------------------------------------------------------
const distIdx = process.argv.indexOf('--dist');
if (distIdx > -1) {
  const dist = resolve(process.argv[distIdx + 1] || '');
  if (!existsSync(dist)) problems.push(`--dist ${dist} does not exist`);
  else {
    const html = [];
    const walk = (d) => readdirSync(d, { withFileTypes: true }).forEach((e) => {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) html.push(p);
    });
    walk(dist);
    // consent-pending verbatims: the text of every quote marked consent: false
    const pending = [];
    for (const f of list('src/data', /\.ts$/)) {
      for (const m of read(f).matchAll(/consent:\s*false[^\n]*?text:\s*'([^']{12,})'|text:\s*'([^']{12,})'[^\n]*?consent:\s*false/g)) {
        const t = (m[1] || m[2]).replace(/^[“"]|[”"]$/g, '').slice(0, 40);
        pending.push(t);
      }
    }
    const banned = [
      [/\[\[(new|full|slot):/, 'storyline-preview mark'],
      [/class="pv-banner|YOURS TO FILL|FROM FULL STUDY/, 'storyline-preview banner or tag'],
      [/needs your consent/, 'consent flag'],
      [/figma\.com/, 'a Figma link'],
    ];
    for (const p of html) {
      const s = readFileSync(p, 'utf8');
      const rel = p.slice(dist.length + 1);
      for (const [re, what] of banned) if (re.test(s)) problems.push(`${rel}: ${what} in the built page`);
      for (const t of pending) if (s.includes(t)) problems.push(`${rel}: a verbatim awaiting consent is on the page ("${t}…")`);
    }
    if (!html.length) problems.push(`${dist}: no built pages found`);
  }
}

if (problems.length) {
  console.error(`Release gate: blocked (${problems.length}).\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Release gate: clear${distIdx > -1 ? ' (source and built site)' : ' (source)'}.`);
