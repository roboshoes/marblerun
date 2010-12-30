CanvasRenderingContext2D.prototype.dashedLine = function (fromX, fromY, toX, toY, dashLength) {
  
  var gt = function(a, b) {
    return Math.abs(a) > Math.abs(b);
  };

  var A = toX - fromX,
      B = toY - fromY;
      
  var C = Math.sqrt(A * A + B * B),
      c = dashLength;

  var a = (c * A) / C,
      b = (c * B) / C;

  var x = a,
      y = b,
      line = true;

  this.moveTo(fromX, fromY);

  while (gt(A, x) || gt(B, y)) {
    
    if (line) {
      
      this.lineTo(fromX + x, fromY + y);
    
    } else {
      
      this.moveTo(fromX + x, fromY + y);
      
    }

    line = !line;

    x += a;
    y += b;
    
  }
  
  if (line) {
    
    this.lineTo(toX, toY);
  
  } else {
    
    this.moveTo(toX, toY);
    
  }
  
};

