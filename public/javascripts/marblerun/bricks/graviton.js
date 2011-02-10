var Graviton = new Class.create(Brick, {

  initialize: function($super) {
    $super();
    
    this.isActive = false;
    this.timeoutID = 0;
    
    this.isDynamic = false;
    this.hasShadow = true;
  },

  reset: function() {
    
    this.isActive = false;
    
    if (this.timeoutID) {
    
      clearTimeout(this.timeoutID);
      this.timeoutID = 0;
      
    }
  },
  
  createBody: function($super, world) {
    
    $super(world);
    
    var myScope = this;
    
    this.body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };
    
  },

  drawShape: function($super, context) {
    
    $super(context);

    context.beginPath();

    context.moveTo(Brick.SIZE / 2, Brick.SIZE / 7);
    context.lineTo(Brick.SIZE * 6 / 7, Brick.SIZE / 2);
    context.lineTo(Brick.SIZE * 5 / 7, Brick.SIZE / 2);
    context.lineTo(Brick.SIZE * 5 / 7, Brick.SIZE * 6 / 7);
    context.lineTo(Brick.SIZE * 2 / 7, Brick.SIZE * 6 / 7);
    context.lineTo(Brick.SIZE * 2 / 7, Brick.SIZE / 2);
    context.lineTo(Brick.SIZE / 7, Brick.SIZE / 2);
    
    context.closePath();

    if (this.isActive) {
      
      context.save();
      
      context.fillStyle = context.strokeStyle;
      context.fill();
      
      context.restore();

    } else {

      context.stroke();

    }

  },
  
  onCollision: function(contact) {
    
    if (contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance) {
      
      this.parent.setActiveGraviton(this);
      this.isActive = true;
      this.parent.renderNew = true;
      
      var myScope = this;
      
      this.timeoutID = setTimeout(function() {
        
        var rotateVector = function(vector, angle) {
          return new b2Vec2(
            vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
            vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
          );
        };

        var gravity = new b2Vec2(0, -9.81),
            world = myScope.body.GetWorld();

        world.SetGravity(rotateVector(gravity, myScope.body.GetAngle()));

        myScope.timeoutID = 0;
        
      }, 50);
    }
  }

});

Graviton.prototype.type = "Graviton";