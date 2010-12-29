var Line = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.heightInPercent = 3 / 27;
  },

  draw: function(context) {
    
    context.save();

      context.strokeStyle = (this.selected) ? "#FFFFFF" : "#000000";
      context.lineWidth = (this.selected) ? 2 : 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) this.rotate(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, 0);
      context.lineTo(Brick.SIZE, parseInt(Brick.SIZE * this.heightInPercent, 10));
      context.lineTo(0, parseInt(Brick.SIZE * this.heightInPercent, 10));
      context.lineTo(0, 0);
      context.closePath();
      
      context.fill();
      context.stroke();

    context.restore();

  }

});

Line.isAvailable = function() {
  return false;
};

Line.prototype.class = Line;