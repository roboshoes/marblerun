var Kicker = Class.create(Brick, {

  intitialize: function() {
    this.mathias = "Mathias";
  },

  draw: function(context) {
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;
    context.fillStyle = "#FFFFFF";

    context.fillRect(0, 0, parseInt(Brick.SIZE / 2), Brick.SIZE);
    context.strokeRect(0, 0, parseInt(Brick.SIZE / 2), Brick.SIZE);
  }

});

Kicker.isAvailable = function() {
  return true;
}

Kicker.prototype.class = Kicker;