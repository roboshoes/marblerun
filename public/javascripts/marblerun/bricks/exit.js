var Exit = Class.create(Brick, {
  
  initialize: function($super) {
    $super();

    this.isDraggable = false;
    this.isRemoveable = false;
    
    this.isInFront = false;
    this.hasShadow = false;
  },

  drawShape: function(context) {
    var checkerBoardSize = 5,
        counter = 0;
        
    var checkerSize = Brick.SIZE / checkerBoardSize;

    for (var i = 0; i < checkerBoardSize; i++) {
      
      for (var j = 0; j < checkerBoardSize; j++) {
        
        if (counter % 2 === 0) {
          context.fillRect(checkerSize * j, checkerSize * i, checkerSize, checkerSize);
        }
        
        counter++;
      }
      
    }
  },

  createShapes: function(body) {
    var shapeDefinition = new b2PolygonDef();

    shapeDefinition.vertexCount = 4;
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;  

    shapeDefinition.vertices[0].Set(0.3, 0.3);
    shapeDefinition.vertices[1].Set(-0.3, 0.3);
    shapeDefinition.vertices[2].Set(-0.3, -0.3);
    shapeDefinition.vertices[3].Set(0.3, -0.3);

    shapeDefinition.isSensor = true;

    body.CreateShape(shapeDefinition);

    var myScope = this;

    body.onCollision = function(contact) {
      myScope.onCollision(contact);
    };

  },

  onCollision: function(contact) {
    if (contact.shape1.GetBody().ballInstance || contact.shape2.GetBody().ballInstance) {
      
      this.parent.parent.onBallExit();
      
      if (this.parent.trackLength && this.parent.bricks.length > 2) {
        
        this.parent.validTrack = true;
        $('publishButton').addClassName('activePublish');
        $('publishButtonWarning').style.visibility = "hidden";
        
      }
      
    }
  },

  rotate: function() {
    return;
  }

});

Exit.prototype.type = "Exit";