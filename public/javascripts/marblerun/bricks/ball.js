var Ball = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.radius = 0.2;
    this.impulseVector = new b2Vec2();

    this.isDragable = true;
  },
  
  update: function() {
    
    if (this.impulseVector.Length() > 0) {
      
      this.body.ApplyImpulse(this.impulseVector, this.body.GetPosition());
      this.impulseVector.Set(0, 0);
      
    }
  },
  
  reset: function() {
    this.body.SetXForm(
      {
        x: this.cell.col + 0.5, 
        y: this.cell.row + 0.5
      }, 
      0
    );
    
    this.body.SetLinearVelocity({x: 0, y: 0});
    
    this.body.SetAngularVelocity(0);
    
    this.impulseVector.Set(0, 0);
  },

  drawShape: function(context) {
    
    var position;
    
    if (this.body) {
    
      var position = this.body.GetPosition();
      
    } else {
      
      position = { 
        x: this.cell.col + 0.5, 
        y: this.cell.row + 0.5
      }
      
    }

    context.save();

      context.strokeStyle = "#FF0000";
      context.lineWidth = 1;
      context.fillStyle = "#000000";

      context.translate((position.x - this.cell.col) * Brick.SIZE, (position.y - this.cell.row) * Brick.SIZE);
      
      if (this.body)
        context.rotate(this.body.GetAngle());
      
      context.save();

        this.applyShadow(context);
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
}

Ball.prototype.class = Ball;

Ball.prototype.type = "Ball";