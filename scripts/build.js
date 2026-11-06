import { cp, mkdir, rm, readFile } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
// Keep historical sources in Git, but publish only the current variants.
const excluded = new Set(JSON.parse(await readFile(new URL('./export-exclusions.json', import.meta.url), 'utf8')));
const include = source => !excluded.has(relative(fileURLToPath(root), source).split(sep).join('/'));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['404.html', 'redirects.json', 'index.html', 'common.css', 'fusion.css', 'app.js', 'motion.js', 'assets', 'demos', 'pages.css', 'theme.css', 'home.css', 'a-propos', 'realisations', 'offres', 'contact']) {
  await cp(new URL(name, root), new URL(name, output), { recursive: true, filter: include });
}
console.log('Baerg Design exporté dans dist/.');
