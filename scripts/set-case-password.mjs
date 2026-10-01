// Sets the password for the product-cards case study's full layer.
// Usage: npm run case-password   (asks for the password; nothing is echoed)
// Writes only its SHA-256 to src/data/case-gate.ts — the password itself is
// never stored, printed or committed.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { stdin, stdout } from 'node:process';

const file = new URL('../src/data/case-gate.ts', import.meta.url);

const ask = (prompt) =>
  new Promise((resolve) => {
    stdout.write(prompt);
    let value = '';
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    // A paste arrives as one chunk, so read it a character at a time and stop
    // at the first Enter — otherwise the newline lands inside the password.
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n' || ch === '\u0004') {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.off('data', onData);
          stdout.write('\n');
          resolve(value);
          return;
        } else if (ch === '\u0003') {
          stdout.write('\n');
          process.exit(130);
        } else if (ch === '\u007f' || ch === '\b') {
          value = value.slice(0, -1);
        } else {
          value += ch;
        }
      }
    };
    stdin.on('data', onData);
  });

const first = await ask('Password for the full case study: ');
if (first.length < 6) {
  console.error('Use at least 6 characters.');
  process.exit(1);
}
const second = await ask('Again, to confirm: ');
if (first !== second) {
  console.error('The two entries did not match. Nothing was changed.');
  process.exit(1);
}

const hash = createHash('sha256').update(first, 'utf8').digest('hex');
const source = readFileSync(file, 'utf8');
const next = source.replace(/export const CASE_PASSWORD_SHA256 = '[0-9a-f]*';/, `export const CASE_PASSWORD_SHA256 = '${hash}';`);
if (next === source && !source.includes(hash)) {
  console.error('Could not find CASE_PASSWORD_SHA256 in src/data/case-gate.ts. Nothing was changed.');
  process.exit(1);
}
writeFileSync(file, next);
console.log('Done. The full case study now opens with that password (rebuild to publish).');
