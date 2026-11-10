(() => {
'use strict';
const $=s=>document.querySelector(s), canvas=$('#game');let ctx=canvas.getContext('2d');
const KEY='wedding-20261218-v1', cities=['惠州','广州','茂名'];
let state={version:1,city:0,unlocked:[false,false,false],completed:null,guest:'',showName:true,showId:true}, storageOK=true;
try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.version===1&&Number.isInteger(s.city)&&s.city>=0&&s.city<3&&Array.isArray(s.unlocked)&&s.unlocked.length===3){state={...state,...s};if(state.completed&&typeof state.completed.id!=='string')state.completed=null;}}catch{}
state.dates=Array.isArray(state.dates)&&state.dates.length===4?state.dates.map(Boolean):[false,false,false,false];
const view=new JourneyView(canvas);
const arrival=['从惠州出发，带上一程欢喜。','途经广州，离相聚又近一站。','到茂名啦，欢迎来喝我们的喜酒。'];
if(!Array.isArray(state.seenCities)){state.seenCities=[0,1,2].map(i=>!!state.completed||i<state.city||(i===state.city&&((state.checkpoints?.[i]||0)>0||state.unlocked[i])))}
const lightProgress=state.unlocked.map(v=>v?1:0);
let fallNotice=-10;
function enterCity(){clearInput();lightProgress[state.city]=state.unlocked[state.city]?1:0;$('#arrival-copy').textContent=arrival[state.city];$('#overview-title').textContent=cities[state.city];$('#overview-copy').textContent=arrival[state.city];view.enter(!!state.seenCities[state.city],()=>{state.seenCities[state.city]=true;save();clearInput();$('#city-overview').hidden=true});$('#city-overview').hidden=view.phase!=='panorama';}
$('#overview-skip').onclick=()=>view.skip();
const fitHeight=()=>document.documentElement.style.setProperty('--screen-height',(window.visualViewport?.height||innerHeight)+'px');fitHeight();window.addEventListener('resize',fitHeight);window.visualViewport?.addEventListener('resize',fitHeight);
let toastTimer=null;
function toast(t){clearTimeout(toastTimer);$('#notice').textContent=t;$('#notice').style.display='block';toastTimer=setTimeout(()=>$('#notice').style.display='none',2200)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch{storageOK=false;toast('浏览器暂不能保存记录，请保留当前页面。');return false}}
let running=false,paused=false,player={x:55,y:340,vy:0,ground:true},clock=0,last=0,acc=0,jumpQueued=false,exporting=false,outputUrl=null;
const pointers=new Map(), keys=new Set();
function pressed(k){return keys.has(k)||[...pointers.values()].includes(k)}
function clearInput(){pointers.clear();keys.clear();jumpQueued=false;document.querySelectorAll('[data-key]').forEach(b=>b.classList.remove('pressed'))}
function pause(){clearInput();if(running){paused=true;$('#pause').textContent='▶';$('#pause').setAttribute('aria-label','继续游戏');$('#hint').textContent='已暂停 · 点击 ▶ 继续';}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});window.addEventListener('blur',pause);
const controlButtons=document.querySelectorAll('[data-key]');
function releasePointer(event){
 const key=pointers.get(event.pointerId);
 if(!key)return;
 pointers.delete(event.pointerId);
 for(const button of controlButtons){
  if(button.dataset.key===key)button.classList.toggle('pressed',[...pointers.values()].includes(key));
 }
}
window.addEventListener('pointerup',releasePointer,true);
window.addEventListener('pointercancel',releasePointer,true);
for(const button of controlButtons){
 button.addEventListener('contextmenu',event=>event.preventDefault());
 button.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;
  event.preventDefault();
  if(view.phase!=='play'||paused||!running)return;
  pointers.set(event.pointerId,button.dataset.key);
  if(button.dataset.key==='jump')jumpQueued=true;
  button.classList.add('pressed');
  button.setPointerCapture(event.pointerId);
 });
 button.addEventListener('lostpointercapture',releasePointer);
 button.addEventListener('pointermove',event=>{
  if(!pointers.has(event.pointerId))return;
  const bounds=button.getBoundingClientRect();
  const tolerance=8;
  if(!event.buttons||event.clientX<bounds.left-tolerance||event.clientX>bounds.right+tolerance||
     event.clientY<bounds.top-tolerance||event.clientY>bounds.bottom+tolerance)releasePointer(event);
 });
}
const keyMap={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'jump',' ':'jump',w:'jump'};
window.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA/.test(e.target.tagName)||document.querySelector('dialog[open]'))return;const k=keyMap[e.key];if(k){e.preventDefault();if(view.phase!=='play'||paused||!running)return;if(e.repeat&&!keys.has(k))return;if(k==='jump'&&!keys.has(k))jumpQueued=true;keys.add(k)}});window.addEventListener('keyup',e=>keys.delete(keyMap[e.key]));
let visualCity=-1, visualPlatform=0;
let checkpoint=0, facing=1, coyote=0, jumpBuffer=0, particles=[], previousPlatforms=[];
function updateLabels(){$('#scene-names').hidden=state.city!==2;$('#date-reveal').hidden=state.city!==2;$('#date-reveal').textContent='我们的婚期：'+[state.dates[0]?'20':'··',state.dates[1]?'26':'··','.',state.dates[2]?'12':'··','.',state.dates[3]?'18':'··'].join('');$('#hud-city').textContent=['惠州 · 点亮合江楼','广州 · 点亮广州塔','茂名 · 亲友相聚'][state.city];$('#hud-status').textContent=state.unlocked[state.city]?'♥ 已点亮':'◇ 等你点亮';document.querySelectorAll('.route span').forEach((e,i)=>e.classList.toggle('active',i===state.city));$('#city-label').textContent=['惠州 · 跃上屋檐，点亮合江楼','广州 · 借旋转平台，点亮广州塔','茂名 · 跳上婚期，抵达打印机'][state.city];$('#hint').textContent=state.unlocked[state.city]?'机关完成 · 继续向右前往下一站 →':[checkpoint===0?'按住 →，接近屋檐边缘时轻点 ↑':'跳上屋檐，触碰合江楼的光点','等平台靠近，再起跳；塔上的光点在前方','踩亮四块日期格子，在下方拼出我们的婚期'][state.city]}
function resetPlayer(){checkpoint=Number(state.checkpoints?.[state.city])||0;const ps=platforms();if(state.city===2&&state.dates.some(v=>!v))checkpoint=Math.min(checkpoint,state.dates.findIndex(v=>!v));const p=ps[Math.min(checkpoint,ps.length-1)]||ps[0];player={x:p.x+Math.min(p.w/2,45),y:p.y-28,vy:0,ground:true,on:checkpoint};coyote=.1;jumpBuffer=0;updateLabels()}
let entryTimer=null,entryShown=false;try{entryShown=sessionStorage.getItem('wedding-prompt-dismissed')==='1'}catch{}
$('#entry-later').onclick=()=>$('#entry-prompt').close();$('#entry-prompt').addEventListener('close',()=>{entryShown=true;try{sessionStorage.setItem('wedding-prompt-dismissed','1')}catch{}});
function beginGame(replay=false){clearTimeout(entryTimer);entryShown=true;if($('#entry-prompt').open)$('#entry-prompt').close();dismissPrinting();
 clearInput();if(replay){state.city=0;state.dates=[false,false,false,false];state.unlocked=[false,false,false];state.checkpoints=[0,0,0];save()}
 state.hasStarted=true;state.playthroughActive=true;save();running=true;paused=false;last=0;acc=0;document.body.classList.add('playing');$('#cover').style.display='none';$('#pause').textContent='Ⅱ';$('#pause').setAttribute('aria-label','暂停游戏');resetPlayer();enterCity();requestAnimationFrame(()=>$('.journey').scrollIntoView({block:'start',behavior:'instant'}));
}
const continueOrReplay=()=>beginGame(!!state.completed&&!state.playthroughActive);
$('#start').onclick=continueOrReplay;
$('#entry-start').onclick=continueOrReplay;
$('#entry-ticket').onclick=()=>{$('#entry-prompt').close();showTicket()};
function promptEntry(){if(entryShown||running)return;if(document.hidden||document.querySelector('dialog[open]')){entryTimer=setTimeout(promptEntry,500);return}entryShown=true;$('#entry-ticket').hidden=!state.completed;showOnlyDialog($('#entry-prompt'))}
entryTimer=setTimeout(promptEntry,5000);
$('#return-ticket').onclick=showTicket;
$('#return-replay').onclick=()=>beginGame(true);
$('#pause').onclick=()=>{if(!running)return;if(paused){paused=false;last=0;acc=0;$('#pause').textContent='Ⅱ';$('#pause').setAttribute('aria-label','暂停游戏');updateLabels()}else pause()};
document.querySelectorAll('[data-photo-open]').forEach(b=>b.onclick=()=>{pause();showOnlyDialog($('#photo-dialog'))});
$('#info').onclick=()=>{pause();showOnlyDialog($('#information'))};document.querySelectorAll('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
function showOnlyDialog(dialog){document.querySelectorAll('dialog[open]').forEach(d=>{if(d!==dialog)d.close()});if(!dialog.open)dialog.showModal()}
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('close',clearInput);d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});
function platforms(){
 if(state.city===0)return [{x:0,w:170,y:410},{x:205,w:112,y:350},{x:350,w:116,y:285},{x:505,w:110,y:335},{x:655,w:100,y:285},{x:800,w:160,y:350}];
 if(state.city===1){const angle=clock*.65;return [{x:0,w:165,y:410},{x:195,w:110,y:345},{x:370+Math.cos(angle)*44,w:105,y:302+Math.sin(angle)*30,moving:true},{x:525,w:100,y:250},{x:670+Math.cos(angle+Math.PI)*30,w:100,y:300+Math.sin(angle+Math.PI)*30,moving:true},{x:815,w:145,y:360}]}
 return [{x:0,w:155,y:410},{x:185,w:115,y:350,digit:'20'},{x:335,w:110,y:300,digit:'26'},{x:480,w:100,y:350,digit:'12'},{x:620,w:100,y:295,digit:'18'},{x:765,w:195,y:355}];
}
function burst(x,y){for(let i=0;i<25;i++)particles.push({x,y,vx:(Math.random()-.5)*140,vy:-Math.random()*150,life:1.4})}
function step(dt){if(!running||paused||view.phase!=='play'||document.querySelector('dialog[open]'))return;
 const oldPlatforms=platforms();clock+=dt;const ps=platforms();
 if(player.ground&&player.on!=null&&ps[player.on]?.moving){player.x+=ps[player.on].x-oldPlatforms[player.on].x;player.y+=ps[player.on].y-oldPlatforms[player.on].y}
 const oldY=player.y, dir=(pressed('right')?1:0)-(pressed('left')?1:0);if(dir)facing=dir;
 player.x=Math.max(14,Math.min(944,player.x+dir*195*dt));
 coyote=player.ground?.11:Math.max(0,coyote-dt);if(jumpQueued)jumpBuffer=.12;else jumpBuffer=Math.max(0,jumpBuffer-dt);jumpQueued=false;
 if(jumpBuffer>0&&coyote>0){player.vy=-460;player.ground=false;player.on=null;coyote=0;jumpBuffer=0}
 player.vy+=1050*dt;player.y+=player.vy*dt;player.ground=false;
 for(let i=0;i<ps.length;i++){const p=ps[i];if(player.x+10>p.x&&player.x-10<p.x+p.w&&oldY+28<=p.y+3&&player.y+28>=p.y&&player.vy>=0){if(player.vy>240)for(let n=0;n<5;n++)particles.push({x:player.x+(n-2)*4,y:p.y-2,vx:(n-2)*13,vy:-22-n%2*12,life:.35});player.y=p.y-28;player.vy=0;player.ground=true;player.on=i;if(state.city===2&&i>=1&&i<=4&&!state.dates[i-1]){state.dates[i-1]=true;save();burst(player.x,p.y);updateLabels()}if(!p.moving&&i>checkpoint){checkpoint=i;state.checkpoints??=[0,0,0];state.checkpoints[state.city]=i;save();updateLabels()}break}}
 if(player.y>530){resetPlayer();if(clock-fallNotice>6){toast('回到刚刚站稳的屋檐，再试一次。');fallNotice=clock;}return}
 const target=[{x:407,y:245},{x:575,y:210},{x:670,y:255}][state.city];
 if((state.city!==2||state.dates.every(Boolean))&&!state.unlocked[state.city]&&Math.abs(player.x-target.x)<48&&Math.abs(player.y-target.y)<62){state.unlocked[state.city]=true;lightProgress[state.city]=0;save();burst(target.x,target.y);updateLabels();toast(['合江楼亮灯啦，继续向右出发。','广州塔亮了，下一站茂名。','婚期已点亮，欢迎来喝喜酒！'][state.city])}
 if(player.x>900&&player.ground){if(!state.unlocked[state.city]||(state.city===2&&!state.dates.every(Boolean))){toast('先点亮这一城的机关，再出发吧。');player.x=880}else if(state.city<2){state.city++;save();resetPlayer();enterCity()}else finish()}
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=130*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);
}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function text(t,x,y,size=18,c='#36554a',font='serif'){ctx.fillStyle=c;ctx.font=`${size}px ${font}`;ctx.fillText(t,x,y)}
function tree(x,y){
 const bark=ctx.createLinearGradient(x+10,0,x+23,0);bark.addColorStop(0,'#aa9267');bark.addColorStop(1,'#5b6651');ctx.fillStyle=bark;ctx.fillRect(x+12,y+23,11,74);
 for(const [dx,dy,r] of [[4,30,23],[34,29,24],[18,4,27]]){const leaf=ctx.createRadialGradient(x+dx-7,y+dy-9,2,x+dx,y+dy,r);leaf.addColorStop(0,'#b8c69b');leaf.addColorStop(.45,'#7e9c7d');leaf.addColorStop(1,'#486f62');ctx.fillStyle=leaf;ctx.beginPath();ctx.arc(x+dx,y+dy,r,0,Math.PI*2);ctx.fill()}
}
function house(x,y,w,h,color){
 ctx.fillStyle='#46636d';ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+14,y-12);ctx.lineTo(x+w+14,y+h-12);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
 ctx.fillStyle='#b0bca2';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+14,y-12);ctx.lineTo(x+w+14,y-12);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();

 rect(x,y,w,h,color);const side=ctx.createLinearGradient(x+w-19,y,x+w,y);side.addColorStop(0,'#6c807329');side.addColorStop(1,'#364d5666');ctx.fillStyle=side;ctx.fillRect(x+w-19,y,19,h);rect(x,y,w,3,'#fff4d188');rect(x+w-9,y,9,h,'#88765c44');rect(x-7,y-9,w+14,13,'#526f65');rect(x-4,y-14,w+8,5,'#9da584');
 for(let xx=x;xx<x+w;xx+=13)rect(xx,y-8,8,3,'#97a584');
 for(let row=0;row<Math.floor((h-30)/44);row++)for(let col=0;col<Math.floor(w/34);col++){
 const wx=x+11+col*34,wy=y+23+row*44;rect(wx-2,wy-2,23,29,'#b19e7c');rect(wx,wy,19,25,'#537b73');rect(wx+3,wy+3,13,19,state.unlocked[state.city]?'#f4ce83':'#bacab1');rect(wx+8,wy,2,25,'#698a77');rect(wx,wy+12,19,2,'#698a77');rect(wx-4,wy+26,27,4,'#927f62');
 }
 rect(x,y+h-40,w,3,'#af9876');for(let xx=x+8;xx<x+w-10;xx+=34){rect(xx,y+h-37,24,37,'#658477');ctx.fillStyle='#385c55';ctx.beginPath();ctx.arc(xx+12,y+h-20,9,Math.PI,0);ctx.fill();rect(xx+3,y+h-20,18,20,'#385c55');rect(xx+9,y+h-13,5,13,'#e3c187')}
 for(let i=0;i<10;i++){const bx=x+((i*37)%Math.max(1,w-12)),by=y+12+((i*41)%Math.max(1,h-60));rect(bx,by,10,2,'#997e5840')}
 rect(x+6,y+h-6,w-12,6,'#93846a');
}
const backdrop=document.createElement('canvas');backdrop.width=1440;backdrop.height=720;const backdropCtx=backdrop.getContext('2d');let backdropKey='',backdropTime=-10;
function paintBackground(c){

 const sky=ctx.createLinearGradient(0,0,0,480);sky.addColorStop(0,['#182a46','#292941','#887e9b'][c]);sky.addColorStop(1,['#52677d','#976975','#e2c8b6'][c]);ctx.fillStyle=sky;ctx.fillRect(0,0,960,480);
 const sunX=[800,160,770][c];ctx.fillStyle='#ffe5a2';ctx.beginPath();ctx.arc(sunX,92,30,0,Math.PI*2);ctx.fill();
 if(c<2){for(let n=0;n<32;n++){ctx.fillStyle=n%3?'#d7d9cb88':'#fff2c4';ctx.fillRect(25+(n*137)%920,52+(n*43)%135,n%5?1:2,1)}ctx.fillStyle=c===0?'#253a55':'#48415b';ctx.beginPath();ctx.arc(sunX+12,83,27,0,Math.PI*2);ctx.fill()}
 for(let layer=0;layer<3;layer++){ctx.globalAlpha=.15+layer*.12;for(let i=0;i<13;i++){const x=i*90-30+layer*25;const h=50+Math.sin(i*14+layer)*35;rect(x,260-layer*25-h,65,h+160,['#356c76','#775d63','#32676c'][c]);if(c===1&&i%3===0)rect(x+26,180-layer*25-h,13,100,'#76545b')}}ctx.globalAlpha=1;
 // River, reflections and stone embankment.
 rect(0,369,960,111,['#253d56','#413e5c','#79b4b0'][c]);for(let i=0;i<35;i++){const x=(i*113+Math.sin(clock*.8+i)*16)%960;rect(x,388+(i*29)%87,15+i%5*8,2,'#dce0b5')}
 for(let i=0;i<10;i++){const x=(i*173+40)%960;const y=75+(i*37)%130;ctx.strokeStyle='#ffffff66';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x,y-3);ctx.lineTo(x+5,y);ctx.stroke()}
 if(c!==2)window.paintScenery?.(ctx,c,clock,'back');
 if(c!==2)window.paintLandmarks?.(ctx,c,clock);
 if(c===0){tree(35,245);tree(865,250);}
 if(c===1){house(15,250,140,160,'#d7c39b');house(195,215,110,200,'#dbb78e');house(785,200,150,210,'#d4b792');
}

 if(c===2)window.paintWedding(ctx,clock,state.dates,state.unlocked[2],lightProgress[2]);
 if(c!==2)window.paintScenery?.(ctx,c,clock,'front');
 // Fade decorative planes; all playable surfaces are rendered sharply afterwards.
 if(c!==2){ctx.fillStyle=['#233b542e','#181c3966'][c];ctx.fillRect(0,44,960,436);window.paintNightLights(ctx,c,clock,state.unlocked[c],lightProgress[c])}

}
function draw(){const c=state.city;view.begin(ctx);
 const key=c+':'+state.unlocked.join('')+':'+state.dates.join('');
 if(key!==backdropKey||clock-backdropTime>(view.motion.matches?.25:.08)){const display=ctx;try{ctx=backdropCtx;ctx.setTransform(1.5,0,0,1.5,0,0);paintBackground(c)}finally{ctx=display}backdropKey=key;backdropTime=clock;}
 ctx.drawImage(backdrop,0,0,960,480);
 const ps=platforms();if(visualCity!==c){visualCity=c;visualPlatform=checkpoint}if(player.ground&&player.on!=null)visualPlatform=player.on;const routeIndex=visualPlatform;
 const next=running?Math.min(routeIndex+1,ps.length-1):-1;
 for(const [i,p] of ps.entries())window.drawPlatformDepth(ctx,p,i,next,clock,!p.digit||state.dates[i-1],c===2);
 const target=[{x:407,y:245},{x:575,y:210},{x:670,y:255}][c];const pulse=.7+Math.sin(clock*3)*.2;ctx.globalAlpha=pulse;ctx.fillStyle=state.unlocked[c]?'#ffd789':'#fff1be';ctx.beginPath();ctx.arc(target.x,target.y,19,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;text(state.unlocked[c]?'♥':c===1?'♪':'✦',target.x-9,target.y+8,25,'#b65d40');
 const x=player.x,y=player.y;ctx.fillStyle='#24483a33';ctx.beginPath();ctx.ellipse(x,y+35,15,4,0,0,Math.PI*2);ctx.fill();const walk=running&&!paused&&player.ground&&(pressed('left')||pressed('right'))?Math.sin(clock*17)*5:0;
 window.drawTravelerDepth(ctx,player,facing,walk);
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/1.4);rect(p.x,p.y,5,5,'#ffe3a1')}ctx.globalAlpha=1;
 view.end(ctx);
}
let renderFault=false;
$('#render-retry').onclick=()=>{renderFault=false;$('#render-error').hidden=true;last=0;acc=0;clearInput()};
$('#render-info').onclick=()=>$('#info').click();
function frame(t){requestAnimationFrame(frame);if(renderFault)return;try{const elapsed=last?Math.min((t-last)/1000,.05):0;last=t;const active=running&&!paused&&!document.querySelector('dialog[open]');view.update(elapsed,active);if(active&&state.unlocked[state.city])lightProgress[state.city]=Math.min(1,lightProgress[state.city]+elapsed*.8);acc+=elapsed;while(acc>=1/120){step(1/120);acc-=1/120}draw()}catch(error){renderFault=true;pause();canvas.width=canvas.width;$('#render-error').hidden=false;console.error('画面绘制失败',error)}}requestAnimationFrame(frame);

let printTimer=null;
function dismissPrinting(){clearTimeout(printTimer);printTimer=null;$('#printing').hidden=true}
$('#printing-open').onclick=()=>{dismissPrinting();showTicket()};
function finish(){if(!state.completed){state.completed={id:'M-'+crypto.randomUUID().slice(0,8).toUpperCase(),at:new Date().toISOString()};save()}state.playthroughActive=false;save();running=false;clearInput();$('#return-actions').hidden=false;$('#printing').hidden=false;printTimer=setTimeout(()=>{dismissPrinting();showTicket()},1900)}
function wrap(g,t,x,y,width,size,line=1.5){g.font=`${size}px "Microsoft YaHei",sans-serif`;let row='',yy=y;for(const ch of t){if(g.measureText(row+ch).width>width&&row){g.fillText(row,x,yy);yy+=size*line;row=''}row+=ch}if(row)g.fillText(row,x,yy);return yy}
const ticketPhoto=new Image();const photoReady=new Promise((resolve,reject)=>{ticketPhoto.onload=()=>resolve();ticketPhoto.onerror=()=>reject(new Error('photo load failed'))});photoReady.then(()=>{if($('#ticket-modal').open)preview()}).catch(()=>{});ticketPhoto.src='photos/couple.jpg';
function ticketCanvas(side,scale=1){const cv=document.createElement('canvas');cv.width=1200*scale;cv.height=740*scale;const g=cv.getContext('2d');g.scale(scale,scale);g.fillStyle='#f6edd7';g.fillRect(0,0,1200,740);g.strokeStyle='#a78b5f';g.lineWidth=2;g.strokeRect(28,28,1144,684);g.strokeRect(38,38,1124,664);g.fillStyle='#ae5039';g.font='18px Georgia';g.fillText('THE WEDDING EXPRESS  /  2026',75,90);g.fillStyle='#354d42';
if(side==='front'){g.font='64px "InvitationSerif","Songti SC","SimSun",serif';g.fillText('一程欢喜 · 婚礼纪念票',75,194);g.font='38px "InvitationSerif","Songti SC","SimSun",serif';g.fillText('蓝诗曼  &  杨国林',75,278);g.font='68px Georgia';g.fillText('2026.12.18',75,380);g.font='21px sans-serif';g.fillText('惠州 HUIZHOU   →   广州 GUANGZHOU   →   茂名 MAOMING',75,446);window.paintPhotoStamp(g,ticketPhoto);g.fillStyle='#354d42';if(state.showName)wrap(g,'致 '+(state.guest||'亲爱的你'),75,535,700,30);if(state.showId){g.font='18px Georgia';g.fillText('SOUVENIR  '+state.completed.id,75,657)}g.font='17px sans-serif';g.fillText('期待与你相见',912,657)}else{
 g.fillStyle='#f6edd7';g.fillRect(60,55,1080,642);g.textAlign='center';
 g.fillStyle='#ae5039';g.font='18px Georgia';g.fillText('THE WEDDING EXPRESS  /  2026',600,100);
 g.fillStyle='#354d42';g.font='50px "InvitationSerif","Songti SC",serif';g.fillText('这一站，想和你相见。',600,197);
 g.strokeStyle='#bea174';g.lineWidth=1;g.beginPath();g.moveTo(430,239);g.lineTo(770,239);g.stroke();
 g.font='33px "InvitationSerif",serif';g.fillText('2026年12月18日 · 星期五',600,305);
 g.fillStyle='#7a806c';g.font='22px sans-serif';g.fillText('农历十一月初十',600,348);
 g.fillStyle='#354d42';g.font='31px "InvitationSerif",serif';g.fillText('中午宴席 · 杨国林家里',600,420);
 g.font='25px sans-serif';g.fillText('广东省茂名市电白区电城镇',600,468);g.fillText('联系电话：15816424852',600,516);
 g.fillStyle='#7a806c';g.font='21px "InvitationSerif",serif';g.fillText('从沿途的灯火，到相聚的这一刻，谢谢你来。',600,595);
 g.fillStyle='#ae5039';g.font='19px sans-serif';g.fillText('具体位置请电话联系',600,650);
 }return cv}
document.fonts.load('38px InvitationSerif').then(()=>{if($('#ticket-modal').open)preview()}).catch(()=>{});
function preview(){const g=$('#ticket').getContext('2d');g.drawImage(ticketCanvas('front'),0,0);if(outputUrl){URL.revokeObjectURL(outputUrl);outputUrl=null}$('#output').replaceChildren();$('#export-status').textContent='生成后可长按图片保存，或点击下载。'}
function showTicket(){dismissPrinting();paused=true;$('#guest').value=state.guest;$('#show-name').checked=state.showName;$('#show-id').checked=state.showId;preview();showOnlyDialog($('#ticket-modal'))}
for(const id of ['guest','show-name','show-id'])$('#'+id).addEventListener('input',()=>{state.guest=$('#guest').value;state.showName=$('#show-name').checked;state.showId=$('#show-id').checked;save();preview()});
$('#revisit').onclick=()=>{$('#ticket-modal').close();beginGame(true)};
document.querySelectorAll('[data-export]').forEach(b=>b.onclick=async()=>{if(exporting)return;exporting=true;const buttons=[...document.querySelectorAll('[data-export]')];buttons.forEach(b=>b.disabled=true);$('#export-status').textContent='正在生成高清图片…';const snapshot=JSON.stringify([state.guest,state.showName,state.showId]);try{await Promise.race([photoReady,new Promise((_,reject)=>setTimeout(()=>reject(new Error('photo timeout')),8000))]);await Promise.race([document.fonts.load('38px InvitationSerif').catch(()=>[]),new Promise(r=>setTimeout(r,1200))]);await new Promise(r=>setTimeout(r,30));const side=b.dataset.export;let cv;if(side==='long'){cv=document.createElement('canvas');cv.width=2400;cv.height=2960;const g=cv.getContext('2d');g.drawImage(ticketCanvas('front',2),0,0);g.drawImage(ticketCanvas('back',2),0,1480)}else cv=ticketCanvas(side,2);const blob=await new Promise((res,rej)=>cv.toBlob(b=>b?res(b):rej(Error('empty')),'image/png'));cv.width=1;cv.height=1;if(snapshot!==JSON.stringify([state.guest,state.showName,state.showId])){$('#export-status').textContent='设置已更新，请重新生成当前版本。';return}if(outputUrl)URL.revokeObjectURL(outputUrl);outputUrl=URL.createObjectURL(blob);const img=new Image();img.src=outputUrl;img.alt='高清婚礼纪念票，可长按保存';const link=document.createElement('a');link.href=outputUrl;link.download=`婚礼纪念票_${side}.png`;link.textContent='下载高清图片 ↓';$('#output').replaceChildren(img,link);$('#export-status').textContent='图片已生成。微信内可长按下方图片保存；生成不代表已存入相册。'}catch{$('#export-status').textContent='生成失败，完成记录仍保留。请重试，或分别生成正面与背面。'}finally{exporting=false;buttons.forEach(b=>b.disabled=false)}});
// Public entry is always free of guest data, souvenir IDs and local progress.
if(location.search||location.hash){try{history.replaceState(null,'',location.pathname)}catch{}}
updateLabels();
const hasProgress=state.hasStarted||state.city>0||state.unlocked.some(Boolean)||(state.checkpoints||[]).some(Boolean);
const startLabel=state.completed&&!state.playthroughActive?'再走一程':hasProgress?'继续旅程':'出发，去赴约';
$('#start').replaceChildren(document.createTextNode(startLabel+' '));const arrow=document.createElement('span');arrow.textContent='→';$('#start').append(arrow);$('#entry-start').textContent=startLabel+' →';
if(state.completed){$('#return-actions').hidden=false;$('#entry-ticket').hidden=false;$('#cover h2').textContent='欢迎再次来赴约';if(!state.playthroughActive)showTicket()}
})();
