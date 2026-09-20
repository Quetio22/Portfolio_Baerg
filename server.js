import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, stat, realpath } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isIP } from 'node:net';
import { pages, renderPage, siteUrl, publicationReady, contactReady } from './src/site.js';
import { createRateLimiter, validateContact, sendContact } from './src/contact.js';
import { conceptPages } from './src/concepts/index.js';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const types = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};
export function robots(env = process.env) {
  return publicationReady(env)
    ? `User-agent: *\nAllow: /\nSitemap: ${siteUrl(env.SITE_URL)}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
}
export function sitemap(env = process.env) {
  const origin = siteUrl(env.SITE_URL);
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
    origin && publicationReady(env)
      ? Object.keys(pages)
          .filter((path) => path !== '/404/')
          .map((path) => `<url><loc>${origin.replaceAll('&', '&amp;')}${path}</loc></url>`)
          .join('')
      : ''
  }</urlset>`;
}

export function createApp({
  env = process.env,
  fetchImpl = fetch,
  enabled = contactReady(env),
  now = Date.now,
} = {}) {
  const limiter = createRateLimiter({ now });
  const origin = siteUrl(env.SITE_URL) || `http://localhost:${env.PORT || 3000}`;
  const localOrigin = `http://127.0.0.1:${env.PORT || 3000}`;
  const server = createServer(async (req, res) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    res.setHeader('X-Frame-Options', 'DENY');
    if (origin.startsWith('https://'))
      res.setHeader('Strict-Transport-Security', 'max-age=31536000');
    if (!publicationReady(env)) res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    const respond = (status, body, type = 'text/html; charset=utf-8') => {
      res.writeHead(status, {
        'Content-Type': type,
        'Cache-Control': res.getHeader('Cache-Control') || 'no-cache',
      });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    const json = (status, message, ok = false) =>
      respond(status, JSON.stringify({ ok, message }), 'application/json; charset=utf-8');
    let path;
    try {
      path = decodeURIComponent(new URL(req.url, origin).pathname);
    } catch {
      return respond(400, 'Requête invalide.', 'text/plain; charset=utf-8');
    }
    try {
      if (path === '/api/contact') {
        res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'POST') {
          res.setHeader('Allow', 'POST');
          return json(405, 'Méthode non autorisée.');
        }
        if (req.headers.origin !== origin && (env.SITE_URL || req.headers.origin !== localOrigin))
          return json(403, 'Origine de la demande non autorisée.');
        if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json')
          return json(415, 'Le format de la demande est invalide.');
        let address = req.socket.remoteAddress || 'unknown';
        // Uniquement derrière le proxy explicitement approuvé, qui remplace cet en-tête.
        if (
          env.TRUSTED_PROXY_IP &&
          address === env.TRUSTED_PROXY_IP &&
          isIP(req.headers['x-real-ip'] || '')
        )
          address = req.headers['x-real-ip'];
        if (!limiter.check(address)) {
          res.setHeader('Retry-After', '900');
          return json(429, 'Trop de tentatives. Réessayez dans quinze minutes.');
        }
        if (!enabled)
          return json(503, 'Le formulaire n’est pas encore ouvert. Aucun message n’a été envoyé.');
        if (Number(req.headers['content-length']) > 24000)
          return json(413, 'Votre message est trop volumineux.');
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 24000) return json(413, 'Votre message est trop volumineux.');
          chunks.push(chunk);
        }
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        } catch {
          return json(400, 'La demande est invalide.');
        }
        const result = validateContact(body, now());
        if (result.error) return json(422, result.error);
        try {
          const accepted = await sendContact(result.fields, env, fetchImpl);
          if (!accepted)
            return json(
              502,
              'L’envoi n’a pas pu être confirmé. Vos saisies sont conservées. Veuillez réessayer.',
            );
          return json(200, 'Message accepté par le service de messagerie.', true);
        } catch {
          return json(
            502,
            'L’envoi n’a pas pu être confirmé. Vos saisies sont conservées. Veuillez réessayer.',
          );
        }
      }
      if (!['GET', 'HEAD'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD');
        return respond(405, 'Méthode non autorisée.', 'text/plain; charset=utf-8');
      }
      if (path === '/robots.txt') return respond(200, robots(env), 'text/plain; charset=utf-8');
      if (path === '/sitemap.xml')
        return respond(200, sitemap(env), 'application/xml; charset=utf-8');
      if (conceptPages[path]) {
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        return respond(200, conceptPages[path]());
      }
      if (conceptPages[path + '/']) {
        res.writeHead(308, { Location: path + '/' });
        return res.end();
      }
      if (pages[path] && path !== '/404/') return respond(200, renderPage(path));
      if (pages[path + '/']) {
        res.writeHead(308, { Location: path + '/' });
        return res.end();
      }
      if (path.includes('\0') || path.includes('\\'))
        return respond(400, 'Requête invalide.', 'text/plain; charset=utf-8');
      const target = resolve(root, '.' + path);
      if (target.startsWith(root) && types[extname(target)]) {
        try {
          const actual = await realpath(target);
          if (!actual.startsWith(root) || !(await stat(actual)).isFile())
            throw new Error('Not public');
          const content = await readFile(actual);
          const etag = `"${createHash('sha256').update(content).digest('hex')}"`;
          const headers = {
            'Content-Type': types[extname(actual)],
            'Cache-Control': 'public, no-cache',
            ETag: etag,
          };
          if (req.headers['if-none-match']?.split(',').some((value) => value.trim() === etag)) {
            res.writeHead(304, headers);
            return res.end();
          }
          res.writeHead(200, headers);
          return res.end(req.method === 'HEAD' ? undefined : content);
        } catch {
          /* Ressource absente : vraie réponse 404 ci-dessous. */
        }
      }
      return respond(404, renderPage('/404/'));
    } catch {
      // Aucun corps de requête, secret ni renseignement personnel n'est journalisé.
      return respond(500, 'Le site est temporairement indisponible.', 'text/plain; charset=utf-8');
    }
  });
  server.requestTimeout = 20000;
  server.headersTimeout = 15000;
  server.on('close', () => limiter.close());
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.env.PUBLICATION_READY === 'true' && !publicationReady())
    throw new Error(
      'Publication bloquée : compléter SITE_URL et les informations légales dans src/content.js.',
    );
  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || '127.0.0.1';
  const server = createApp();
  server.listen(port, host, () => console.log(`Baerg Design : http://${host}:${port}`));
  for (const signal of ['SIGTERM', 'SIGINT'])
    process.on(signal, () => server.close(() => process.exit(0)));
}
