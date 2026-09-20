import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { validateContact, createRateLimiter, sendContact } from '../src/contact.js';
import { createApp, robots, sitemap } from '../server.js';
import { renderPage, pages, publicationReady, siteUrl, contactReady } from '../src/site.js';
import { studio } from '../src/content.js';

const valid = () => ({
  name: 'Test local',
  email: 'test@example.com',
  message: 'Ceci est un test automatisé local.',
  company: '',
  projectType: 'À définir',
  budget: 'À définir',
  website: '',
  requestId: randomUUID(),
  startedAt: Date.now() - 5000,
});
test('configuration publique : domaine, sitemap, métadonnées et activation du formulaire', () => {
  // Fixture en mémoire dans ce processus de test uniquement, jamais écrite dans les contenus.
  const previous = { ...process.env };
  const legal = { ...studio.legal };
  try {
    for (const key of Object.keys(studio.legal)) studio.legal[key] = 'Fixture de test uniquement';
    Object.assign(process.env, {
      PUBLICATION_READY: 'true',
      SITE_URL: 'https://baerg.test.invalid',
      RESEND_API_KEY: 'test-only',
      CONTACT_FROM: 'test@example.com',
      CONTACT_TO: 'studio@example.com',
    });
    assert.equal(publicationReady(), true);
    assert.equal(contactReady(), true);
    assert.match(robots(), /Sitemap: https:\/\/baerg.test.invalid\/sitemap.xml/);
    assert.equal((sitemap().match(/<loc>/g) || []).length, 6);
    const html = renderPage('/contact/');
    assert.match(html, /rel="canonical" href="https:\/\/baerg.test.invalid\/contact\/"/);
    assert.match(
      html,
      /property="og:image" content="https:\/\/baerg.test.invalid\/images\/og.png\?v=[a-f0-9]+"/,
    );
    assert.match(html, /data-ready="true"/);
    assert.match(html, /name="robots" content="index, follow"/);
    assert.ok(!html.includes('test-only'));
    assert.match(renderPage('/404/'), /name="robots" content="noindex, nofollow"/);
    const about = renderPage('/a-propos/');
    assert.ok(
      !about.includes('portrait-demo-'),
      'Les portraits de démonstration restent hors publication.',
    );
    assert.ok(
      !about.includes('Prénom à renseigner'),
      'Les prénoms provisoires restent hors publication.',
    );
  } finally {
    Object.assign(studio.legal, legal);
    for (const key of [
      'PUBLICATION_READY',
      'SITE_URL',
      'RESEND_API_KEY',
      'CONTACT_FROM',
      'CONTACT_TO',
    ]) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
test('validation des champs et des choix, sans confiance dans le navigateur', () => {
  assert.ok(validateContact(valid()).fields);
  for (const change of [
    { name: '' },
    { name: 'X\nBcc: autre' },
    { email: 'test@' },
    { message: 'court' },
    { message: 'a'.repeat(5001) },
    { company: 'a'.repeat(161) },
    { budget: 'inventé' },
    { projectType: 'inventé' },
    { requestId: 'x' },
    { name: {} },
    { email: 'x@y.com\r\nBcc: x@y.com' },
  ])
    assert.ok(validateContact({ ...valid(), ...change }).error, JSON.stringify(change));
  for (const body of [null, [], 'x', 1]) assert.ok(validateContact(body).error);
});
test('antispam : honeypot, envoi immédiat, ancien ou date falsifiée', () => {
  for (const change of [
    { website: 'bot' },
    { startedAt: Date.now() },
    { startedAt: Date.now() + 100000 },
    { startedAt: 1 },
    { startedAt: 'abc' },
  ])
    assert.ok(validateContact({ ...valid(), ...change }).error);
});
test('limiteur indépendant par adresse et expiration après quinze minutes', () => {
  let time = 0;
  const limiter = createRateLimiter({ now: () => time });
  for (let i = 0; i < 5; i++) assert.equal(limiter.check('client-a'), true);
  assert.equal(limiter.check('client-a'), false);
  assert.equal(limiter.check('client-b'), true);
  time = 900001;
  assert.equal(limiter.check('client-a'), true);
  limiter.close();
});
test('envoi fournisseur : clé identique lors des nouvelles tentatives, pas de faux succès', async () => {
  const calls = [];
  const fields = validateContact(valid()).fields;
  const env = {
    CONTACT_FROM: 'test@example.com',
    CONTACT_TO: 'studio@example.com',
    RESEND_API_KEY: 'local-test-secret',
  };
  const mock = async (url, options) => {
    calls.push({ url, options });
    return Response.json({ id: 'local-test-id' });
  };
  assert.equal(await sendContact(fields, env, mock), true);
  assert.equal(await sendContact(fields, env, mock), true);
  assert.equal(
    calls[0].options.headers['Idempotency-Key'],
    calls[1].options.headers['Idempotency-Key'],
  );
  assert.equal(JSON.parse(calls[0].options.body).reply_to, fields.email);
  assert.equal(await sendContact(fields, env, async () => Response.json({})), false);
  assert.equal(
    await sendContact(fields, env, async () => Response.json({ error: 'fail' }, { status: 500 })),
    false,
  );
});
async function app(t, options = {}) {
  const server = createApp({ env: { PORT: '3000' }, ...options });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}
const post = (url, body = valid(), headers = {}) =>
  fetch(url + '/api/contact', {
    method: 'POST',
    headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
test('endpoint fermé sans configuration, et absence de secret exposé', async (t) => {
  const url = await app(t);
  const response = await post(url);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  for (const path of ['/.env', '/server.js', '/src/content.js', '/%2e%2e/package.json'])
    assert.equal((await fetch(url + path)).status, 404);
});
test('protections HTTP : origine, méthode, format et taille', async (t) => {
  const url = await app(t, { enabled: true });
  assert.equal((await post(url, valid(), { Origin: 'https://untrusted.example' })).status, 403);
  assert.equal((await fetch(url + '/api/contact')).status, 405);
  assert.equal((await post(url, valid(), { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await post(url, { ...valid(), message: 'x'.repeat(25000) })).status, 413);
  assert.equal((await post(url, { ...valid(), email: 'invalid' })).status, 422);
  const malformed = await fetch(url + '/api/contact', {
    method: 'POST',
    headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
    body: '{',
  });
  assert.equal(malformed.status, 400);
});
test('endpoint : réponse positive uniquement avec acceptation du fournisseur simulé', async (t) => {
  let calls = 0;
  const url = await app(t, {
    enabled: true,
    fetchImpl: async () => {
      calls++;
      return Response.json({ id: 'test-only' });
    },
  });
  const response = await post(url);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(calls, 1);
});
test('endpoint : erreurs et exceptions fournisseur donnent un échec', async (t) => {
  for (const fetchImpl of [
    async () => Response.json({}, { status: 500 }),
    async () => {
      throw new Error('private error');
    },
  ]) {
    const url = await app(t, { enabled: true, fetchImpl });
    const response = await post(url);
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.ok(!body.includes('private error'));
    assert.equal(JSON.parse(body).ok, false);
  }
});
test('endpoint : la sixième tentative est limitée, même avec un IP client falsifié', async (t) => {
  const url = await app(t);
  for (let i = 0; i < 5; i++)
    assert.equal((await post(url, valid(), { 'X-Forwarded-For': `1.2.3.${i}` })).status, 503);
  const response = await post(url);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '900');
});
test('pages serveur, 404, redirections, CSP et prévisualisation non indexable', async (t) => {
  const url = await app(t);
  for (const path of Object.keys(pages).filter((path) => path !== '/404/')) {
    const response = await fetch(url + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
    const html = await response.text();
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /<html lang="fr">/);
  }
  assert.equal((await fetch(url + '/introuvable/')).status, 404);
  assert.equal((await fetch(url + '/contact', { redirect: 'manual' })).status, 308);
  assert.match(await (await fetch(url + '/robots.txt')).text(), /Disallow: \//);
  assert.ok(!(await (await fetch(url + '/sitemap.xml')).text()).includes('<loc>'));
});
test('domaine configurable et publication bloquée sans informations légales', () => {
  assert.equal(siteUrl('https://example.com'), 'https://example.com');
  for (const value of [
    'javascript:alert(1)',
    'https://example.com/sub',
    'https://secret@example.com',
  ])
    assert.throws(() => siteUrl(value));
  assert.equal(
    publicationReady({ PUBLICATION_READY: 'true', SITE_URL: 'https://example.com' }),
    false,
  );
  assert.match(renderPage('/contact/'), /data-ready="false"/);
});

test('les ressources sont revalidées et une version inchangée renvoie 304', async (t) => {
  const url = await app(t);
  const response = await fetch(url + '/styles.css');
  assert.equal(response.headers.get('cache-control'), 'public, no-cache');
  const etag = response.headers.get('etag');
  assert.ok(etag);
  const unchanged = await fetch(url + '/styles.css', { headers: { 'If-None-Match': etag } });
  assert.equal(unchanged.status, 304);
  assert.equal(await unchanged.text(), '');
  const stale = await fetch(url + '/styles.css', { headers: { 'If-None-Match': '"old-palette"' } });
  assert.equal(stale.status, 200);
  assert.match(await stale.text(), /--brand: #292a30/);
});
