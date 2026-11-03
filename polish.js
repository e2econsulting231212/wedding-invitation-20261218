window.paintTicketArch=g=>{
 g.save();g.translate(865,235);g.strokeStyle='#b69a68';g.lineWidth=5;g.beginPath();g.moveTo(12,173);g.lineTo(12,80);g.bezierCurveTo(12,-18,208,-18,208,80);g.lineTo(208,173);g.stroke();
 for(let i=0;i<19;i++){const a=Math.PI+i*Math.PI/18,x=110+98*Math.cos(a),y=80+75*Math.sin(a);g.fillStyle='#8c9c7a';g.beginPath();g.ellipse(x,y,10,5,a,0,Math.PI*2);g.fill();g.fillStyle=i%2?'#e9cbb6':'#f3dfb2';g.beginPath();g.arc(x+3,y-3,6,0,Math.PI*2);g.fill();g.fillStyle='#b38b62';g.beginPath();g.arc(x+3,y-3,2,0,Math.PI*2);g.fill()}
 g.fillStyle='#b84e36';g.font='60px "InvitationSerif",serif';g.textAlign='center';g.fillText('囍',110,121);g.font='16px "InvitationSerif",serif';g.fillStyle='#66775d';g.fillText('花好月圆 · 与你相见',110,190);g.restore();
};
window.paintPhotoStamp=(g,photo)=>{
 const x=866,y=186,w=244,h=374;
 g.save();g.fillStyle='#dac6a0';g.fillRect(x+5,y+6,w,h);g.fillStyle='#fffaf0';g.fillRect(x,y,w,h);
 // Small round perforations cut into each paper edge.
 g.fillStyle='#f6edd7';for(let xx=x+8;xx<x+w;xx+=15){for(const yy of[y,y+h]){g.beginPath();g.arc(xx,yy,4,0,Math.PI*2);g.fill()}}for(let yy=y+9;yy<y+h;yy+=15){for(const xx of[x,x+w]){g.beginPath();g.arc(xx,yy,4,0,Math.PI*2);g.fill()}}
 if(photo&&photo.complete&&photo.naturalWidth){const width=220,height=330,scale=Math.min(width/photo.naturalWidth,height/photo.naturalHeight),pw=photo.naturalWidth*scale,ph=photo.naturalHeight*scale;g.drawImage(photo,x+12+(width-pw)/2,y+12+(height-ph)/2,pw,ph)}else{g.fillStyle='#b59b78';g.font='18px sans-serif';g.fillText('合照加载中…',x+57,y+180)}
 g.fillStyle='#9d7150';g.font='12px Georgia';g.textAlign='center';g.fillText('LOVE POST  ·  2026.12.18',x+w/2,y+h-14);g.restore();
};
