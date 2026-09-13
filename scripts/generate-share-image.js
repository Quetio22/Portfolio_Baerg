import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const font = async (name) =>
  (await readFile(new URL(`../public/fonts/${name}.woff2`, import.meta.url))).toString('base64');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  await page.setContent(`<html><head><style>
  @font-face{font-family:Pinyon;src:url(data:font/woff2;base64,${await font('pinyon')})} 
  @font-face{font-family:Cormorant;src:url(data:font/woff2;base64,${await font('cormorant-regular')})}
  @font-face{font-family:Cormorant;src:url(data:font/woff2;base64,${await font('cormorant-italic')});font-style:italic}
  @font-face{font-family:DM;src:url(data:font/woff2;base64,${await font('dm-sans')})}
  *{box-sizing:border-box}body{margin:0;background:#f7f3ec;color:#20211f;padding:55px 65px;font-family:DM;width:1200px;height:630px}.top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #d8d2c9;padding-bottom:22px}.logo{color:#793c37;text-align:center;line-height:1}.logo b{font-family:Pinyon;font-weight:400;font-size:69px;display:block}.logo span{font-size:9px;letter-spacing:5px;padding-left:9px}.tag{font-size:12px;letter-spacing:3px}h1{font-family:Cormorant;font-size:91px;font-weight:400;line-height:.95;letter-spacing:-3px;margin:43px 0 24px}em{color:#793c37}p{font-size:15px;color:#68665f}.mark{position:absolute;right:86px;top:245px;width:220px;height:260px;background:#793c37;border-radius:150px 150px 0 0}.mark:before{content:'';position:absolute;inset:30px 35px 0;border:1px solid #e5c7b8;border-radius:130px 130px 0 0}.mark:after{content:'';position:absolute;inset:60px 70px 0;border:1px solid #e5c7b8;border-radius:100px 100px 0 0}</style></head><body><div class="top"><div class="logo"><b>Baerg</b><span>DESIGN</span></div><span class="tag">STUDIO WEB INDÉPENDANT</span></div><h1>Des sites web<br>avec du fond.<br>Et du <em>caractère.</em></h1><p>Création & refonte de sites web.</p><div class="mark"></div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL('../public/images/og.png', import.meta.url).pathname });
} finally {
  await browser.close();
}
