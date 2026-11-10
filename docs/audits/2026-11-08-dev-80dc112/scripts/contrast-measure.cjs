const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'evidence');
const {PNG}=require(path.join(root,'source/experiments/liquid-glass/node_modules/playwright-core/lib/utilsBundle.js'));
const bg=PNG.sync.read(fs.readFileSync(path.join(out,'contrast-background.png')));
const normal=PNG.sync.read(fs.readFileSync(path.join(out,'contrast-original.png')));
const items=JSON.parse(fs.readFileSync(path.join(out,'contrast-elements.json'))),result=[];
function luminance(rgb){const c=rgb.map(x=>x/255).map(x=>x<=0.04045?x/12.92:((x+0.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
const pixel=(p,x,y)=>[...p.data.subarray((y*p.width+x)*4,(y*p.width+x)*4+3)];
for(const item of items){
 const fg=item.color.match(/\d+/g).slice(0,3).map(Number),r=item.rect,values=[];
 for(let y=Math.max(0,Math.floor(r.y));y<Math.min(bg.height,Math.ceil(r.bottom));y++)for(let x=Math.max(0,Math.floor(r.x));x<Math.min(bg.width,Math.ceil(r.right));x++){
  const n=pixel(normal,x,y),b=pixel(bg,x,y);
  if(Math.max(...n.map((v,i)=>Math.abs(v-fg[i])))<=12 && n.reduce((s,v,i)=>s+Math.abs(v-b[i]),0)>60)values.push(ratio(fg,b));
 }
 if(!values.length)continue;
 values.sort((a,b)=>a-b);
 const size=parseFloat(item.font),threshold=size>=24||(Number(item.weight)>=700&&size>=18.66)?3:4.5;
 const round=n=>Math.round(n*100)/100;
 result.push({...item,method:'Fond capturé avec les glyphes masqués ; échantillons limités aux pixels de texte presque pleins de la capture originale, hors anticrénelage.',samples:values.length,minRatio:round(values[0]),p05Ratio:round(values[Math.floor(values.length*.05)]),medianRatio:round(values[Math.floor(values.length/2)]),threshold,fractionBelowThreshold:Math.round(values.filter(v=>v<threshold).length/values.length*1000)/1000});
}
fs.writeFileSync(path.join(out,'contrast-sampled.json'),JSON.stringify(result,null,2)+'\n');
for(const r of result)console.log(JSON.stringify({selector:r.selector,min:r.minRatio,median:r.medianRatio,below:r.fractionBelowThreshold}));
