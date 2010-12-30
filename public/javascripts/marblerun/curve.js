var Curve = new Class.create(Brick, {

  drawShape: function(context) {
    context.save();

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(Brick.SIZE / 2, 0,  Brick.SIZE, Brick.SIZE / 2, Brick.SIZE, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);
      context.lineTo(0, 0);
      context.closePath();
       
      context.fill();
      
    context.restore();

    context.stroke();

  }

});

Curve.isAvailable = function() {
  return true;
};

Curve.prototype.class = Curve;