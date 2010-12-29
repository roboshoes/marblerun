var Ramp = Class.create(Brick, {

  draw: function(context) {
    context.save();

      context.strokeStyle = (this.selected) ? "#FFFFFF" : "#000000";
      context.lineWidth = (this.selected) ? 2 : 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) this.applyRotation(context);

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

Ramp.isAvailable = function() {
  return true;
}

Ramp.prototype.class = Ramp;