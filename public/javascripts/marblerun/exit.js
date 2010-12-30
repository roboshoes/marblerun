var Exit = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.isDragable = true;
    this.collisionCallback = false;
  },

  drawShape: function(context) {
    
    context.save();

      this.applyShadow(context);
      context.fillRect(0, Brick.SIZE / 2, Brick.SIZE, Brick.SIZE / 2);

    context.restore();

    context.strokeRect(0, Brick.SIZE / 2, Brick.SIZE, Brick.SIZE / 2);

  },

  createBody: function(world) {
    var bodyDefinition = new b2BodyDef(),
        shapeDefinition = new b2PolygonDef();

    bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);

    this.body = world.CreateBody(bodyDefinition);

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;  

    shapeDefinition.vertices[0].Set(0.5, 0.5);
    shapeDefinition.vertices[1].Set(-0.5, 0.5);
    shapeDefinition.vertices[2].Set(-0.5, 0);
    shapeDefinition.vertices[3].Set(0.5, 0);

    this.body.CreateShape(shapeDefinition);
    this.body.SetMassFromShapes();

    var myScope = this;

    this.body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };

  },

  onCollision: function(contact) {

    if (this.collisionCallback) {

      this.collisionCallback();

    }

  },

  rotate: function() {
    return;
  }

});

Exit.isAvailable = function() {
  return false;
}

Exit.prototype.class = Exit;