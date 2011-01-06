var Boost = new Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.isInFront = false;
  },

  drawShape: function(context) {

    if (Pattern.image["boost"]) {
      
      context.drawImage(Pattern.image["boost"], 0, 0);
      
      context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);
      
    } else {

      context.beginPath();

      context.moveTo(Brick.SIZE * 4 / 5, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE * 9 / 10);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE * 7/ 10);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE * 3 / 10);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE / 10);
      context.closePath();
      
      context.fill();
      
      context.stroke();
    }
  },

  createShapes: function(body) {
    var shapeDefinition = new b2PolygonDef();

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    shapeDefinition.vertices[0].Set(-0.4, -0.4);
    shapeDefinition.vertices[1].Set(0.4, -0.4);
    shapeDefinition.vertices[2].Set(0.4, 0.4);
    shapeDefinition.vertices[3].Set(-0.4, 0.4);

    shapeDefinition.isSensor = true;

    // collides only with ball
    shapeDefinition.filter.maskBits = 0x0002;

    body.CreateShape(shapeDefinition);

    var myScope = this;

    body.whileCollision = function(contact) {
      myScope.whileCollision(contact);
    };
  },

  whileCollision: function(contact) {
    var ball;

    if (contact.shape1.GetBody().ballInstance) {
      ball = contact.shape1.GetBody().ballInstance;
    } else {
      ball = contact.shape2.GetBody().ballInstance;
    }

    var rotateVector = function(vector, angle) {
      return new b2Vec2(
        vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
      );
    };

    var boostVector = new b2Vec2(1, 0);

    ball.impulseVector.Add(rotateVector(boostVector, this.body.GetAngle()));

  }

});

Boost.isAvailable = function() {
  return true;
};

Boost.prototype.type = "Boost";