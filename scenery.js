/* Decorative scenery only: no collision, input, storage or game rules. */
window.paintScenery=(g,city,time,phase)=>{
 const box=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},line=(pts,c,w=1)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()},oval=(x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()},label=(s,x,y,size,c)=>{if(innerWidth<760)return;g.font=`${size}px serif`;g.fillStyle=c;g.fillText(s,x,y)};
 const lantern=(x,y,s=1)=>{g.save();g.translate(x,y);g.scale(s,s);line([[0,-19],[0,0]],'#735b43');oval(0,10,12,15,'#b55d43');oval(-3,8,6,12,'#da8c5d');line([[-8,0],[8,0]],'#f0c47e',3);line([[-8,23],[8,23]],'#e8b77b',3);line([[0,25],[0,35]],'#b45c42',2);g.restore()};
 const pot=(x,y)=>{box(x-9,y,18,4,'#b87858');box(x-7,y+4,14,13,'#a46d51');for(let i=0;i<5;i++){const a=i*1.3;line([[x,y],[x+Math.cos(a)*12,y-12-Math.sin(a)*5]],'#647e57',2);oval(x+Math.cos(a)*10,y-10-Math.sin(a)*5,5,3,'#819b68')}};
 const palm=(x,y,s=1)=>{g.save();g.translate(x,y);g.scale(s,s);line([[0,0],[-5,-45],[3,-96]],'#826a45',9);for(let i=0;i<9;i++)line([[-5+i%3,-i*11], [2+i%3,-i*11-2]],'#b59b69',2);for(let i=0;i<7;i++){const a=-Math.PI+i*Math.PI/6,dx=Math.cos(a)*55,dy=Math.sin(a)*29;g.strokeStyle=i%2?'#426e5c':'#66845d';g.lineWidth=7;g.beginPath();g.moveTo(3,-96);g.quadraticCurveTo(dx*.7,-123+dy,dx,-85+dy);g.stroke();for(let j=1;j<5;j++){let u=j/5;line([[dx*u,-100+dy*u],[dx*u+8,-85+dy*u]],'#65845c',2)}}oval(0,-95,5,6,'#92754a');g.restore()};
 if(phase==='back'){
  // Slow cloud layers, far hills and patterned glints.
  g.globalAlpha=.22;for(let i=0;i<5;i++){const x=((i*223+time*3)%1160)-100,y=75+i%3*33;oval(x,y,55,9,'#fff4da');oval(x+15,y-7,28,10,'#fff4da')}g.globalAlpha=1;
  if(city===1){
   for(let i=0;i<7;i++){const x=40+i*143,y=168+Math.sin(i*.65)*20;line([[x,y],[x+143,168+Math.sin((i+1)*.65)*20]],'#826c55',1);oval(x+55,y+12,3,5,'#ffe3a0');oval(x+100,y+12,3,5,'#ffe3a0')}
  }
  if(city===2){palm(84,328,.85);palm(760,330,1);palm(939,355,.7);}
 }
 if(phase==='front'){
  if(city===0){
   for(let i=0;i<5;i++){const x=490+i*20,y=443+Math.sin(i*2)*6;oval(x,y,8,3,'#5c8d6e');oval(x+1,y-4,3,3,i%2?'#dfb69a':'#ebc7ae')}
   // Small boat, gently bobbing below the route.
   const by=447+Math.sin(time*1.2)*2;line([[247,by],[256,by+8],[291,by+8],[301,by]],'#795a40',4);line([[269,by-1],[269,by-24]],'#a48258',2);line([[269,by-23],[288,by-3],[271,by-3]],'#e6d3a4',2);
   for(let i=0;i<12;i++){const x=60+i*78,y=318+Math.sin(time*.7+i*4)*28;g.globalAlpha=.3+(Math.sin(time*2+i)+1)*.2;oval(x,y,1.5,1.5,'#fff1b4')}g.globalAlpha=1;
  }
  if(city===1){
   box(30,302,106,22,'#6b785f');label('西 关 · 茶 记',35,318,14,'#f4dba7');box(800,292,122,21,'#9b5a48');label('花 好 月 圆',815,308,14,'#f8ddb3');
   // Striped awnings, shutters, hanging signs, planters.
   for(const [x,y,w] of [[31,325,105],[208,284,83],[801,315,119]]){for(let i=0;i<w;i+=12)box(x+i,y,12,12,i%24===0?'#b57c56':'#e5c89b');line([[x,y+12],[x+w,y+12]],'#7b6b51',2);pot(x+9,y+51);pot(x+w-10,y+51)}
   lantern(181,248,.72);lantern(316,225,.65);lantern(775,253,.7);
   // Station sign is separate from the playable moving platform.
   box(836,332,99,19,'#46675f');label('茂名方向 →',843,346,12,'#f4d8a4');
  }
  if(city===2){
   box(22,289,125,24,'#ac6549');label('电 城 · 老 街',29,306,15,'#fae5ba');lantern(20,320,.65);lantern(151,320,.65);pot(32,391);pot(132,391);pot(800,390);palm(953,424,.8);
   // Perforated ticket border and corner ornaments, clear of date platforms.
   g.strokeStyle='#b28b5d';g.setLineDash([2,6]);g.strokeRect(184,127,540,145);g.setLineDash([]);
   for(const x of [192,714])for(const y of [135,268]){line([[x,y+8],[x,y],[x+(x<400?9:-9),y]],'#c09964',2)}
   label('HUIZHOU / GUANGZHOU / MAOMING',278,174,11,'#a38b64');label('相 聚 的 日 子',384,277,13,'#b29067');
   // Printer screws, paper rulings, status lamp and scalloped paper edge.
   for(const x of [841,931])oval(x,278,2,2,'#d6c69b');box(859,249,54,1,'#c5ab7e');box(859,254,36,1,'#c5ab7e');oval(918,297,3,3,'#e7d384');
   for(let i=0;i<8;i++)box(853+i*8,264,4,3,'#e6d4aa');box(848,315,7,26,'#779580');box(918,315,4,26,'#315a50');
   label('为你留一张纪念',828,390,12,'#f9e0ae');
  }
  // Tiny roof flowers sit below the collision edge and never hide a gap.
  for(const [x,y] of city===0?[[230,350],[681,285]]:city===1?[[222,345],[850,360]]:[[37,410],[800,355]]){box(x,y+9,20,8,'#a97d57');for(let i=0;i<4;i++){line([[x+3+i*5,y+10],[x+3+i*5,y+3]],'#65774f');oval(x+3+i*5,y+2,3,2,i%2?'#f1d19c':'#be7658')}}
 }
};
