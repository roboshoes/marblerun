var Ball = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.radius = 0.25;
    this.impulseVector = new b2Vec2();
    
    this.rollLength = 0;
    this.lastPosition = new b2Vec2();

    this.isDragable = true;
    this.isDynamic = true;
  },
  
  update: function() {
    
    var minus = function(a, b) {
      return new b2Vec2(
        a.x - b.x,
        a.y - b.y
      );
    };
    
    difference = minus(this.lastPosition, this.body.GetPosition());
    this.rollLength += difference.Length();
    
    this.lastPosition.Set(this.body.GetPosition().x, this.body.GetPosition().y);
    
    var getFormatString = function(number) {
      
      number = parseInt(number, 10);
      
      var decimal = number % 10;
      
      number = parseInt(number / 10, 10);
      
      if (number < 10) {
        number = '0' + number;
      }
      
      return number.toString() + '.' + decimal;
    };
    
    $('lengthDisplay').update(getFormatString(this.rollLength));
    
    if (this.impulseVector.Length() > 0) {
      
      this.body.ApplyImpulse(this.impulseVector, this.body.GetPosition());
      this.impulseVector.Set(0, 0);
      
    }
  },
  
  reset: function() {
    this.rollLength = 0;
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
      
    } else {
      
      position = { 
        x: this.cell.col + 0.5, 
        y: this.cell.row + 0.5
      };
      
    }

    context.save();

      context.strokeStyle = "#FF0000";
      context.lineWidth = 1;
      context.fillStyle = "#000000";

      context.translate((position.x - this.cell.col) * Brick.SIZE, (position.y - this.cell.row) * Brick.SIZE);
      
      if (this.body) {
        context.rotate(this.body.GetAngle());
      }
      
      context.save();

        //this.applyShadow(context);
        context.beginPath();
        context.arc(0, 0, this.radius * Brick.SIZE, 0, Math.PI * 2, true);
        context.lineTo(this.radius * Brick.SIZE, 0);

        context.fill();

      context.restore();
      
      context.stroke();

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

Ball.isAvailable = function() {
  return true;
};

Ball.prototype.type = "Ball";