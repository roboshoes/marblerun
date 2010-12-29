var Ramp = Class.create(Brick, {

  draw: function(context) {
    context.save();

      context.strokeStyle = (this.selected) ? "#FFFFFF" : "#000000";
      context.lineWidth = 1;
      context.fillStyle = "#000000";
      
      if (this.rotation != 0) this.applyRotation(context);
      if (this.state == "drag") this.applyScale(context);

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);
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

    shapeDefinition.vertexCount = 3;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;  

    shapeDefinition.vertices[0].Set(-0.5, -0.5);
    shapeDefinition.vertices[1].Set(0.5, 0.5);
    shapeDefinition.vertices[2].Set(-0.5, 0.5);

    this.body.CreateShape(shapeDefinition);

    this.body.SetMassFromShapes();
  }
});

Ramp.isAvailable = function() {
  return true;
}

Ramp.prototype.class = Ramp;