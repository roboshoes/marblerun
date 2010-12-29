var Line = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.heightInPercent = 3 / Brick.SIZE;
  },

  draw: function(context) {
    
    context.save();

      context.strokeStyle = (this.selected) ? "#FFFFFF" : "#000000";
      context.lineWidth = (this.selected) ? 2 : 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) this.applyRotation(context);

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

  },

  createBody: function(world) {
    var bodyDefinition = new b2BodyDef(),
        shapeDefinition = new b2PolygonDef();

    bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);

    this.body = world.CreateBody(bodyDefinition);

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;  

    shapeDefinition.vertices[0].Set(-0.5, -0.5);
    shapeDefinition.vertices[1].Set(0.5, -0.5);
    shapeDefinition.vertices[2].Set(0.5, -0.5 + this.heightInPercent);
    shapeDefinition.vertices[3].Set(-0.5, -0.5 + this.heightInPercent);

    this.body.CreateShape(shapeDefinition);

    this.body.SetMassFromShapes();
  }

});

Line.isAvailable = function() {
  return false;
};

Line.prototype.class = Line;