var Breaker = new Class.create(Brick, {

  initialize: function($super) {
    $super();
    
    this.isBroken = false;
    this.isBreaking = false;
  },

  update: function() {
    if (this.isBreaking && !this.isBroken) {
      this.isBroken = true;
      var world = this.body.GetWorld();

      this.removeBody(world);
      this.createBody(world);
    }
  },

  reset: function() {
    this.isBreaking = false;

    if (this.isBroken) {
      this.isBroken = false;

      var world = this.body.GetWorld();

      this.removeBody(world);
      this.createBody(world);
    }
  },

  drawShape: function(context) {
    context.save();

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, 0);
      context.lineTo(0, Brick.SIZE);
      context.lineTo(0, 0);
      context.lineTo(Brick.SIZE, Brick.SIZE);
      context.lineTo(Brick.SIZE, 0);
      context.moveTo(Brick.SIZE, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);
      context.fill();
      
    context.restore();

    context.stroke();

  },

  createShapes: function(body) {
    var shapeDefinitions = [];
    var rotateVector = function(vector, angle) {
      return new b2Vec2(
        vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
      );
    };
    var alphaVector = new b2Vec2(-0.5, -0.5);

    for (var i = 0; i < 4; i++) {
      shapeDefinitions[i] = new b2PolygonDef();
      var betaVector = rotateVector(alphaVector, Math.PI / 2);

      shapeDefinitions[i].vertexCount = 3;
      shapeDefinitions[i].restitution = 0;
      shapeDefinitions[i].friction = 0.9;

      shapeDefinitions[i].vertices[0] = alphaVector;
      shapeDefinitions[i].vertices[1] = betaVector;
      shapeDefinitions[i].vertices[2].Set(0, 0);

      alphaVector = betaVector;

      if (this.isBroken) {
        shapeDefinitions[i].density = 2;
      }

      body.CreateShape(shapeDefinitions[i]);
    }

    var myScope = this;

    this.body.afterCollision = function(contact) {
      myScope.afterCollision(contact);
    };
  },

  afterCollision: function(contact) {
    if (contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance) {
      this.isBreaking = true;
    }
  }

});

Breaker.isAvailable = function() {
  return true;
};

Breaker.prototype.type = "Breaker";