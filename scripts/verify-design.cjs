const fs=require('fs'),path=require('path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const site=process.env.SITE_URL||'http://127.0.0.1:4612';
const baselineURL=process.env.BASELINE_URL;
const recordDir=path.join(root,'provenance/empreinte-signal-2026-10-21');
const captures=process.env.CAPTURE_DIR||path.join(root,'test-results/empreinte-signal');
fs.mkdirSync(recordDir,{recursive:true});fs.mkdirSync(captures,{recursive:true});
const baselineFile=path.join(recordDir,'layout-before.json');
const routes=['/','/a-propos/','/realisations/','/offres/','/contact/'];
const widths=[1440,820,390,320];
const report={date:new Date().toISOString(),site,renders:[],layoutChecks:[],interactions:[],links:[],failures:[],jsErrors:[],httpErrors:[],postRequests:[]};
const check=(ok,label)=>{if(!ok)report.failures.push(label);};
const layout=()=>{
 const selectors=['.page-intro','.section','.founders','.editorial','.portfolio-project','.launch-offer','.launch-details','.priced-offer','.sponsor-offer','.contact-grid','.form-grid'];
 const props=['display','gridTemplateColumns','columnGap','rowGap','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','flexDirection','order'];
 return {markup:document.querySelector('main').innerHTML,elements:selectors.flatMap(selector=>[...document.querySelectorAll(selector)].map((element,index)=>{const css=getComputedStyle(element);return {selector,index,properties:Object.fromEntries(props.map(k=>[k,css[k]]))};}))};
};
async function ready(page){await page.evaluate(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
 try{
  const context=await browser.newContext({reducedMotion:'reduce'});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:site});
  const page=await context.newPage();
  let baseline=fs.existsSync(baselineFile)?JSON.parse(fs.readFileSync(baselineFile)):{};
  if(baselineURL){
   baseline={};for(const route of routes.slice(1))for(const width of widths){await page.setViewportSize({width,height:1000});await page.goto(baselineURL+route,{waitUntil:'networkidle'});await ready(page);baseline[route+'@'+width]=await page.evaluate(layout);}
   fs.writeFileSync(baselineFile,JSON.stringify(baseline,null,2)+'\n');
  }
  page.on('pageerror',e=>report.jsErrors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.httpErrors.push(`${r.status()} ${r.url()}`);});page.on('request',r=>{if(r.method()==='POST')report.postRequests.push(r.url());});
  const links=new Set();
  for(const route of routes)for(const width of widths){
   await page.setViewportSize({width,height:width<600?844:1000});const response=await page.goto(site+route,{waitUntil:'networkidle'});await ready(page);
   check(response.status()===200,`${route} ${width}: HTTP`);
   const metrics=await page.evaluate(()=>({backgroundColor:getComputedStyle(document.body).backgroundColor,overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),headings:[...document.querySelectorAll('main h1')].map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()})),sections:[...document.querySelectorAll('main>section')].map(e=>e.className)}));
   check(metrics.backgroundColor!=='rgba(0, 0, 0, 0)',`${route} ${width}: opaque background fallback`);check(!metrics.overflow,`${route} ${width}: horizontal overflow`);check(!metrics.broken.length,`${route} ${width}: images`);check(metrics.headings.length===1,`${route} ${width}: one main heading`);check(metrics.headings.every(h=>h.rect.left>=-1&&h.rect.right<=width+1),`${route} ${width}: heading bounds`);
   if(route!=='/'){
    const actual=await page.evaluate(layout),before=baseline[route+'@'+width];check(Boolean(before),`${route} ${width}: baseline exists`);
    if(before){check(actual.markup===before.markup,`${route} ${width}: page content and DOM preserved`);check(JSON.stringify(actual.elements)===JSON.stringify(before.elements),`${route} ${width}: structural CSS preserved`);report.layoutChecks.push({route,width,mainDOM:actual.markup===before.markup,layout:JSON.stringify(actual.elements)===JSON.stringify(before.elements)});}
   }
   const filename=route==='/'?'accueil':route.replaceAll('/','');
   await page.screenshot({path:path.join(captures,`${filename}-${width}.png`)});
   if([1440,390].includes(width))await page.screenshot({path:path.join(captures,`${filename}-full-${width}.png`),fullPage:true});
   for(const href of await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.href)))if(href.startsWith(site))links.add(href);
   if(width<651){await page.locator('.menu-toggle').click();check(await page.locator('#navigation').isVisible(),`${route} ${width}: mobile menu`);await page.keyboard.press('Escape');check(!(await page.locator('#navigation').isVisible()),`${route} ${width}: Escape closes menu`);await page.locator('.menu-toggle').click();await page.locator('#navigation a[href="/offres/"]').click();check(new URL(page.url()).pathname==='/offres/',`${route} ${width}: menu navigation`);await page.goto(site+route,{waitUntil:'networkidle'});}
   await page.locator('[data-legal]').click();check(await page.locator('#legal-dialog').isVisible(),`${route} ${width}: legal dialog`);await page.keyboard.press('Escape');
   report.renders.push({route,width,...metrics});report.interactions.push({route,width,menu:true,legal:true});
  }
  for(const href of links){const r=await context.request.get(href);check(r.ok(),`link ${href}: ${r.status()}`);report.links.push({url:href,status:r.status()});}
  await page.setViewportSize({width:1440,height:1000});await page.goto(site+'/offres/',{waitUntil:'networkidle'});
  for(const [selector,query]of [['#lancement .button','projet=refonte'],['.sponsor-offer .text-link','projet=sponsor'],['.photo-option .text-link','option=photographies']]){
   await page.locator(selector).click();check(page.url().includes(query),'offer contact: '+query);
   if(query==='projet=sponsor')check(await page.locator('#projectType').inputValue()==='Sponsor','sponsor preselection');
   if(query==='projet=refonte')check(await page.locator('#projectType').inputValue()==='Refonte de site','refonte preselection');
   if(query==='option=photographies')check((await page.locator('#message').inputValue()).includes('photographies professionnelles'),'photo prefill');
   await page.goto(site+'/offres/',{waitUntil:'networkidle'});
  }
  await page.goto(site+'/contact/',{waitUntil:'networkidle'});await page.locator('#name').fill('Test local');await page.locator('#email').fill('test@example.test');await page.locator('#message').fill('Je souhaite parler de la refonte de mon site.');
  await page.locator('#project-form button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#form-feedback').textContent.includes('Aucun message envoyé'));check(!report.postRequests.length,'contact remains local');
  await page.goto(site,{waitUntil:'networkidle'});await page.evaluate(()=>scrollTo(0,1300));await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-hidden'));await page.evaluate(()=>scrollBy(0,-50));await page.waitForFunction(()=>!document.querySelector('.site-header').classList.contains('is-hidden'));report.headerScroll=true;
  const demoLinks=report.links.filter(x=>x.url.includes('/demos/')).map(x=>x.url);
  for(const url of [...new Set(demoLinks)]){await page.goto(url,{waitUntil:'networkidle'});await ready(page);check(await page.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0)),`demo images: ${url}`);const back=page.locator('[data-lab-return]').first();if(await back.count()){await back.click();check(new URL(page.url()).pathname==='/realisations/','demo return to realisations');}}
  check(!report.jsErrors.length,'no JavaScript errors');check(!report.httpErrors.length,'no HTTP errors');
  report.result=report.failures.length?'failed':'passed';fs.writeFileSync(path.join(recordDir,'verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({result:report.result,renders:report.renders.length,layouts:report.layoutChecks.length,links:report.links.length,failures:report.failures,jsErrors:report.jsErrors,httpErrors:report.httpErrors},null,2));
  if(report.failures.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{report.result='error';report.failures.push(e.message);fs.writeFileSync(path.join(recordDir,'verification.json'),JSON.stringify(report,null,2)+'\n');console.error(e);process.exit(1);});
