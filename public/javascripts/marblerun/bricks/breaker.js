var Breaker = new Class.create(Brick, {

  initialize: function($super) {
    $super();
    
    this.isBroken = false;
    this.isBreaking = false;
    
    this.timeoutID = 0;
  },

  update: function() {
    if (this.isBreaking && !this.isBroken) {
      this.isBroken = true;
      var world = this.bodies[0].GetWorld();

      this.removeBody(world);
      this.createBody(world);
    }
  },

  reset: function() {
    this.isBreaking = false;
    
    if (this.timeoutID) {
      
      clearTimeout(this.timeoutID);
      this.timeoutID = 0;
    
    }

    if (this.isBroken) {
      this.isBroken = false;

      var world = this.bodies[0].GetWorld();

      this.removeBody(world);
      this.createBody(world);
    }
  },
  
  createBody: function(world) {
    this.bodies = [];
    var myScope = this;
    
    var rotateVector = function(vector, angle) {
      return new b2Vec2(
        vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
      );
    };
    
    var alphaVector = new b2Vec2(-0.5, -0.5);

    for (var i = 0; i < 4; i++) {
      betaVector = rotateVector(alphaVector, Math.PI / 2);
      
      var bodyDefinition = new b2BodyDef();

      bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);
      bodyDefinition.angle = i * Math.PI / 2;

      var body = world.CreateBody(bodyDefinition);

      this.createShapes(body);

      body.SetMassFromShapes();
      
      body.afterCollision = function(contact) {
        myScope.afterCollision(contact);
      };
      
      this.bodies.push(body);
      
    }
  },
  
  removeBody: function(world) {
    
    var bodyCount = world.m_bodyCount;

    for (var i = 0; i < this.bodies.length; i++) {
      world.DestroyBody(this.bodies[i]);
    }
    
    if (bodyCount == world.m_bodyCount) {
      console.error("Body was not removed");
    }
    
  },

  drawShape: function(context) {
    if (this.bodies) {
      
      context.save();
      context.translate(
        -this.cell.col * Brick.SIZE, 
        -this.cell.row * Brick.SIZE
      );
    
      for (var i = 0; i < this.bodies.length; i++) {
      
        context.save();
      
        var position = this.bodies[i].GetPosition();
        context.translate(position.x * Brick.SIZE, position.y * Brick.SIZE);
        context.rotate(this.bodies[i].GetAngle());
      
        this.drawTriangle(context);
      
        context.restore();
      
      }
      
      context.restore();
  
  } else {
    
    this.drawFullShape(context);
    
  }

  },
  
  drawTriangle: function(context) {
    
    context.save();

      this.applyShadow(context);

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-Brick.SIZE / 2, -Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 2, -Brick.SIZE / 2);
      context.lineTo(0, 0);
      context.fill();
      
    context.restore();

    context.stroke();
    
  },
  
  drawFullShape: function(context) {
    
    context.save();

      this.applyShadow(context);
      
      context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);
      context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);
      
    context.restore();

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(Brick.SIZE, Brick.SIZE);
    context.moveTo(Brick.SIZE, 0);
    context.lineTo(0, Brick.SIZE);
    context.stroke();
    
  },

  createShapes: function(body) {
    var shapeDefinition = new b2PolygonDef();

    shapeDefinition.vertexCount = 3;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    shapeDefinition.vertices[0].Set(-0.5, -0.5);
    shapeDefinition.vertices[1].Set(0.5, -0.5);
    shapeDefinition.vertices[2].Set(0, 0);

    if (this.isBroken) {
      shapeDefinition.density = 2;
      //shapeDefinition.isSensor = true;
    }

    body.CreateShape(shapeDefinition);
    
  },

  afterCollision: function(contact) {
    if (this.isBroken) {
      return;
    }
    
    if (contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance) {

      if (this.timeoutID) {

        clearTimeout(this.timeoutID);
        this.timeoutID = 0;

      }

      var myScope = this;

      setTimeout(function() {
        myScope.onTimeout();
      }, 200);
    }
  },
  
  onTimeout: function() {
    
    this.isBreaking = true;
    
  },
  
  rotate: function() {
    return;
  }

});

Breaker.isAvailable = function() {
  return true;
};

Breaker.prototype.type = "Breaker";