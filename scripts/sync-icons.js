// Refresh the inline Lucide geometry from our pinned, licensed local SVG sources.
import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const pages = [
  "index.html",
  "a-propos/index.html",
  "realisations/index.html",
  "offres/index.html",
  "contact/index.html",
  "demos/lise/index.html",
  "demos/atelier-traverse/index.html",
  "demos/midi-et-compagnie/index.html",
];
const cache = new Map();
for (const page of pages) {
  const file = new URL(page, root);
  let source = await readFile(file, "utf8");
  const matches = [
    ...source.matchAll(
      /(<svg\b[^>]*data-lucide="([a-z-]+)"[^>]*>)([\s\S]*?)<\/svg>/g,
    ),
  ];
  for (const [full, opening, name] of matches) {
    if (!cache.has(name)) {
      const svg = await readFile(
        new URL(`assets/icons/lucide/${name}.svg`, root),
        "utf8",
      );
      cache.set(
        name,
        svg
          .match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/)[1]
          .replace(/\s+/g, " ")
          .trim(),
      );
    }
    source = source.replace(full, opening + cache.get(name) + "</svg>");
  }
  await writeFile(file, source);
}
console.log(
  `Lucide : ${cache.size} dessins synchronisés dans ${pages.length} pages.`,
);
