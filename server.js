import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Local preview: only runtime files are served.
const root = fileURLToPath(new URL('./', import.meta.url));
const hostname = process.argv.includes('--lan') ? '0.0.0.0' : '127.0.0.1';
const requestedPort = Number(process.env.PORT || 4612);
if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  console.error('PORT doit être un entier compris entre 1 et 65535.');
  process.exit(1);
}
const autoPort = process.argv.includes('--dev') && !process.env.PORT;
let port = requestedPort;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const redirects = JSON.parse(await readFile(new URL('./redirects.json', import.meta.url), 'utf8'));
async function notFound(req, res) {
  const data = await readFile(new URL('./404.html', import.meta.url));
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' });
  res.end(req.method === 'HEAD' ? undefined : data);
}
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const legacyPath = pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
    if (Object.hasOwn(redirects, legacyPath)) {
      res.writeHead(308, { Location: redirects[legacyPath] + url.search });
      res.end(); return;
    }
    if (pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403); res.end(); return; }
    const entry = pathname.split('/')[1];
    const allowed = new Set(['404.html', '', 'index.html', 'common.css', 'fusion.css', 'app.js', 'motion.js', 'assets', 'demos', 'pages.css', 'theme.css', 'home.css', 'a-propos', 'realisations', 'offres', 'contact']);
    if (!allowed.has(entry)) { await notFound(req, res); return; }
    let file = path.resolve(root, '.' + pathname);
    if (file !== path.resolve(root) && !file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, { Location: pathname + '/' }); res.end(); return; }
      file = path.join(file, 'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { await notFound(req, res); }
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && autoPort && port < Math.min(requestedPort + 20, 65535)) {
    console.log(`Port ${port} occupé, essai du port ${port + 1}…`);
    port += 1;
    server.listen(port, hostname);
    return;
  }
  console.error(error.code === 'EADDRINUSE'
    ? `Le port ${port} est occupé. Arrêtez l’autre serveur ou choisissez un port avec PORT=4613 npm run dev.`
    : `Impossible de démarrer le serveur : ${error.message}`);
  process.exit(1);
});
server.on('listening', () => {
  console.log(`Baerg Design — http://127.0.0.1:${port}`);
  if (hostname === '0.0.0.0') console.log(`Aperçu Wi-Fi actif : ouvrir http://ADRESSE_DU_MAC:${port} sur le téléphone du même réseau.`);
  console.log('Ctrl+C pour arrêter le serveur.');
});
server.listen(port, hostname);
