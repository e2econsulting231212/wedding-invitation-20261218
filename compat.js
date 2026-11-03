/* Install before any canvas renderer. This project uses non-negative scalar radii. */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r=0) {
    r=Math.max(0,Math.min(Number(r)||0,Math.abs(w)/2,Math.abs(h)/2));
    this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.quadraticCurveTo(x+w,y,x+w,y+r);
    this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);
    this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);this.closePath();return this;
  };
}
