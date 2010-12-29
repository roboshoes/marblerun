var Kicker = Class.create(Brick, {

  draw: function(context) {
    context.save();

      context.strokeStyle = (this.selected) ? "#999999" : "#000000";
      context.lineWidth = (this.selected) ? 5 : 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) {

        context.translate(Brick.SIZE / 2, Brick.SIZE / 2);
        context.rotate(this.rotation * Math.PI / 180);
        context.translate(- Brick.SIZE / 2, - Brick.SIZE / 2);

      }

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

Kicker.isAvailable = function() {
  return true;
}

Kicker.prototype.class = Kicker;