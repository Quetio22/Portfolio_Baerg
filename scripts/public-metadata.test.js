import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicOrigin, withPublicMetadata } from './public-metadata.js';
const html = '<head><meta name="robots" content="noindex,nofollow"><meta property="og:image" content="/assets/brand/share.png"><meta name="twitter:image" content="/assets/brand/share.png"></head>';
test('sans domaine confirmé, pas de fausse URL', () => {
  assert.equal(publicOrigin(undefined), null);
  assert.equal(withPublicMetadata(html, null, '/contact/'), html);
});
test('le domaine configuré donne des adresses absolues cohérentes sans lever noindex', () => {
  const result = withPublicMetadata(html, publicOrigin('https://studio.example/'), '/contact/');
  assert.match(result, /rel="canonical" href="https:\/\/studio.example\/contact\/"/);
  assert.match(result, /property="og:url" content="https:\/\/studio.example\/contact\/"/);
  assert.equal((result.match(/content="https:\/\/studio.example\/assets\/brand\/share.png"/g) || []).length, 2);
  assert.match(result, /noindex,nofollow/);
});
test('refuse un domaine local, HTTP, ou une URL avec chemin et identifiants', () => {
  for (const url of ['http://studio.example', 'https://localhost', 'https://127.0.0.1', 'https://studio.example/preview/', 'https://user:secret@studio.example', 'https://studio.example/?test=1']) assert.throws(() => publicOrigin(url));
});
