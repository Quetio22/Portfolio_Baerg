import { cp, mkdir, rm, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pages, publicationReady, renderPage } from '../src/site.js';
import { projects } from '../src/content.js';
import { robots, sitemap } from '../server.js';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
if (process.env.PUBLICATION_READY === 'true' && !publicationReady())
  throw new Error(
    'Publication bloquée : compléter SITE_URL et les informations légales dans src/content.js.',
  );
for (const project of projects.filter((project) => project.published)) {
  for (const field of ['name', 'nature', 'image', 'imageAlt', 'problem', 'solution'])
    if (!project[field]) throw new Error(`Projet incomplet : ${field}`);
  if (!['Client', 'Personnel', 'Scolaire', 'Concept non commandé'].includes(project.nature))
    throw new Error('Nature du projet invalide.');
  if (
    !Number.isInteger(project.width) ||
    !Number.isInteger(project.height) ||
    project.width < 1 ||
    project.height < 1
  )
    throw new Error('Dimensions de projet invalides.');
  if (
    !/^\/images\/[\w./-]+\.(?:webp|avif|png|jpe?g)$/i.test(project.image) ||
    project.image.includes('..')
  )
    throw new Error('Utiliser une image locale dans public/images.');
  await access(fileURLToPath(new URL(`../public${project.image}`, import.meta.url)));
  if (project.url && new URL(project.url).protocol !== 'https:')
    throw new Error('Le lien du projet doit être une URL HTTPS réelle.');
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(fileURLToPath(new URL('../public/', import.meta.url)), output, { recursive: true });
for (const path of Object.keys(pages)) {
  const directory = output + (path === '/' ? '' : path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(directory + 'index.html', renderPage(path));
}
await writeFile(output + '404.html', renderPage('/404/'));
await writeFile(output + 'robots.txt', robots());
await writeFile(output + 'sitemap.xml', sitemap());
console.log(
  `7 pages générées dans dist/. Mode : ${publicationReady() ? 'publication' : 'prévisualisation non indexable'}.`,
);
