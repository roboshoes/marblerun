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
      Brick.SIZE / 5, Brick.SIZE, 
      Brick.SIZE * 4 / 5, Brick.SIZE, 
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
    var rectDefinition = new b2PolygonDef();

    rectDefinition.vertexCount = 4;
    rectDefinition.restitution = 0;
    rectDefinition.friction = 0.9;

    rectDefinition.vertices[0].Set(-0.5, 0);
    rectDefinition.vertices[1].Set(0.5, 0);
    rectDefinition.vertices[2].Set(0.5, 0.5);
    rectDefinition.vertices[3].Set(-0.5, 0.5);
    
    body.CreateShape(rectDefinition);
    
    var circleDefinition = new b2CircleDef();

    circleDefinition.radius = 3 / 10;
    circleDefinition.restitution = 0;
    circleDefinition.friction = 0.9;
    
    circleDefinition.isSensor = true;

    body.CreateShape(circleDefinition);

    var myScope = this;

    body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };
    
    body.afterCollision = function(contact) {
      myScope.afterCollision(contact);
    };
    
    if (!this.partner) {
      this.parent.findPartner(this);
    }
  },
  
  removeBody: function($super, world) {
    $super(world);
    
    if (this.partner) {
      
      this.partner.partner = null;
      this.parent.findPartner(this.partner);
      this.partner = null;
      
    }
    
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
      
      ball.positionVector.Set(this.partner.cell.col + 0.5, this.partner.cell.row + 0.5);
      
      this.hasBeamed = this.partner.hasBeamed = true;
      
    }

    // var rotateVector = function(vector, angle) {
    //   return new b2Vec2(
    //     vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    //     vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    //   );
    // };
    // 
    // var boostVector = new b2Vec2(1, 0);
    // 
    // ball.impulseVector.Add(rotateVector(boostVector, this.body.GetAngle()));

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