var Curve = new Class.create(Brick, {

  draw: function(context) {
    context.save();

      context.strokeStyle = (this.selected) ? "#999999" : "#000000";
      context.lineWidth = (this.selected) ? 5 : 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) this.rotate(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);
      context.lineTo(0, 0);
      context.closePath();
      
      context.fill();
      context.stroke();

    context.restore();

  }

});

Curve.isAvailable = function() {
  return true;
};

Curve.prototype.class = Curve;