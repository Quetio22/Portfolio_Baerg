import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// A changed file gets a new URL even when the previous URL is still cached.
// Paths are fixed, trusted assets supplied by the page templates.
export function assetUrl(path) {
  const content = readFileSync(new URL(`../public${path}`, import.meta.url));
  const version = createHash('sha256').update(content).digest('hex').slice(0, 12);
  return `${path}?v=${version}`;
}
