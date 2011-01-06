var Breaker = new Class.create(Brick, {

  initialize: function($super) {
    $super();
    
    this.isBroken = false;
    this.isBreaking = false;
    
    this.alpha = 1.0;
    
    this.timeoutID = 0;
    this.isDynamic = true;
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
    
    this.alpha = 1.0;
    
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
      
      body.onCollision = function(contact) {
        myScope.onCollision(contact);
      };
      
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
    
    if (this.alpha <= 0) {
      return;
    }
    
    if (this.bodies) {
      
      context.save();
      
      context.globalAlpha = this.alpha;
      
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
        
        var x = this.x + (position.x - this.cell.col - 0.7) * Brick.SIZE,
            y = this.y + (position.y - this.cell.row - 0.7) * Brick.SIZE;
        
        context.addClearRectangle(new Rectangle(x, y, Brick.SIZE * 1.4, Brick.SIZE * 1.4));
      
      }
      
      context.restore();
  
  } else {
    
    this.drawFullShape(context);
    
  }

  },
  
  drawTriangle: function(context) {
    
    context.save();

      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(-Brick.SIZE / 2, -Brick.SIZE / 2);
      context.lineTo(Brick.SIZE / 2, -Brick.SIZE / 2);
      context.closePath();
      
      context.fill();
      
    context.restore();

    context.stroke();
    
  },
  
  drawFullShape: function(context) {
    
    context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(Brick.SIZE, Brick.SIZE);
    context.moveTo(Brick.SIZE, 0);
    context.lineTo(0, Brick.SIZE);
    
    context.stroke();
    
    context.addClearRectangle(new Rectangle(this.x, this.y, Brick.SIZE, Brick.SIZE));
    
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
      
      // collides only with stage not ball
      shapeDefinition.filter.maskBits = 0x0001;
    }

    body.CreateShape(shapeDefinition);
    
  },
  
  onCollision: function(contact) {
    if (this.timeoutID) {
      
      clearTimeout(this.timeoutID);
      this.timeoutID = 0;
    
    }
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

      this.timeoutID = setTimeout(function() {
        myScope.onTimeout();
      }, 200);
    }
  },
  
  onTimeout: function() {
    
    this.isBreaking = true;
    
    var rotateVector = function(vector, angle) {
      return new b2Vec2(
        vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
      );
    };
    
    var impulseVector = new b2Vec2(0, -Math.random() * 2);
    //var impulseVector = new b2Vec2(10, 0);
    
    for (var i = 0; i < this.bodies.length; i++) {
      
      this.bodies[i].ApplyImpulse(
        impulseVector, 
        this.bodies[i].GetPosition()
      );
      
      impulseVector = rotateVector(impulseVector, Math.PI / 2);
    }
    
    var myScope = this;
    
    setTimeout(function() {
      myScope.decrementAlpha();
    }, 100);
    
  },
  
  decrementAlpha: function() {
    
    if (this.alpha > 0 && this.isBroken) {
      this.alpha -= .05;
      
      var myScope = this;
      
      setTimeout(function() {
        myScope.decrementAlpha();
      }, 100);
    }
  },
  
  rotate: function() {
    return;
  }

});

Breaker.isAvailable = function() {
  return true;
};

Breaker.prototype.type = "Breaker";