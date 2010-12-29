var Brick = Class.create(DisplayObject, {
  
  initialize: function() {
    this.x = 0;
    this.y = 0;
    this.selected = false;
    this.rotation = 0;

    this.cell = {
      row: 0,
      col: 0
    }
  },

  draw: function(context) {

    context.strokeStyle = (this.selected) ? "#999999" : "#000000";
    context.lineWidth = (this.selected) ? 5 : 1;
    context.fillStyle = "#000000";

    context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.stroke();

  },

  drawGlobal: function(context) {

    context.save();

      context.translate(this.x, this.y);
      this.draw(context);

    context.restore();

  }

});

Brick.isAvailable = function() {
  return true;
};

Brick.SIZE = 27;

Brick.prototype.class = Brick;