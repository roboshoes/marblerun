var Ball = Class.create({
  initialize: function() {
    this.radius = 0.15;
  },

  createBody: function(world) {
    var bodyDefinition = new b2BodyDef(),
      shapeDefinition = new b2CircleDef();

    bodyDefinition.position.Set(7, 7);

    this.body = world.CreateBody(bodyDefinition);

    shapeDefinition.radius = this.radius;
    shapeDefinition.restitution = 0;
    shapeDefinition.density = 2;
    shapeDefinition.friction = 0.9;

    this.body.CreateShape(shapeDefinition);
    this.body.SetMassFromShapes();
  },

  setPosition: function(vector) {
    this.body.SetXForm(vector, 0);
  },

  draw: function(context) {
    var position = this.body.GetPosition();

    context.strokeStyle = "#000000";
    context.lineWidth = 1;
    context.fillStyle = "#000000";

    context.beginPath();
    context.arc(position.x * Brick.SIZE, position.y * Brick.SIZE, this.radius * Brick.SIZE, 0, Math.PI * 2, true);
    context.closePath();

    context.fill();
  }
});