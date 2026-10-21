import { cp, mkdir, rm } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'common.css', 'fusion.css', 'app.js', 'motion.js', 'assets', 'demos', 'pages.css', 'theme.css', 'home.css', 'a-propos', 'realisations', 'offres', 'contact']) {
  await cp(new URL(name, root), new URL(name, output), { recursive: true });
}
console.log('Baerg Design exporté dans dist/.');
