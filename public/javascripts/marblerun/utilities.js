CanvasRenderingContext2D.prototype.dashedLine = function (fromX, fromY, toX, toY, c) {

  var normalGT = function(a, b) {
    return Math.abs(a) > Math.abs(b);
  };

  var reverseGT = function(a, b) {
    return Math.abs(b) >= Math.abs(a);
  }

  var gtX = (fromX < toX) ? normalGT : reverseGT;
  var gtY = (fromY < toY) ? normalGT : reverseGT;

  var A = toX - fromX;
  var B = toY - fromY;
  var C = Math.sqrt(A * A + B * B);

  var a = (c * A) / C;
  var b = (c * B) / C;

  var x = fromX + a;
  var y = fromY + b;
  var line = true;

  this.moveTo(fromX, fromY);

  while (!gtX(x, toX) || !gtY(y, toY)) {
    if (line) this.lineTo(x, y);
    else this.moveTo(x, y);

    line = !line;

    x += a;
    y += b;
  }

};

