var Line = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.heightInPercent = 3 / Brick.SIZE;
  },

  drawShape: function(context) {
    
    context.save();

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, 0);
      context.lineTo(Brick.SIZE, parseInt(Brick.SIZE * this.heightInPercent, 10));
      context.lineTo(0, parseInt(Brick.SIZE * this.heightInPercent, 10));
      context.lineTo(0, 0);
      context.closePath();
      
      context.fill();
      
    context.restore();

    context.stroke();
    
    context.beginPath();

  },

  createShapes: function(body) {
    var shapeDefinition = new b2PolygonDef();

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;  

    shapeDefinition.vertices[0].Set(-0.5, -0.5);
    shapeDefinition.vertices[1].Set(0.5, -0.5);
    shapeDefinition.vertices[2].Set(0.5, -0.5 + this.heightInPercent);
    shapeDefinition.vertices[3].Set(-0.5, -0.5 + this.heightInPercent);

    body.CreateShape(shapeDefinition);

  }

});

Line.isAvailable = function() {
  return false;
};

Line.prototype.type = "Line";