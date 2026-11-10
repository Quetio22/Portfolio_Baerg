const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const {chromium}=require(path.join(root,'source/experiments/liquid-glass/node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce',deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:4739/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 const selectors=['#navigation a:nth-child(1)','#navigation a:nth-child(2)','#navigation a:nth-child(3)','#navigation a:nth-child(4)','#navigation a:nth-child(5)','#home-title span:nth-child(1)','#home-title span:nth-child(2)','.home-primary','.home-secondary','.home-label'];
 const items=await page.evaluate(selectors=>selectors.map(selector=>{const e=document.querySelector(selector),c=getComputedStyle(e);return {selector,text:e.textContent.trim(),rect:e.getBoundingClientRect().toJSON(),color:c.color,font:c.fontSize,weight:c.fontWeight};}),selectors);
 await page.screenshot({path:path.join(root,'evidence/contrast-original.png')});
 const style=await page.addStyleTag({content:selectors.join(',')+'{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}'});
 await page.screenshot({path:path.join(root,'evidence/contrast-background.png')});
 await style.evaluate(e=>e.remove());
 fs.writeFileSync(path.join(root,'evidence/contrast-elements.json'),JSON.stringify(items,null,2)+'\n');
 console.log('Contraste : captures originales et fonds sous les glyphes conservés.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
