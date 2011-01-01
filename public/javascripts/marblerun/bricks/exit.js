var Exit = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.isDragable = true;
  },

  drawShape: function(context) {
    
    context.save();

      this.applyShadow(context);
      context.fillRect(0, Brick.SIZE / 2, Brick.SIZE, Brick.SIZE / 2);

    context.restore();

    context.strokeRect(0, Brick.SIZE / 2, Brick.SIZE, Brick.SIZE / 2);

  },

  createShapes: function(body) {
    var shapeDefinition = new b2PolygonDef();

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;  

    shapeDefinition.vertices[0].Set(0.5, 0.5);
    shapeDefinition.vertices[1].Set(-0.5, 0.5);
    shapeDefinition.vertices[2].Set(-0.5, 0);
    shapeDefinition.vertices[3].Set(0.5, 0);

    body.CreateShape(shapeDefinition);

    var myScope = this;

    body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };

  },

  onCollision: function(contact) {
    
    this.parent.parent.onBallExit();

  },

  rotate: function() {
    return;
  }

});

Exit.isAvailable = function() {
  return true;
}

Exit.prototype.class = Exit;

Exit.prototype.type = "Exit";