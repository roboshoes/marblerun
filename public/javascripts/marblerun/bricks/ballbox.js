var BallBox = Class.create(Brick, {
  
  initialize: function($super) {
    $super();
    
    this.ball = new Ball();
    this.timeoutID = 0;
    
  },
  
  update: function() {
    
    if (this.ball.body) {
      
      this.ball.update();
      
    }
    
  },
  
  reset: function() {
      
    this.ball.reset();
    
    if (this.timeoutID) {
    
      clearTimeout(this.timeoutID);
      this.timeoutID = 0;
      
    } else if (this.ball.body) {
      
      this.isDynamic = false;
      
      var world = this.body.GetWorld();
      
      this.ball.removeBody(world);
      
    }
    
  },
  
  createBody: function($super, world) {
    
    $super(world);

    var myScope = this;

    this.body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };
  },

  drawShape: function(context) {
    
    if (this.ball.body && !this.parent.renderStatics) {

      context.restore();
      context.save();

      context.translate(this.cell.col * Brick.SIZE, this.cell.row * Brick.SIZE);

      this.ball.draw(context);

      context.restore();
      context.save();
    
    } else {
      
      context.beginPath();

      context.moveTo(0, 0);
      context.lineTo(Brick.SIZE, 0);
      context.lineTo(Brick.SIZE, Brick.SIZE * 5 / 14);
      context.lineTo(0, Brick.SIZE * 5 / 14);

      context.closePath();
      context.fill();


      context.beginPath();

      context.moveTo(0, Brick.SIZE * 5 / 14);
      context.lineTo(Brick.SIZE * 2 / 7, Brick.SIZE * 5 / 14);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE * 9 / 14);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE);
      context.lineTo(0, Brick.SIZE);

      context.closePath();
      context.fill();


      context.beginPath();

      context.moveTo(Brick.SIZE, Brick.SIZE * 5 / 14);
      context.lineTo(Brick.SIZE * 5 / 7, Brick.SIZE * 5 / 14);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE * 9 / 14);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE);
      context.lineTo(Brick.SIZE, Brick.SIZE);

      context.closePath();
      context.fill();

      context.clearShadow();


      context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);

      context.beginPath();

      context.moveTo(Brick.SIZE * 5 / 7, Brick.SIZE * 5 / 14);
      context.lineTo(Brick.SIZE / 2, Brick.SIZE * 9 / 14);
      context.lineTo(Brick.SIZE * 2 / 7, Brick.SIZE * 5 / 14);

      context.closePath();
      
      if (!this.ball.body) {
        
        context.save();
        
        context.fillStyle = "#800000";
        context.fill();
        
        context.restore();
        
      }
      
      context.stroke();
      
    }

  },
  
  shootBall: function() {
    
    this.isDynamic = true;
    
    var world = this.body.GetWorld(),
        shootVector = new b2Vec2(0, 6),
        offset = this.rotateVector(new b2Vec2(0, 0.6), this.body.GetAngle());

    this.ball.createBody(world);
    
    this.ball.parent = this.parent;
    this.ball.cell = this.cell;
    
    this.ball.reset();
    
    this.ball.x = this.x;
    this.ball.y = this.y;
    
    offset.Add(this.ball.body.GetPosition());
    this.ball.body.SetXForm(offset, 0);
    
    this.ball.impulseVector.Add(this.rotateVector(shootVector, this.body.GetAngle()));
    
    this.parent.renderNew = true;
    
  },
  
  onCollision: function(contact) {
    
    if ((contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance)
      && !this.timeoutID && !this.ball.body) {
      
      var myScope = this;
      
      this.timeoutID = setTimeout(function() {
        
        myScope.shootBall();
        myScope.timeoutID = 0;
        
      }, 50);
    }
  }
  
});

BallBox.prototype.type = "BallBox";