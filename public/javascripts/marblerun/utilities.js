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
  
};

function getAbsolutePosition(element) {
  var r = { x: element.offsetLeft, y: element.offsetTop };
  if (element.offsetParent) {
    var tmp = getAbsolutePosition(element.offsetParent);
    r.x += tmp.x;
    r.y += tmp.y;
  }
  return r;
};

function getRelativeCoordinates(event, reference) {

  var x, y;
  event = event || window.event;

  var el = event.target || event.srcElement;

  if (!window.opera && typeof event.offsetX != 'undefined') {
    // Use offset coordinates and find common offsetParent
    var pos = { x: event.offsetX, y: event.offsetY };

    // Send the coordinates upwards through the offsetParent chain.
    var e = el;
    while (e) {
      e.mouseX = pos.x;
      e.mouseY = pos.y;
      pos.x += e.offsetLeft;
      pos.y += e.offsetTop;
      e = e.offsetParent;
    }

    // Look for the coordinates starting from the reference element.
    var e = reference;
    var offset = { x: 0, y: 0 }

    while (e) {

      if (typeof e.mouseX != 'undefined') {
        x = e.mouseX - offset.x;
        y = e.mouseY - offset.y;
        break;
      }

      offset.x += e.offsetLeft;
      offset.y += e.offsetTop;
      e = e.offsetParent;
    }

    // Reset stored coordinates
    e = el;

    while (e) {

      e.mouseX = undefined;
      e.mouseY = undefined;
      e = e.offsetParent;

    }

  } else {

    // Use absolute coordinates
    var pos = getAbsolutePosition(reference);
    x = event.pageX  - pos.x;
    y = event.pageY - pos.y;
  }

  // Subtract distance to middle
  return { x: x, y: y };
}

