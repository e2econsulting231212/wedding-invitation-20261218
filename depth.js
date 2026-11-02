/* 2.5D painting: the bright top edge stays on the actual collision height. */
window.drawPlatformDepth=(g,p,index,next,time)=>{
 const x=p.x,y=p.y,w=p.w,h=p.digit?72:32;
 const poly=(pts,color)=>{g.fillStyle=color;g.beginPath();pts.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fill()};
 g.save();
 // A projected shadow separates floating platforms from the scenery.
 g.fillStyle='#223f4938';g.beginPath();g.ellipse(x+w/2+12,y+h+18,w*.47,9,0,0,Math.PI*2);g.fill();
 const face=g.createLinearGradient(x,y,x,y+h);face.addColorStop(0,'#347888');face.addColorStop(1,'#163e52');
 g.shadowColor='#17374866';g.shadowBlur=10;g.shadowOffsetY=6;g.fillStyle=face;g.fillRect(x,y+9,w,h-9);g.shadowBlur=0;g.shadowOffsetY=0;
 poly([[x+w-12,y+9],[x+w,y],[x+w,y+h-10],[x+w-12,y+h]],'#102f43');
 const top=g.createLinearGradient(x,y,x,y+12);top.addColorStop(0,'#fff2ba');top.addColorStop(1,'#bcb67d');
 poly([[x,y],[x+w,y],[x+w-12,y+11],[x,y+11]],top);
 g.strokeStyle='#173b50';g.lineWidth=2;g.strokeRect(x,y,w,h);g.strokeStyle='#fff8dc';g.lineWidth=3;g.beginPath();g.moveTo(x+2,y+1);g.lineTo(x+w-2,y+1);g.stroke();
 g.strokeStyle='#80b4b5';g.lineWidth=1;g.beginPath();g.moveTo(x+2,y+13);g.lineTo(x+w-15,y+13);g.stroke();
 for(let xx=x+10;xx<x+w-18;xx+=23){g.fillStyle='#9dbbb055';g.fillRect(xx,y+18,11,2)}
 if(p.digit){g.font='bold 49px Georgia';g.textAlign='center';g.fillStyle='#092e43';g.fillText(p.digit,x+w/2+1,y+61);g.fillStyle='#f4dfad';g.fillText(p.digit,x+w/2,y+59)}
 else if(p.moving){g.fillStyle='#e7c78b';for(let i=0;i<3;i++){g.beginPath();g.arc(x+w/2+(i-1)*12,y+23,2,0,Math.PI*2);g.fill()}}
 else {g.fillStyle='#163c4d';g.fillRect(x+11,y+h,7,12);g.fillRect(x+w-22,y+h,7,12)}
 if(index===next){
  const cx=x+w/2,by=y-20+Math.sin(time*3)*3;
  g.fillStyle='#173e50';g.beginPath();g.roundRect(cx-24,by-25,48,20,6);g.fill();g.textAlign='center';g.font='11px sans-serif';g.fillStyle='#fff2bd';g.fillText('落脚点',cx,by-11);
  poly([[cx-6,by-2],[cx+6,by-2],[cx,by+5]],'#fff3bd');
 }
 g.restore();
};
window.drawTravelerDepth=(g,p,facing,walk)=>{
 const x=p.x,y=p.y;g.save();g.translate(x,y);
 const oval=(x,y,rx,ry,c)=>{g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()};
 // White silhouette and darker body shading keep the traveler readable.
 g.shadowColor='#17324688';g.shadowBlur=6;g.shadowOffsetY=3;
 const coat=g.createLinearGradient(-11,0,12,0);coat.addColorStop(0,'#f39763');coat.addColorStop(.45,'#df6746');coat.addColorStop(1,'#a33c35');
 g.fillStyle=coat;g.strokeStyle='#fff4d6';g.lineWidth=2;g.beginPath();g.roundRect(-12,8,24,21,6);g.fill();g.stroke();
 g.shadowBlur=0;g.shadowOffsetY=0;
 oval(-5,30+walk*.5,5,7,'#213b4a');oval(6,30-walk*.5,5,7,'#213b4a');oval(-5,35+walk*.5,6,3,'#132c3c');oval(7,35-walk*.5,6,3,'#132c3c');
 oval(0,-1,10,12,'#f5cba0');oval(7,1,3,7,'#ddb088');oval(facing*4,-2,1.6,2,'#29404b');
 g.fillStyle='#e4bd7e';g.beginPath();g.roundRect(-10,-19,20,14,5);g.fill();g.fillStyle='#ba7953';g.fillRect(-10,-9,20,4);oval(0,-5,17,4,'#f5d69a');
 oval(-14,18,4,6,'#f4c698');oval(14,18,4,6,'#f4c698');
 g.fillStyle='#ffe4b1';g.fillRect(-4,10,8,3);g.fillStyle='#ac4735';g.fillRect(3,13,4,9);g.restore();
};
