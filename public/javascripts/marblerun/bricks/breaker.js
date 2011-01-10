var Breaker = new Class.create(Brick, {

  initialize: function($super) {
    $super();
    
    this.isBroken = false;
    this.isBreaking = false;
    
    this.alpha = 1.0;
    
    this.timeoutID = 0;
    this.isDynamic = true;
    this.hasShadow = false;
    
    this.generateShapes();
  },

  update: function() {
      
    if (this.isBreaking && !this.isBroken) {
      this.isBroken = true;
      var world = this.bodies[0].GetWorld();

      this.removeBody(world);
      this.createBody(world);

      this.applyImpulse();
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
    
    // this.isDynamic = false;
    // this.parent.renderNew = true;
  },
  
  createBody: function(world) {
    this.bodies = [];
    var myScope = this,
        bodyOnCollision = function(contact) {
          myScope.onCollision(contact);
        },
        bodyAfterCollision = function(contact) {
          myScope.afterCollision(contact);
        },
        i;

    for (i = 0; i < this.shapes.length; i++) {
      
      var bodyDefinition = new b2BodyDef();

      bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);

      var body = world.CreateBody(bodyDefinition);

      this.createShapes(body, i);

      body.SetMassFromShapes();
      
      
      body.onCollision = bodyOnCollision;
      body.afterCollision = bodyAfterCollision;
      
      this.bodies.push(body);
      
    }
  },
  
  removeBody: function(world) {
    
    var bodyCount = world.m_bodyCount,
        i;

    for (i = 0; i < this.bodies.length; i++) {
      world.DestroyBody(this.bodies[i]);
    }
    
    if (bodyCount === world.m_bodyCount) {
      //console.error("Body was not removed");
    }
    
  },
  
  moveToCell: function(cell) {
    
    this.cell = cell;
    var i;
    
    if (this.bodies.length) {
    
      for (i = 0; i < this.bodies.length; i++) {
        
        this.bodies[i].SetXForm(new b2Vec2(cell.col + 0.5, cell.row + 0.5), this.bodies[i].GetAngle());
        
      }
      
    }
  },

  drawShape: function(context) {
    
    var i, j, x, y, position;
    
    if (this.alpha <= 0) {
      return;
    }
      
    context.save();
  
    if (this.alpha !== 1.0) {
      context.globalAlpha = this.alpha;
    }
    
    context.translate(-this.cell.col * Brick.SIZE, -this.cell.row * Brick.SIZE);

    for (i = 0; i < this.shapes.length; i++) {
  
      context.save();
        
        if (this.bodies) { 
          
          position = this.bodies[i].GetPosition();
          
        } else {
          
          position = {x: this.cell.col + 0.5, y: this.cell.row + 0.5};
          
        }
    
        context.translate(position.x * Brick.SIZE, position.y * Brick.SIZE);
        
        if (this.bodies) {
          context.rotate(this.bodies[i].GetAngle());
        }
  
        context.beginPath();

        context.moveTo(this.shapes[i][0].x * Brick.SIZE, this.shapes[i][0].y * Brick.SIZE);
      
        for (j = 1; j < this.shapes[i].length; j++) {

            context.lineTo(this.shapes[i][j].x * Brick.SIZE, this.shapes[i][j].y * Brick.SIZE);

        }
      
        context.closePath();
        
        context.fill();
        context.stroke();
  
      context.restore();
    
      x = this.x + (position.x - this.cell.col - 0.7) * Brick.SIZE;
      y = this.y + (position.y - this.cell.row - 0.7) * Brick.SIZE;
    
      context.addClearRectangle(new Rectangle(x, y, Brick.SIZE * 1.4, Brick.SIZE * 1.4));
  
    }
    
    context.restore();
    
  },
  
  createShapes: function(body, index) {
    
    var shapeDefinition = new b2PolygonDef(),
        i;

    shapeDefinition.vertexCount = this.shapes[index].length;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    for (i = 0; i < this.shapes[index].length; i++) {
    
      shapeDefinition.vertices[i] = this.shapes[index][i];
    
    }

    if (this.isBroken) {
      shapeDefinition.density = 2;
    
      // collides only with stage not ball
      shapeDefinition.filter.maskBits = 0x0001;
    }

    body.CreateShape(shapeDefinition);
  },
  
  onCollision: function(contact) {
    
    if (this.timeoutID && (contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance)) {
      
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
    // this.isDynamic = true;
    // 
    // this.parent.renderNew = true;
    
  },
  
  applyImpulse: function() {
    
    var i;
    
    var rotateVector = function(vector, angle) {
      return new b2Vec2(
        vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
      );
    };
    
    var impulseVector = new b2Vec2(0, -Math.random());
    impulseVector = rotateVector(impulseVector, -Math.PI / 3);
    
    for (i = 0; i < this.bodies.length; i++) {
      
      this.bodies[i].ApplyImpulse(
        impulseVector, 
        this.bodies[i].GetPosition()
      );
      
      impulseVector = rotateVector(impulseVector, Math.PI / 3);
    }
    
    var myScope = this;
    
    setTimeout(function() {
      myScope.decrementAlpha();
    }, 100);
  },
  
  decrementAlpha: function() {
    
    if (this.alpha > 0 && this.isBroken) {
      this.alpha -= 0.05;
      
      var myScope = this;
      
      setTimeout(function() {
        myScope.decrementAlpha();
      }, 100);
    }
  },
  
  generateShapes: function() {

    this.shapes = [];

    var middlePoint = new b2Vec2((Math.random() / 2) - 0.25, (Math.random() / 2) - 0.25),
        outlinePoints = [
          new b2Vec2(-0.5, (Math.random() / 2) - 0.25),

          new b2Vec2(-0.5, -0.5),

          new b2Vec2(-Math.random() / 2, -0.501),
          new b2Vec2(Math.random() / 2, -0.501),

          new b2Vec2(0.5, -0.5),

          new b2Vec2(0.501, (Math.random() / 2) - 0.25),

          new b2Vec2(0.5, 0.5),

          new b2Vec2(Math.random() / 2, 0.501),
          new b2Vec2(-Math.random() / 2, 0.501),

          new b2Vec2(-0.501, 0.5)
        ],
        vertexNumbers = [3, 2, 3, 3, 2, 3],
        counter = 0,
        i, j;
        
    vertexNumbers.shuffle();

    for (i = 0; i < 6; i++) {

      var shape = [];

      shape.push(middlePoint);

      for (j = 0; j < vertexNumbers[i]; j++) {

        shape.push(outlinePoints[counter % 10]);

        counter++;

      }

      counter--;

      this.shapes.push(shape);
    }
  },
  
  rotate: function() {
    return;
  }

});

Breaker.prototype.type = "Breaker";