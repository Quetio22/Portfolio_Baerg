import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { publicOrigin, withPublicMetadata } from './public-metadata.js';
const origin = publicOrigin(process.env.SITE_URL);

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
for (const route of ['/', '/a-propos/', '/realisations/', '/offres/', '/contact/']) {
  const file = new URL('.' + route + 'index.html', output);
  const html = await readFile(file, 'utf8');
  await writeFile(file, withPublicMetadata(html, origin, route));
}
console.log(origin ? 'Métadonnées publiques configurées pour ' + origin : 'Sans SITE_URL : URL canoniques non renseignées ; partage distant à finaliser.');
console.log('Baerg Design exporté dans dist/.');
