var Ball = Class.create({
  
  initialize: function() {
    this.radius = 0.2;
    this.impulseVector = null;
  },

  createBody: function(world) {
    
    var bodyDefinition = new b2BodyDef(),
      shapeDefinition = new b2CircleDef();

    bodyDefinition.position.Set(0, 0);

    this.body = world.CreateBody(bodyDefinition);

    shapeDefinition.radius = this.radius;
    shapeDefinition.restitution = 0;
    shapeDefinition.density = 2;
    shapeDefinition.friction = 0.9;

    this.body.CreateShape(shapeDefinition);
    this.body.SetMassFromShapes();

    this.body.ballInstance = this;
  },

  draw: function(context) {
    var position = this.body.GetPosition();

    context.strokeStyle = "#FF0000";
    context.lineWidth = 5;
    context.fillStyle = "#000000";

    context.save();

      context.translate(position.x * Brick.SIZE, position.y * Brick.SIZE);
      context.rotate(this.body.GetAngle());
      context.beginPath();
      context.arc(0, 0, this.radius * Brick.SIZE, 0, Math.PI * 2, true);
      context.lineTo(this.radius, 0);
      context.closePath();

    context.restore();

    context.fill();
    context.stroke();
  },

  reset: function(position) {
    this.body.SetXForm(position, 0);
    this.body.SetLinearVelocity({
      x: 0,
      y: 0
    });
    this.body.SetAngularVelocity(0);
  }
});