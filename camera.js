/* World coordinates stay 960 × 480. Only the view changes. */
window.JourneyView=class {
 constructor(canvas){
  this.canvas=canvas;this.w=960;this.h=480;this.x=0;this.scale=1;this.ox=0;this.oy=0;this.viewW=960;this.phase='idle';this.elapsed=0;this.snapNext=true;
  this.motion=matchMedia('(prefers-reduced-motion: reduce)');
  this.resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;this.w=r.width;this.h=r.height;this.dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(1400000/(this.w*this.h)));canvas.width=Math.round(this.w*this.dpr);canvas.height=Math.round(this.h*this.dpr);this.snapNext=true};
  this.observer=new ResizeObserver(this.resize);this.observer.observe(canvas);this.resize();
 }
 enter(city,seen,onReady){this.city=city;this.elapsed=0;this.phase=seen?'play':'panorama';this.onReady=onReady;this.snapNext=true;this.x=0;if(!seen){this.viewW=960;this.scale=Math.min(this.w/960,this.h/480);this.ox=(this.w-960*this.scale)/2;this.oy=(this.h-480*this.scale)/2}if(seen)onReady();}
 skip(){if(this.phase==='panorama'){this.phase='play';this.snapNext=true;this.onReady?.();}}
 update(player,platforms,lastPlatform,dt,active){
  const targetW=Math.min(960,Math.max(360,480*this.w/this.h));
  const index=player.ground&&Number.isInteger(player.on)?player.on:lastPlatform;
  const next=platforms[Math.min(Math.max(0,index)+1,platforms.length-1)];
  let desired=player.x-targetW*.36;
  if(next)desired=Math.max(desired,Math.min(player.x-36,next.x+next.w+24-targetW));
  // Lead into the final landing early, without ever overtaking the traveler.
  if(player.x>960-targetW-100)desired=Math.max(desired,Math.min(960-targetW,player.x-36));
  desired=Math.max(0,Math.min(960-targetW,desired));
  let mix=1;
  if(this.phase==='panorama'){
   if(active)this.elapsed+=dt;
   const duration=this.motion.matches?.85:1.7;
   if(this.elapsed>=duration)this.skip();
   else {const p=this.motion.matches?0:Math.max(0,Math.min(1,(this.elapsed-.7)/1));mix=p*p*(3-2*p);}
  }
  this.viewW=960+(targetW-960)*mix;
  const maxX=Math.max(0,960-this.viewW);
  if(this.phase==='panorama')this.x=Math.min(maxX,desired*mix);
  else if(this.snapNext||this.motion.matches){this.x=desired;this.snapNext=false;}
  else if(active){const chase=desired>=maxX-.01?desired+64:desired;this.x+=(chase-this.x)*(1-Math.exp(-dt*8));}
  this.x=Math.max(0,Math.min(maxX,this.x));
  if(this.phase==='play')this.x=Math.min(this.x,Math.max(0,player.x-24));
  this.scale=Math.min(this.w/this.viewW,this.h/480);
  this.ox=(this.w-this.viewW*this.scale)/2;this.oy=(this.h-480*this.scale)/2;
 }
 begin(ctx){ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,this.w,this.h);ctx.fillStyle='#1e3348';ctx.fillRect(0,0,this.w,this.h);ctx.save();ctx.translate(this.ox-this.x*this.scale,this.oy);ctx.scale(this.scale,this.scale);}
 end(ctx){ctx.restore();}
};
