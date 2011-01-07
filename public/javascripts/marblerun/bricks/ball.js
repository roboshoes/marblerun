var Ball = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.radius = 0.25;
    this.impulseVector = new b2Vec2();
    
    this.rollLength = 0;
    this.lastPosition = new b2Vec2();

    this.isDraggable = true;
    this.isRemoveable = true;
    
    this.isDynamic = true;
    this.hasShadow = false;
  },
  
  update: function() {
    
    difference = this.minus(this.lastPosition, this.body.GetPosition());
    this.rollLength += difference.Length();
    
    this.lastPosition.Set(this.body.GetPosition().x, this.body.GetPosition().y);
    
    $('lengthDisplay').update(this.getFormatString(this.rollLength));
    this.parent.trackLength = this.rollLength / 10;
    
    if (this.impulseVector.Length() > 0) {
      
      this.body.ApplyImpulse(this.impulseVector, this.body.GetPosition());
      this.impulseVector.Set(0, 0);
      
    }
  },
  
  minus: function(a, b) {
    return new b2Vec2(
      a.x - b.x,
      a.y - b.y
    );
  },
  
  getFormatString: function(number) {
    
    number = parseInt(number, 10).toString();
    
    while (number.length < 4) {
      number = "0" + number;
    }
    
    return number.toString();
  },
  
  reset: function() {
    this.rollLength = 0;
    
    $('lengthDisplay').update(this.getFormatString(this.rollLength));
    this.parent.trackLength = this.rollLength / 10;
    
    this.lastPosition.Set(this.cell.col + 0.5, this.cell.row + 0.5);
    
    this.body.SetXForm(this.lastPosition, 0);
    
    this.body.SetLinearVelocity({x: 0, y: 0});
    this.body.SetAngularVelocity(0);
    
    this.impulseVector.Set(0, 0);
  },

  drawShape: function(context) {
    
    var position;
    
    if (this.body) {
    
      position = this.body.GetPosition();
      
      var x = this.x + (position.x - this.cell.col - 1) * Brick.SIZE,
          y = this.y + (position.y - this.cell.row - 1) * Brick.SIZE;

      context.addClearRectangle(new Rectangle(x, y, Brick.SIZE * 2, Brick.SIZE * 2));
      
    } else {
      
      position = { 
        x: this.cell.col + 0.5, 
        y: this.cell.row + 0.5
      };
      
    }

    context.save();

      context.translate((position.x - this.cell.col) * Brick.SIZE, (position.y - this.cell.row) * Brick.SIZE);
      
      if (this.body) {
        context.rotate(this.body.GetAngle());
      }
      
      context.fillStyle = "#800000";
      
      context.beginPath();
      context.arc(0, 0, this.radius * Brick.SIZE, 0, Math.PI * 2, true);
      context.lineTo(this.radius * Brick.SIZE, 0);
      
      context.fill();
      
      // context.beginPath();
      // context.moveTo(0, 0);
      // context.lineTo(this.radius * Brick.SIZE, 0);
      // 
      // context.stroke();

    context.restore();

  },

  createShapes: function(body) {
    var shapeDefinition = new b2CircleDef();

    shapeDefinition.radius = this.radius;
    shapeDefinition.restitution = 0;
    shapeDefinition.density = 2;
    shapeDefinition.friction = 0.9;

    shapeDefinition.filter.categoryBits = 0x0002;

    body.CreateShape(shapeDefinition);
    body.SetMassFromShapes();
    
    body.ballInstance = this;

  },
  
  rotate: function() {
    return;
  }
  
});

Ball.prototype.type = "Ball";