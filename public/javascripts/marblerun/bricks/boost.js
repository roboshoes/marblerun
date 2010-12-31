var Boost = new Class.create(Brick, {

  drawShape: function(context) {
    context.save();

      //this.applyShadow(context);

      context.beginPath();
      context.moveTo(Brick.SIZE * 4 / 5, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE * 9 / 10);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE * 7/ 10);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE * 3 / 10);
      context.lineTo(Brick.SIZE / 5, Brick.SIZE / 10);
      context.lineTo(Brick.SIZE * 4 / 5, Brick.SIZE / 2);     
      context.fill();
      
    context.restore();

    context.stroke();

  },

  createShapes: function(body) {
    var shapeDefinition = new b2PolygonDef();

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    shapeDefinition.vertices[0].Set(-0.5, -0.5);
    shapeDefinition.vertices[1].Set(0.5, -0.5);
    shapeDefinition.vertices[2].Set(0.5, 0.5);
    shapeDefinition.vertices[3].Set(-0.5, 0.5);

    shapeDefinition.isSensor = true;

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
      return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
      };
    };

    var boostVector = {
      x: 1,
      y: 0
    };

    ball.impulseVector = rotateVector(boostVector, this.body.GetAngle());


    console.log("SENSOR TIME BABY");

  }

});

Boost.isAvailable = function() {
  return true;
};

Boost.prototype.class = Boost;