window.paintTicketArch=g=>{
 g.save();g.translate(865,235);g.strokeStyle='#b69a68';g.lineWidth=5;g.beginPath();g.moveTo(12,173);g.lineTo(12,80);g.bezierCurveTo(12,-18,208,-18,208,80);g.lineTo(208,173);g.stroke();
 for(let i=0;i<19;i++){const a=Math.PI+i*Math.PI/18,x=110+98*Math.cos(a),y=80+75*Math.sin(a);g.fillStyle='#8c9c7a';g.beginPath();g.ellipse(x,y,10,5,a,0,Math.PI*2);g.fill();g.fillStyle=i%2?'#e9cbb6':'#f3dfb2';g.beginPath();g.arc(x+3,y-3,6,0,Math.PI*2);g.fill();g.fillStyle='#b38b62';g.beginPath();g.arc(x+3,y-3,2,0,Math.PI*2);g.fill()}
 g.fillStyle='#b84e36';g.font='60px "InvitationSerif",serif';g.textAlign='center';g.fillText('囍',110,121);g.font='16px "InvitationSerif",serif';g.fillStyle='#66775d';g.fillText('花好月圆 · 与你相见',110,190);g.restore();
};
