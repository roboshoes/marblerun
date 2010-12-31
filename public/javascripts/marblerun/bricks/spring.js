var Spring = new Class.create(Brick, {

  drawShape: function(context) {
    context.save();

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, 0);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);
      context.lineTo(0, Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE / 2);
      context.lineTo(0, 0);       
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

    body.CreateShape(shapeDefinition);

    var myScope = this;

    this.body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };
  },

  onCollision: function(contact) {
    var ball;

    // console.log(contact);

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

    var bodyPoint = this.body.GetPosition();
    var relativeContactPoint = {
      x: contact.position.x - bodyPoint.x,
      y: contact.position.y - bodyPoint.y
    };
    var contactPoint = rotateVector(relativeContactPoint, -this.body.GetAngle());

    // console.log(contactPoint, this.body.GetAngle());


    if (contactPoint.x > - 0.5 && contactPoint.x < 0.5 
      && contactPoint.y > - 0.6 && contactPoint.y < - 0.4) {
      console.log("BABÄNG");

      var springVector = {
        x: 0,
        y: -10
      }

      ball.impulseVector = rotateVector(springVector, this.body.GetAngle());
    }

  }

});

Spring.isAvailable = function() {
  return true;
};

Spring.prototype.class = Spring;