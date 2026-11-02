/* Stylized city impressions, not geographically scaled maps. */
window.paintLandmarks=(g,c,t)=>{
 const rect=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)},path=(p,col,width=1)=>{g.strokeStyle=col;g.lineWidth=width;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()},poly=(p,col)=>{g.fillStyle=col;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()},txt=(s,x,y,size=14)=>{g.font=`${size}px serif`;g.fillStyle='#314c53';g.fillText(s,x,y)};
 const roof=(x,y,w)=>{poly([[x-12,y+12],[x,y+3],[x+w/2,y-18],[x+w,y+3],[x+w+12,y+12],[x+w-4,y+9],[x+4,y+9]],'#425f60');path([[x-12,y+12],[x+w/2,y-15],[x+w+12,y+12]],'#b0bca1',2);path([[x-11,y+13],[x+w+11,y+13]],'#dec59b',3);for(let i=0;i<9;i++){const xx=x+i*w/8;path([[xx,y+8],[x+w/2+(xx-x-w/2)*.7,y-3]],'#849686',1)}};
 const pavilion=(x,y)=>{rect(x-22,y,5,41,'#9e6550');rect(x+18,y,5,41,'#9e6550');rect(x-25,y+37,52,5,'#b9ad8c');roof(x-33,y-7,66)};
 if(c===0){
  // Lake planes and a low, angular bridge instead of a generic arch.
  rect(0,290,960,190,'#2b465d');for(let i=0;i<23;i++)rect((i*83)%960,303+i*7,24+i%4*12,1,'#d8dfc2');
  const bridge=[[35,382],[116,362],[178,380],[260,348],[334,366],[422,337],[501,358],[589,328],[672,348],[754,322],[848,343],[945,321]];
  path(bridge.map(([x,y])=>[x,y+8]),'#78978c',10);path(bridge,'#ddcfaa',8);
  for(let i=0;i<bridge.length-1;i++){const [x,y]=bridge[i],[a,b]=bridge[i+1];path([[x,y-12],[a,b-12]],'#b9ae8d',2);for(let k=0;k<5;k++){const u=k/5,xx=x+(a-x)*u,yy=y+(b-y)*u;path([[xx,yy-13],[xx,yy+3]],'#cfc2a0',2)}}
  pavilion(180,337);pavilion(754,279);txt('九曲桥 · 西湖印象',75,425,13);
  // Hejiang-style multi-tiered eaves; landmark montage, not its real lakeside location.
  const x=343,w=135;rect(x-9,285,w+18,28,'#aaa188');rect(x,177,w,111,'#6b7278');rect(x+16,125,w-32,61,'#626b75');rect(x+31,82,w-62,52,'#74808a');
  for(const [yy,ww] of [[277,135],[224,135],[175,135],[124,103],[81,73]]){const xx=x+(w-ww)/2;for(let i=0;i<5;i++){rect(xx+8+i*(ww-16)/5,yy+15,4,30,'#98614c');rect(xx+10+i*(ww-16)/5,yy+18,(ww-25)/5,15,'#31465b')}roof(xx-5,yy,ww+10)}
  rect(x+42,204,54,17,'#466061');g.fillStyle='#e8cd98';g.font='13px serif';g.fillText('合 江 楼',x+45,217);
  txt('惠州城市印象',25,70,15);
 }
 if(c===1){
  // Canton Tower: pinched waist and twisting lattice, not a straight mast.
  const cx=575,top=74,base=374,height=base-top;
  const radius=u=>20+47*Math.pow(Math.abs(u-.43),1.35);
  const fill=g.createLinearGradient(cx-65,0,cx+65,0);fill.addColorStop(0,'#557c8b');fill.addColorStop(.5,'#b8c7c4');fill.addColorStop(1,'#4a7489');
  const points=[];for(let j=0;j<=35;j++){const u=j/35;points.push([cx-radius(u),top+u*height])}for(let j=35;j>=0;j--){const u=j/35;points.push([cx+radius(u),top+u*height])}poly(points,fill);
  for(let i=0;i<14;i++){const p=[];for(let j=0;j<=40;j++){const u=j/40;p.push([cx+Math.cos(i*Math.PI/7+u*2.2)*radius(u),top+u*height])}path(p,i%2?'#d2d8c0':'#719d9f',1.5)}
  for(let j=0;j<26;j++){const u=j/26,y=top+u*height,r=radius(u);g.strokeStyle='#bfd0bf';g.lineWidth=1;g.beginPath();g.ellipse(cx,y,r,3,0,0,Math.PI*2);g.stroke()}
  path([[cx-4,75],[cx-3,38],[cx+1,48],[cx+3,76]],'#69888e',3);rect(cx-9,76,18,8,'#d6c99d');txt('广州塔',cx-26,398,16);txt('珠江 · 广州',38,79,15);
 }
 if(c===2){
  // Dianbai coastal impression: silver beach, breakers, forest and fishing boats.
  const sea=g.createLinearGradient(0,260,0,480);sea.addColorStop(0,'#a7d5ce');sea.addColorStop(.4,'#60b0bc');sea.addColorStop(1,'#24798f');g.fillStyle=sea;g.fillRect(0,265,960,215);
  poly([[0,301],[120,290],[235,307],[390,283],[610,306],[790,291],[960,307],[960,335],[0,342]],'#e5d6b0');
  path([[0,338],[140,325],[300,341],[500,323],[710,337],[960,329]],'#f0eee0',4);
  for(let i=0;i<28;i++){const x=i*41,y=376+(i*19)%95+Math.sin(t+i)*2;path([[x,y],[x+18,y-2],[x+34,y]],'#b8dfd0',1.5)}
  for(const [x,y] of [[230,425],[790,398]]){poly([[x-24,y],[x+27,y],[x+16,y+9],[x-12,y+9]],'#876951');path([[x,y],[x,y-28]],'#9b805a',2);poly([[x+2,y-27],[x+22,y-3],[x+2,y-3]],'#efdbaf')}
  rect(832,164,7,48,'#9c9b82');rect(767,145,177,31,'#f0e3bd');txt('中国第一滩 · 电白',777,167,17);txt('电白 · 滨海印象',27,79,15);
 }
};
