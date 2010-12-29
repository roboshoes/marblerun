var Line = Class.create(Brick, {
  
  initialize: function() {
    this.heightInPercent = 2 / 27;
  },

  draw: function() {
    
    context.save();

      context.strokeStyle = (this.selected) ? "#999999" : "#000000";
      context.lineWidth = (this.selected) ? 5 : 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) this.rotate(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, 0);
      context.lineTo(0, Brick.SIZE);
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