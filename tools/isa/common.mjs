// What the generators share: writing a generated module, or with --check only comparing it with the one on disk.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export function fail(message) {
  throw new Error(message);
}

// The text of a generated module: a header, then `export const name = value;` per entry, arrays one element per line.
export function moduleText({ header = [], exports = {} }) {
  const parts = header.map((line) => `// ${line}`.trimEnd());
  parts.push('');
  for (const [name, value] of Object.entries(exports)) {
    if (Array.isArray(value) && value.some((v) => v && typeof v === 'object')) parts.push(`export const ${name} = [\n${value.map((x) => `  ${JSON.stringify(x)},`).join('\n')}\n];\n`);
    else if (value && typeof value === 'object' && !Array.isArray(value)) parts.push(`export const ${name} = ${JSON.stringify(value, null, 2)};\n`);
    else parts.push(`export const ${name} = ${JSON.stringify(value)};\n`);
  }
  return parts.join('\n');
}

export function writeOrCheck({ out = '', text = '', argv = process.argv }) {
  const name = relative(ROOT, out);
  if (argv.includes('--check')) {
    if (!existsSync(out) || readFileSync(out, 'utf8') !== text) {
      console.error(`${name} is out of date: run npm run isa`);
      process.exit(1);
    }
    console.log(`${name} is up to date`);
    return;
  }
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, text);
  console.log(`${name} written`);
}
