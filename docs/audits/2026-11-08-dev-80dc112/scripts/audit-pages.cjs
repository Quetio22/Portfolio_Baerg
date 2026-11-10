const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const modules = path.join(root, 'source/experiments/liquid-glass/node_modules');
const playwright = require(path.join(modules, 'playwright'));
const AxeBuilder = require(path.join(modules, '@axe-core/playwright')).default;
const site = process.env.AUDIT_URL || 'http://127.0.0.1:4739';
const engines = (process.env.ENGINES || 'chromium,webkit,firefox').split(',');
const routes = ['/', '/a-propos/', '/realisations/', '/offres/', '/contact/', '/demos/lise/', '/demos/midi-et-compagnie/', '/demos/atelier-traverse/'];
const widths = [320, 390, 650, 651, 820, 1440];
const out = path.join(root, 'evidence');
fs.mkdirSync(path.join(out, 'screenshots'), {recursive:true});
const report = {site, started:new Date().toISOString(), engines:[], renders:[], axe:[], links:[], httpErrors:[], pageErrors:[], failedRequests:[], externalRequests:[], mutations:[], failures:[]};
const links = new Set();
const save = () => fs.writeFileSync(path.join(out, 'pages.json'), JSON.stringify(report, null, 2)+'\n');
const slug = route => route === '/' ? 'accueil' : route.replaceAll('/','-').replace(/^-|-$/g,'');
async function ready(page) {
  await page.evaluate(async()=>{
    await document.fonts.ready;
    for(const image of document.images) image.loading='eager';
    await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
  });
  await page.waitForFunction(()=>!document.querySelector('script[src*="liquid-glass-loader"]') || document.documentElement.hasAttribute('data-glass'), {timeout:10000});
}
(async()=>{
  for(const engine of engines) {
    let browser;
    try {
      browser = await playwright[engine].launch({headless:true});
      report.engines.push({engine, version:browser.version()});
      const context = await browser.newContext({reducedMotion:'reduce'});
      const page = await context.newPage();
      let active = {};
      page.on('pageerror', e=>report.pageErrors.push({...active,message:e.message}));
      page.on('response', r=>{if(r.status()>=400) report.httpErrors.push({...active,status:r.status(),url:r.url()});});
      page.on('requestfailed', r=>report.failedRequests.push({...active,url:r.url(),error:r.failure()}));
      page.on('request', r=>{
        if(!r.url().startsWith(site) && /^https?:/.test(r.url())) report.externalRequests.push({...active,url:r.url()});
        if(!['GET','HEAD'].includes(r.method())) report.mutations.push({...active,method:r.method(),url:r.url()});
      });
      for(const width of widths) for(const route of routes) {
        active = {engine,width,route};
        try {
          await page.setViewportSize({width,height:width<700?844:1000});
          const response = await page.goto(site+route, {waitUntil:'networkidle'});
          await ready(page);
          const metrics = await page.evaluate(()=>{
            const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
            const duplicateIds=ids.filter((v,i)=>ids.indexOf(v)!==i);
            const h1=[...document.querySelectorAll('h1')].map(e=>e.textContent.trim());
            const outside=[...document.querySelectorAll('main h1, main h2, main .eyebrow, main label')].filter(e=>{
              if(!e.checkVisibility()||e.closest('[aria-hidden=true]'))return false;
              const range=document.createRange();range.selectNodeContents(e);
              return [...range.getClientRects()].some(r=>r.left< -1||r.right>innerWidth+1);
            }).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,160)}));
            const images=[...document.images].map(i=>({src:i.currentSrc,broken:!i.naturalWidth,width:i.naturalWidth,loading:i.loading}));
            const resources=performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.decodedBodySize,transferSize:r.transferSize,duration:r.duration,type:r.initiatorType}));
            return {title:document.title,lang:document.documentElement.lang,glass:document.documentElement.dataset.glass||null,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1,duplicateIds,outside,images,resources,
              meta:{robots:document.querySelector('meta[name=robots]')?.content,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,ogTitle:document.querySelector('meta[property="og:title"]')?.content,ogImage:document.querySelector('meta[property="og:image"]')?.content},
              animations:document.getAnimations().filter(a=>a.playState==='running').length};
          });
          const item={...active,status:response.status(),...metrics};
          report.renders.push(item);
          if(item.status!==200||item.scrollWidth>width+1||item.h1.length!==1||item.duplicateIds.length||item.images.some(i=>i.broken)||item.outside.length)report.failures.push({type:'page-metrics',...active,status:item.status,overflow:item.scrollWidth-width,h1:item.h1,duplicateIds:item.duplicateIds,outside:item.outside,broken:item.images.filter(i=>i.broken)});
          for(const href of await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.href))) if(href.startsWith(site)) links.add(href);
          const capture = (engine==='chromium' && [390,1440].includes(width)) || (engine==='webkit'&&width===390) || (engine==='firefox'&&width===1440);
          if(capture){
            await page.screenshot({path:path.join(out,'screenshots',`${engine}-${slug(route)}-${width}.jpg`),type:'jpeg',quality:76,fullPage:true});
          }
          if([390,1440].includes(width)) {
            const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
            report.axe.push({...active,passes:result.passes.length,violations:result.violations,incomplete:result.incomplete});
          }
          save();
        } catch(error){report.failures.push({...active,type:'execution',error:error.stack});save();}
      }
      if(engine===engines[0])for(const href of links){
        const url=new URL(href);url.hash='';
        const response=await context.request.get(url.href);
        let fragmentExists=true;
        if(new URL(href).hash) {
          const html=await response.text();
          const id=decodeURIComponent(new URL(href).hash.slice(1));
          fragmentExists=html.includes(`id="${id}"`)||html.includes(`id='${id}'`);
        }
        report.links.push({url:href,status:response.status(),fragmentExists});
      }
      await context.close();
    } catch(error){report.failures.push({engine,type:'engine',error:error.stack});}
    finally{await browser?.close();save();}
    console.log(JSON.stringify({engine,renders:report.renders.filter(x=>x.engine===engine).length,axe:report.axe.filter(x=>x.engine===engine).length,failures:report.failures.filter(x=>x.engine===engine).length}));
  }
  report.completed=new Date().toISOString();save();
  console.log(JSON.stringify({renders:report.renders.length,axe:report.axe.length,violations:report.axe.reduce((n,x)=>n+x.violations.length,0),httpErrors:report.httpErrors.length,pageErrors:report.pageErrors.length,failures:report.failures.length}));
})().catch(error=>{report.failures.push({error:error.stack});save();console.error(error);process.exitCode=1;});
