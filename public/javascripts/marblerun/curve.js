var Curve = new Class.create(Brick, {

  drawShape: function(context) {
    context.save();

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(Brick.SIZE / 2, 0,  Brick.SIZE, Brick.SIZE / 2, Brick.SIZE, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);
      context.lineTo(0, 0);
      context.closePath();
       
      context.fill();
      
    context.restore();

    context.stroke();

  },

  createBody: function(world) {
    var bodyDefinition = new b2BodyDef(),
        shapeDefinition = new b2PolygonDef();

    bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);

    this.body = world.CreateBody(bodyDefinition);

    shapeDefinition.vertexCount = 8;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    shapeDefinition.vertices[0].Set(-0.5, 0.5);

    var angle = Math.PI / 2 / 6;

    for (var i = 6, j = 0; i >= 0; i--, j++) {
      shapeDefinition.vertices[j].Set(Math.cos(angle * i) - 0.5, -Math.sin(angle * i) + 0.5);

      console.log(Math.cos(angle * i) - 0.5, Math.sin(angle * i) + 0.5);
    }

    shapeDefinition.vertices[7].Set(-0.5, 0.5);

    this.body.CreateShape(shapeDefinition);

    this.body.SetMassFromShapes();
  }

});

Curve.isAvailable = function() {
  return true;
};

Curve.prototype.class = Curve;