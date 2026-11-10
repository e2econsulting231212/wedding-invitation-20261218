/* World coordinates stay 960 × 480. Only the view changes. */
window.JourneyView=class {
 constructor(canvas){
  this.canvas=canvas;this.w=960;this.h=480;this.scale=1;this.ox=0;this.oy=0;this.phase='idle';this.elapsed=0;
  this.motion=matchMedia('(prefers-reduced-motion: reduce)');
  this.resize=()=>{const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;this.w=r.width;this.h=r.height;this.dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(1400000/(this.w*this.h)));canvas.width=Math.round(this.w*this.dpr);canvas.height=Math.round(this.h*this.dpr)};
  this.observer=new ResizeObserver(this.resize);this.observer.observe(canvas);this.resize();
 }
 enter(seen,onReady){
  this.elapsed=0;
  this.phase=seen?'play':'panorama';
  this.onReady=onReady;
  if(seen)onReady();
 }
 skip(){
  if(this.phase!=='panorama')return;
  this.phase='play';
  this.onReady?.();
 }
 update(dt,active){
  if(this.phase==='panorama'&&active){
   this.elapsed+=dt;
   if(this.elapsed>=(this.motion.matches?.85:1.7))this.skip();
  }
  this.scale=Math.min(this.w/960,this.h/480);
  this.ox=(this.w-960*this.scale)/2;
  this.oy=(this.h-480*this.scale)/2;
 }
 begin(ctx){ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,this.w,this.h);ctx.fillStyle='#1e3348';ctx.fillRect(0,0,this.w,this.h);ctx.save();ctx.translate(this.ox,this.oy);ctx.scale(this.scale,this.scale);}
 end(ctx){ctx.restore();}
};
