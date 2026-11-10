const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),modules=path.join(root,'source/experiments/liquid-glass/node_modules');
const pw=require(path.join(modules,'playwright'));
const site=process.env.AUDIT_URL||'http://127.0.0.1:4739';
const report={site,tests:[],errors:[]};
const write=()=>fs.writeFileSync(path.join(root,'evidence',process.env.REPORT_NAME||'functional.json'),JSON.stringify(report,null,2)+'\n');
const check=(condition,message)=>{if(!condition)throw Error(message)};
async function run(engine,name,fn){if(process.env.TEST_FILTER&&!name.includes(process.env.TEST_FILTER))return;try{const detail=await fn();report.tests.push({engine,name,result:'passed',detail});}catch(e){report.tests.push({engine,name,result:'failed',error:e.stack});}write();}
const main=['/','/a-propos/','/realisations/','/offres/','/contact/'];
const routes=[...main,'/demos/lise/','/demos/midi-et-compagnie/','/demos/atelier-traverse/'];
async function ready(p){await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>!document.querySelector('script[src*="liquid-glass-loader"]')||!!document.documentElement.dataset.glass);}
(async()=>{
for(const engine of (process.env.ENGINES||'chromium,webkit,firefox').split(',')){
 const browser=await pw[engine].launch({headless:true});
 try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();
 let mutations=[];
 page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))mutations.push({method:r.method(),url:r.url()});});
 await run(engine,'menu au clavier, Escape, focus et fermeture extérieure — cinq pages',async()=>{
  const details=[];
  for(const route of main){
   await page.goto(site+route,{waitUntil:'networkidle'});await ready(page);
   await page.locator('.menu-toggle').focus();await page.keyboard.press('Enter');
   await page.waitForFunction(()=>document.activeElement===document.querySelector('#navigation a'));
   check(await page.locator('#navigation').isVisible(),'menu invisible '+route);
   check(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true','aria-expanded '+route);
   await page.keyboard.press('Escape');
   check(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement),'focus après Escape '+route);
   await page.locator('.menu-toggle').click();await page.mouse.click(5,430);
   check(await page.locator('.menu-toggle').getAttribute('aria-expanded')==='false','clic extérieur '+route);
   await page.locator('.menu-toggle').click();await page.locator('#navigation a[href="/offres/"]').click();
   check(new URL(page.url()).pathname==='/offres/','navigation '+route);
   details.push(route);
  }return details;
 });
 await run(engine,'lien d’évitement accessible au premier Tab — huit pages',async()=>{
  const details=[];
  for(const route of routes){
   await page.goto(site+route,{waitUntil:'networkidle'});await ready(page);await page.keyboard.press(engine==='webkit'?'Alt+Tab':'Tab');
   const focused=await page.evaluate(()=>({href:document.activeElement.getAttribute('href'),text:document.activeElement.textContent.trim(),rect:document.activeElement.getBoundingClientRect().toJSON()}));
   check(focused.href==='#contenu','premier Tab '+route+JSON.stringify(focused));
   check(focused.rect.top>=-1&&focused.rect.bottom<=844,'lien d’évitement hors écran '+route);
   await page.keyboard.press('Enter');
   const destination=await page.evaluate(()=>({id:document.activeElement.id,hash:location.hash}));
   check(destination.hash==='#contenu','ancre contenu '+route);
   details.push({route,focused,destination});
  }return details;
 });
 await run(engine,'fenêtre juridique : piège de focus, fermeture et retour — cinq pages',async()=>{
  const details=[];
  for(const route of main){
   await page.goto(site+route,{waitUntil:'networkidle'});await ready(page);
   const trigger=page.locator('[data-legal]');await trigger.focus();await page.keyboard.press('Enter');
   check(await page.locator('#legal-dialog').isVisible(),'fenêtre invisible');
   for(let i=0;i<5;i++){await page.keyboard.press('Tab');check(await page.evaluate(()=>document.activeElement===document.body||document.querySelector('#legal-dialog').contains(document.activeElement)),'focus dans un contrôle extérieur à la fenêtre');}
   const text=await page.locator('#legal-dialog').innerText();
   await page.keyboard.press('Escape');check(!await page.locator('#legal-dialog').isVisible(),'Escape ne ferme pas');
   check(await trigger.evaluate(e=>e===document.activeElement),'focus non restauré');details.push({route,text});
  }return details;
 });
 await run(engine,'préremplissage refonte, sponsor et photo',async()=>{
  const details=[];
  for(const [query,value] of [['projet=refonte','Refonte de site'],['projet=sponsor','Sponsor'],['projet=creation','Création de site'],['projet=autre','Autre projet']]){
   await page.goto(site+'/contact/?'+query,{waitUntil:'networkidle'});check(await page.locator('#projectType').inputValue()===value,'préremplissage '+query);details.push({query,value});
  }
  await page.goto(site+'/contact/?projet=refonte&option=photographies',{waitUntil:'networkidle'});
  check((await page.locator('#message').inputValue()).includes('photographies professionnelles'),'option photo');return details;
 });
 await run(engine,'formulaire : champs obligatoires et e-mail invalide bloqués',async()=>{
  await page.goto(site+'/contact/',{waitUntil:'networkidle'});await ready(page);
  await page.locator('button[type=submit]').click();check(await page.locator('#name').evaluate(e=>!e.validity.valid),'nom manquant non détecté');
  await page.locator('#name').fill('Recette locale');await page.locator('#email').fill('pas-un-email');
  check(await page.locator('#email').evaluate(e=>e.validity.typeMismatch),'email invalide accepté');
  await page.locator('#email').fill('audit@example.test');await page.locator('#message').fill('court');await page.locator('button[type=submit]').click();
  check(await page.locator('#message').evaluate(e=>e.validity.tooShort),'message court accepté');return {mutations};
 });
 await run(engine,'copie de brouillon — succès simulé, aucun envoi',async()=>{
  await page.goto(site+'/contact/',{waitUntil:'networkidle'});await ready(page);
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.__auditCopied=text;}}});});
  await page.locator('#name').fill('Recette Baerg');await page.locator('#email').fill('audit@example.test');await page.locator('#message').fill('Essai local sans transmission de message.');
  await page.locator('button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#form-feedback').textContent.includes('Brouillon copié'));
  check((await page.evaluate(()=>window.__auditCopied)).includes('Recette Baerg'),'brouillon incorrect');check(mutations.length===0,'requête mutante détectée');
  return {feedback:await page.locator('#form-feedback').innerText(),transport:'presse-papiers simulé ; pas de transport e-mail'};
 });
 await run(engine,'copie de brouillon — refus simulé et repli manuel',async()=>{
  await page.goto(site+'/contact/',{waitUntil:'networkidle'});await ready(page);
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('Refus audit','NotAllowedError')}}});});
  await page.locator('#name').fill('Recette refus');await page.locator('#email').fill('audit@example.test');await page.locator('#message').fill('Essai de copie refusée, aucun envoi.');
  await page.locator('button[type=submit]').click();await page.waitForFunction(()=>!document.querySelector('#draft-fallback').hidden);
  check((await page.locator('#draft-text').inputValue()).includes('Recette refus'),'repli sans contenu');
  check(await page.locator('#draft-text').evaluate(e=>document.activeElement===e&&e.selectionEnd===e.value.length),'texte non sélectionné');
  return {feedback:await page.locator('#form-feedback').innerText(),mutations};
 });
 for(const blocked of ['glass.css','glass.js'])await run(engine,'repli natif : '+blocked+' indisponible',async()=>{
  const p=await context.newPage();try{
   await p.route('**/liquid-glass/'+blocked,r=>r.abort());await p.goto(site+'/',{waitUntil:'networkidle'});
   await p.waitForFunction(()=>document.documentElement.dataset.glass==='original');check(await p.locator('.glass-native').count()===0,'décoration partielle');
   await p.locator('.closing .button').click();check(new URL(p.url()).pathname==='/contact/','lien inutilisable');return {fallback:'original'};
  }finally{await p.close();}
 });
 await run(engine,'Lise : erreur, soin, samedi, horaire, récapitulatif, retour et réinitialisation',async()=>{
  await page.goto(site+'/demos/lise/',{waitUntil:'networkidle'});await ready(page);
  await page.locator('[data-next="2"]').click();check(await page.locator('#booking-error').isVisible(),'pas d’erreur soin manquant');
  await page.locator('input[name=service][value=visage]').check();await page.locator('[data-next="2"]').click();
  await page.locator('[data-next="3"]').click();check(await page.locator('#booking-error').isVisible(),'pas d’erreur jour manquant');
  await page.locator('input[name=day][value=Samedi]').check();await page.locator('[data-next="3"]').click();check(await page.locator('#booking-error').isVisible(),'pas d’erreur horaire manquant');
  await page.locator('input[name=time][value="12:00"]').check();await page.locator('[data-next="3"]').click();
  const summary=await page.locator('#booking-summary').innerText();check(summary.includes('95 CHF')&&summary.includes('13 h 00'),'récapitulatif incorrect '+summary);
  await page.locator('[data-back="2"]').click();await page.locator('[data-next="3"]').click();await page.locator('#booking-form button[type=submit]').click();
  check(await page.locator('#booking-complete').isVisible(),'pas de confirmation de simulation');await page.locator('#restart').click();
  check(await page.locator('input[name=service]:checked').count()===0,'choix non réinitialisé');check(mutations.length===0,'simulation envoie des données');return {summary,mutations};
 });
 await run(engine,'Midi : filtres, réservation désactivée et retour portfolio',async()=>{
  await page.goto(site+'/demos/midi-et-compagnie/',{waitUntil:'networkidle'});await ready(page);
  const filters=page.locator('[data-filter]');const states=[];
  for(let i=0;i<await filters.count();i++){const f=filters.nth(i);await f.click();check(await f.getAttribute('aria-pressed')==='true','filtre non sélectionné');states.push({filter:await f.getAttribute('data-filter'),hidden:await page.locator('[hidden]').count()});}
  check(await page.locator('button[aria-describedby=reservation-note]').isDisabled(),'réservation de démo active');
  await page.locator('[data-lab-return]').first().click();check(new URL(page.url()).pathname==='/realisations/','retour incorrect');return states;
 });
 await run(engine,'Traverse : galerie au clavier, formulaire simulé, fermeture et effacement',async()=>{
  await page.goto(site+'/demos/atelier-traverse/',{waitUntil:'networkidle'});await ready(page);
  const gallery=page.locator('.gallery-select');await gallery.nth(1).focus();await page.keyboard.press('Enter');check(await gallery.nth(1).getAttribute('aria-pressed')==='true','galerie 2');
  await page.keyboard.press('ArrowLeft');check(await gallery.first().getAttribute('aria-pressed')==='true','galerie gauche');
  await page.locator('[data-contact]').click();check(await page.locator('#contact-demo').isVisible(),'dialogue absent');
  await page.locator('#project').fill('Un meuble de recette locale.');await page.locator('#email').fill('audit@example.test');await page.locator('button.submit').click();
  check(await page.locator('.form-result').isVisible(),'confirmation absente');await page.keyboard.press('Escape');
  check(!await page.locator('#contact-demo').isVisible(),'Escape ne ferme pas');await page.locator('[data-contact]').click();check(await page.locator('#project').inputValue()==='','données conservées après fermeture');
  check(mutations.length===0,'requête de démonstration détectée');return {mutations};
 });
 await run(engine,'mouvement réduit — huit pages et cartes studio',async()=>{
  const details=[];
  for(const route of routes){await page.goto(site+route,{waitUntil:'networkidle'});await ready(page);const animations=await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').map(a=>({target:a.effect?.target?.className,duration:a.effect?.getTiming()?.duration})));check(animations.length===0,'animations actives '+route+JSON.stringify(animations));details.push({route,animations});}
  return details;
 });
 await run(engine,'sans JavaScript — contenu présent et navigation par liens',async()=>{
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});try{
   const p=await nojs.newPage();const details=[];
   for(const route of routes){await p.goto(site+route,{waitUntil:'networkidle'});check(await p.locator('h1').count()===1,'contenu principal absent '+route);details.push({route,links:await p.locator('a:visible').count(),menus:await p.locator('.menu-toggle:visible').count()});}
   return details;
  }finally{await nojs.close();}
 });
 await run(engine,'reflow 200 % et 400 % par largeur CSS équivalente — cinq pages',async()=>{
  const details=[];
  await page.setViewportSize({width:1280,height:1000});
  for(const zoom of [2,4])for(const route of main){
   await page.setViewportSize({width:1280/zoom,height:1000/zoom});await page.goto(site+route,{waitUntil:'networkidle'});await ready(page);
   const metrics=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,zoom:getComputedStyle(document.documentElement).zoom,bodyWidth:document.body.getBoundingClientRect().width}));
   check(metrics.scrollWidth<=metrics.viewport+1,'débordement en reflow '+route+' '+zoom);details.push({route,equivalentZoom:zoom,...metrics});
   if(engine==='chromium'&&['/','/contact/'].includes(route))await page.screenshot({path:path.join(root,'evidence/screenshots',`reflow-${zoom}-${route==='/'?'accueil':'contact'}.jpg`),type:'jpeg',quality:76});
  }
  return {method:'Reflow à 640 puis 320 pixels CSS, équivalent en largeur à une fenêtre de 1280 pixels zoomée à 200/400 %. Ne remplace pas un vrai zoom navigateur ou système sur appareil physique.',observations:details};
 });
 await context.close();
 }finally{await browser.close();}
 console.log(engine+': '+report.tests.filter(t=>t.engine===engine&&t.result==='passed').length+'/'+report.tests.filter(t=>t.engine===engine).length+' contrôles réussis');
}
write();console.log(JSON.stringify({tests:report.tests.length,passed:report.tests.filter(t=>t.result==='passed').length,failed:report.tests.filter(t=>t.result==='failed').map(t=>({engine:t.engine,name:t.name,error:t.error.split('\n')[0]}))}));
})().catch(e=>{report.errors.push(e.stack);write();console.error(e);process.exitCode=1;});
