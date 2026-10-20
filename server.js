import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Local preview: only runtime files are served.
const root = fileURLToPath(new URL('./', import.meta.url));
const requestedPort = Number(process.env.PORT || 4612);
if (!Number.isInteger(requestedPort) || requestedPort < 1 || requestedPort > 65535) {
  console.error('PORT doit être un entier compris entre 1 et 65535.');
  process.exit(1);
}
const autoPort = process.argv.includes('--dev') && !process.env.PORT;
let port = requestedPort;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.split('/').some(part => part.startsWith('.'))) { res.writeHead(403); res.end(); return; }
    const entry = pathname.split('/')[1];
    const allowed = new Set(['', 'index.html', 'common.css', 'fusion.css', 'app.js', 'motion.js', 'assets', 'demos']);
    if (!allowed.has(entry)) { res.writeHead(404); res.end(); return; }
    let file = path.resolve(root, '.' + pathname);
    if (file !== path.resolve(root) && !file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, { Location: pathname + '/' }); res.end(); return; }
      file = path.join(file, 'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && autoPort && port < Math.min(requestedPort + 20, 65535)) {
    console.log(`Port ${port} occupé, essai du port ${port + 1}…`);
    port += 1;
    server.listen(port, '127.0.0.1');
    return;
  }
  console.error(error.code === 'EADDRINUSE'
    ? `Le port ${port} est occupé. Arrêtez l’autre serveur ou choisissez un port avec PORT=4613 npm run dev.`
    : `Impossible de démarrer le serveur : ${error.message}`);
  process.exit(1);
});
server.on('listening', () => {
  console.log(`Baerg Design — http://127.0.0.1:${port}`);
  console.log('Ctrl+C pour arrêter le serveur.');
});
server.listen(port, '127.0.0.1');
