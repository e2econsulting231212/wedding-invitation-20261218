window.paintWedding=(g,t,dates)=>{
 const box=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)},oval=(x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()},stroke=(p,c,w=1)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();p.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke()},text=(s,x,y,size,col)=>{if(innerWidth<760&&size<22)return;g.font=`${size}px serif`;g.fillStyle=col;g.fillText(s,x,y)};
 const bg=g.createLinearGradient(0,44,0,480);bg.addColorStop(0,'#b8adba');bg.addColorStop(.7,'#e8ceba');bg.addColorStop(1,'#c3a59d');g.fillStyle=bg;g.fillRect(0,44,960,436);
 // A small illustrated ceremony, with no photographic likenesses.
 box(150,278,670,9,'#b8978e');box(178,287,615,13,'#dec0a6');box(205,300,564,12,'#b5958d');
 const arch=g.createLinearGradient(400,80,560,280);arch.addColorStop(0,'#f5d69c');arch.addColorStop(1,'#ab8063');g.strokeStyle=arch;g.lineWidth=8;g.beginPath();g.moveTo(380,279);g.lineTo(380,177);g.bezierCurveTo(380,66,588,66,588,177);g.lineTo(588,279);g.stroke();
 g.fillStyle='#f1ded0bb';g.beginPath();g.moveTo(383,155);g.quadraticCurveTo(370,245,410,278);g.lineTo(430,278);g.quadraticCurveTo(396,220,397,155);g.fill();g.beginPath();g.moveTo(583,155);g.quadraticCurveTo(606,242,560,278);g.lineTo(542,278);g.quadraticCurveTo(576,225,569,155);g.fill();
 for(let i=0;i<19;i++){const a=Math.PI+i*Math.PI/18,x=484+Math.cos(a)*102,y=178+Math.sin(a)*84;oval(x,y,9,5,'#798b72');oval(x+3,y-4,6,6,i%2?'#ebc6b7':'#f5e3c9');oval(x+3,y-4,2,2,'#ba8b72')}
 text('蓝诗曼  &  杨国林',408,90,17,'#66576b');
 const person=(x,y,bride=false,guest=false)=>{
  oval(x,y+56,guest?15:22,4,'#73556933');g.fillStyle=bride?'#fff0db':guest?'#817887':'#3f5165';g.beginPath();if(bride){g.moveTo(x-10,y+12);g.lineTo(x-31,y+55);g.quadraticCurveTo(x,y+63,x+31,y+55);g.lineTo(x+10,y+12)}else g.roundRect(x-12,y+9,24,36,5);g.fill();
  if(!bride){box(x-9,y+40,6,17,'#3e4455');box(x+3,y+40,6,17,'#3e4455')}
  oval(x,y-3,12,15,'#e6bd9e');g.fillStyle='#564653';g.beginPath();g.arc(x,y-8,12,Math.PI,Math.PI*2);g.fill();oval(x-4,y-3,1,1.3,'#665365');oval(x+4,y-3,1,1.3,'#665365');
  if(bride){g.fillStyle='#fff5e6aa';g.beginPath();g.moveTo(x-9,y-12);g.lineTo(x-27,y+39);g.lineTo(x-11,y+24);g.fill();oval(x,y-18,10,3,'#f4e0b9');for(let j=0;j<5;j++)oval(x-9+j*4,y+26+Math.sin(j)*3,5,5,j%2?'#e0aaa4':'#f4dfbe');stroke([[x-11,y+16],[x,y+27]],'#e6bd9e',5)}else{stroke([[x-10,y+10],[x,y+25],[x+9,y+10]],'#f1dfc6',2);box(x-3,y+15,6,4,'#b46c69');stroke([[x+12,y+17],[x+24,y+25]],'#e6bd9e',5)}
 };
 person(457,210);person(510,210,true);
 for(const [x,y] of [[255,224],[300,232],[668,229],[710,220]]){person(x,y,false,true);stroke([[x-16,y+25],[x-20,y+16+Math.sin(t*2+x)*3]],'#dcb699',4)}
 for(const x of [325,641]){box(x-3,223,6,54,'#baa085');oval(x,221,23,9,'#7f947a');for(let k=0;k<7;k++)oval(x-15+k*5,214+Math.sin(k)*5,6,6,k%2?'#e6b7ae':'#f4e0ba')}
 for(let i=0;i<22;i++){const x=80+i*39,y=126+Math.sin(i)*17;oval(x,y,2,2,'#f8e5b6')}
 box(841,277,85,78,'#416c70');box(831,267,105,20,'#6c9390');box(852,242,64,26,'#f4ddbd');box(850,300,67,7,'#213e4b');text('囍',869,342,27,'#f3d6a1');
 // The date appears here only after the corresponding platform has been landed on.
 box(315,437,340,38,'#594d62');text('我们的婚期',336,461,13,'#dfc6ad');g.font='bold 23px Georgia';g.fillStyle='#ffe4ab';g.fillText([dates[0]?'20':'··',dates[1]?'26':'··','.',dates[2]?'12':'··','.',dates[3]?'18':'··'].join(''),425,464);
};
window.paintNightLights=(g,c,t,lit)=>{
 if(c>1)return;
 g.save();
 if(c===0){
  for(const [y,w] of [[277,135],[224,135],[175,135],[124,103],[81,73]]){const x=343+(135-w)/2;
   g.strokeStyle=lit?'#ffd58d':'#546574';g.lineWidth=lit?2.5:1;g.shadowColor='#ffb956';g.shadowBlur=lit?10:0;g.beginPath();g.moveTo(x-17,y+12);g.lineTo(x+w/2,y-16);g.lineTo(x+w+17,y+12);g.stroke();
   for(let i=0;i<5;i++){g.fillStyle=lit?'#ffe4a7':'#294459';g.fillRect(x+10+i*(w-16)/5,y+18,(w-25)/5,15)}
  }
  if(lit){g.globalAlpha=.2;for(let i=0;i<10;i++){g.fillStyle='#ffce84';g.fillRect(352-i*2,334+i*11,114+i*5,2)}g.globalAlpha=1}
 }else{
  for(let j=0;j<36;j++){const u=j/35,y=74+u*300,r=20+47*Math.pow(Math.abs(u-.43),1.35);g.strokeStyle=lit?`hsl(${(u*180+t*12)%360+190} 78% 76%)`:'#586b84';g.shadowColor=g.strokeStyle;g.shadowBlur=lit?8:0;g.lineWidth=lit?2.2:1;g.beginPath();g.ellipse(575,y,r,3,0,0,Math.PI*2);g.stroke()}
  // Pearl River cruise and illuminated embankments.
  g.shadowBlur=0;g.fillStyle='#324967';g.fillRect(290,408,124,17);g.fillStyle='#c7c6b7';g.fillRect(311,391,78,17);for(let i=0;i<7;i++){g.fillStyle=lit?'#f9d58e':'#6f8a98';g.fillRect(316+i*10,395,6,6)}
 }
 // A few warm windows remain ambient; the landmark itself only lights on activation.
 g.shadowBlur=0;for(const [x,y,w,h] of c===0?[[80,230,88,149],[681,205,101,174]]:[[59,268,72,121],[811,217,95,137]]){g.fillStyle='#243c54';g.fillRect(x,y,w,h);g.fillStyle='#506179';g.fillRect(x+w-10,y,10,h);for(let xx=x+9;xx<x+w-13;xx+=17)for(let yy=y+12;yy<y+h-12;yy+=23){g.fillStyle=(xx+yy)%3===0||lit?'#d9ac73':'#5d7a90';g.fillRect(xx,yy,7,10)}}
 g.restore();
};
