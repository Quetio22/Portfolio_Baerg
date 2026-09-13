import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { studioArt } from '../src/site.js';

// Share the actual studio concept and palette with the homepage.
let stylesheet = await readFile(new URL('../public/styles.css', import.meta.url), 'utf8');
for (const name of ['pinyon', 'cormorant-regular', 'cormorant-italic', 'dm-sans']) {
  const font = await readFile(new URL(`../public/fonts/${name}.woff2`, import.meta.url));
  stylesheet = stylesheet.replace(
    `/fonts/${name}.woff2`,
    `data:font/woff2;base64,${font.toString('base64')}`,
  );
}
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<html lang="fr"><head><meta charset="utf-8"><style>${stylesheet}
  body{padding:36px 45px;width:1200px;height:630px;overflow:hidden}
  .share-top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:24px}
  .share-top>span{font-size:12px;letter-spacing:.12em}
  .share-layout{display:grid;grid-template-columns:1fr 450px;gap:42px;align-items:center;padding-top:26px}
  .share-copy h1{font-size:78px;line-height:1.02}
  .share-copy p{font-size:17px;margin-top:25px;max-width:390px}
  .studio-art .art-scene{height:405px}
  .studio-art figcaption{font-size:10px}
  .studio-art figcaption>span:last-child{display:none}
  </style></head><body><div class="share-top"><div class="logo"><span class="logo-script">Baerg</span><span class="logo-design">DESIGN</span></div><span>STUDIO WEB INDÉPENDANT</span></div><div class="share-layout"><div class="share-copy"><h1>Des sites web<br>avec du fond.<br>Et du <em>caractère.</em></h1><p>Deux apprentis développeurs.<br>Du premier croquis à la mise en ligne.</p></div>${studioArt()}</div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL('../public/images/og.png', import.meta.url).pathname });
} finally {
  await browser.close();
}
