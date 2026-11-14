// The domain is supplied at build time; development never invents a public URL.
export function publicOrigin(value) {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash || /^(localhost|127\.|\[::1\])/.test(url.hostname)) {
    throw new Error('SITE_URL doit être une origine HTTPS publique, sans chemin, paramètres ou identifiants.');
  }
  return url.origin;
}
export function withPublicMetadata(html, origin, route) {
  if (!origin) return html;
  const page = new URL(route, origin).href;
  const image = new URL('/assets/brand/share.png', origin).href;
  return html.replaceAll('content="/assets/brand/share.png"', `content="${image}"`)
    .replace('</head>', `<link rel="canonical" href="${page}"><meta property="og:url" content="${page}"></head>`);
}
