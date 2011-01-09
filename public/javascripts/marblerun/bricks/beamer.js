var Beamer = new Class.create(Brick, {
  
  initialize: function($super) {
    $super();
    
    this.partner = null;
    this.hasBeamed = false;
  },

  drawShape: function(context) {

    context.beginPath();

    context.moveTo(0, Brick.SIZE / 2);
    context.lineTo(Brick.SIZE / 5, Brick.SIZE / 2);
    
    context.bezierCurveTo(
      Brick.SIZE / 5, Brick.SIZE * 9 / 10, 
      Brick.SIZE * 4 / 5, Brick.SIZE * 9 / 10, 
      Brick.SIZE * 4 / 5, Brick.SIZE / 2
    );
    
    context.lineTo(Brick.SIZE, Brick.SIZE / 2);
    context.lineTo(Brick.SIZE, Brick.SIZE);
    context.lineTo(0, Brick.SIZE);
    
    context.closePath();
    
    context.fill();
    
    context.stroke();
  },

  createShapes: function(body) {
    var rect1Definition = new b2PolygonDef();

    rect1Definition.vertexCount = 3;
    rect1Definition.restitution = 0;
    rect1Definition.friction = 0.9;

    rect1Definition.vertices[0].Set(-0.5, 0);
    rect1Definition.vertices[1].Set(0.2, 0.5);
    rect1Definition.vertices[2].Set(-0.5, 0.5);
    
    body.CreateShape(rect1Definition);
    
    var rect2Definition = new b2PolygonDef();

    rect2Definition.vertexCount = 3;
    rect2Definition.restitution = 0;
    rect2Definition.friction = 0.9;

    rect2Definition.vertices[0].Set(0.5, 0);
    rect2Definition.vertices[1].Set(0.5, 0.5);
    rect2Definition.vertices[2].Set(-0.2, 0.5);
    
    body.CreateShape(rect2Definition);
    
    var rect3Definition = new b2PolygonDef();

    rect3Definition.vertexCount = 4;
    rect3Definition.restitution = 0;
    rect3Definition.friction = 0.9;

    rect3Definition.vertices[0].Set(-0.2, 0.25);
    rect3Definition.vertices[1].Set(0.2, 0.25);
    rect3Definition.vertices[2].Set(0.2, 0.35);
    rect3Definition.vertices[3].Set(-0.2, 0.35);
    
    rect3Definition.isSensor = true;
    
    // collides only with ball
    rect3Definition.filter.maskBits = 0x0002;
    
    body.CreateShape(rect3Definition);
    
    // var circleDefinition = new b2CircleDef();
    // 
    // circleDefinition.radius = 3 / 10;
    // circleDefinition.restitution = 0;
    // circleDefinition.friction = 0.9;
    // 
    // circleDefinition.isSensor = true;
    // 
    // // collides only with ball
    // circleDefinition.filter.maskBits = 0x0002;
    // 
    // body.CreateShape(circleDefinition);
    

    var myScope = this;

    body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };
    
    body.afterCollision = function(contact) {
      myScope.afterCollision(contact);
    };
    
    this.divorce();
  },
  
  removeBody: function($super, world) {
    $super(world);
    
    if (this.partner) {
      
      this.partner.divorce();
      this.partner = null;
      
    } else if (this.parent.singles[this.pairType] == this) {
      
      this.parent.singles[this.pairType] = null;
      console.log("deadly");
      
    }
    
  },
  
  divorce: function() {
    
    this.partner = null;
    this.parent.findPartner(this);
    
  },

  onCollision: function(contact) {
    
    var ball;

    if (contact.shape1.m_isSensor) {
      
      ball = contact.shape2.GetBody().ballInstance;
      
    } else if (contact.shape2.m_isSensor) {
      
      ball = contact.shape1.GetBody().ballInstance;
      
    } else {
      
      return;
      
    }
    
    if (this.partner && !this.hasBeamed) {
      
      var rotateVector = function(vector, angle) {
        return new b2Vec2(
          vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
          vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
        );
      };
      
      ball.positionVector.Set(this.partner.cell.col + 0.5, this.partner.cell.row + 0.5);
      ball.velocityVector = rotateVector(ball.body.GetLinearVelocity(), this.partner.rotation - this.rotation + Math.PI);
      
      this.hasBeamed = this.partner.hasBeamed = true;
      
    }

  },
  
  afterCollision: function(contact) {
    
    if (this.hasBeamed && this.partner &&
      (contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance)) {
      
      this.hasBeamed = this.partner.hasBeamed = false;
    }
  }

});

Beamer.prototype.type = "Beamer";
Beamer.prototype.pairType = "Beamer";