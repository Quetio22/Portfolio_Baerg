// The entire landscape moves together; no separate mountain or forest layers.
(() => {
 const hero=document.querySelector('.hero'), scene=document.querySelector('.landscape');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(pointer: fine)');
 const control=document.querySelector('.motion-control');
 let frame=0, x=0, y=0, visible=true;
 const stopped=()=>reduce.matches||document.body.classList.contains('motion-off')||document.hidden||!visible;
 const render=()=>{frame=0;const active=!stopped();scene.style.setProperty('--scene-x',`${active?x*3:0}px`);scene.style.setProperty('--scene-y',`${active?y*2:0}px`)};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(render)};
 const sync=()=>{const off=stopped();scene.querySelector('.fissure-light').style.animationPlayState=off?'paused':'running';control.setAttribute('aria-pressed',String(reduce.matches||document.body.classList.contains('motion-off')));control.textContent=reduce.matches?'Mouvement : réduit':document.body.classList.contains('motion-off')?'Mouvement : arrêté':'Mouvement : actif';schedule()};
 hero.addEventListener('pointermove',e=>{if(!fine.matches||stopped())return;const r=hero.getBoundingClientRect();x=(e.clientX-r.left)/r.width*2-1;y=(e.clientY-r.top)/r.height*2-1;schedule()},{passive:true});
 hero.addEventListener('pointerleave',()=>{x=y=0;schedule()});
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
 new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()}).observe(hero);
 reduce.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
})();
