var Brick = Class.create(DisplayObject, {
  
  initialize: function($super) {
    $super();

    this.x = 0;
    this.y = 0;
    
    this.rotation = 0;
    
    this.isDragable = true;
    this.isInFront = true;
    this.isDynamic = false;

    this.cell = {
      row: 0,
      col: 0
    };
  },
  
  update: function() {
    
  },

  draw: function(context) {

    if (this.rotation !== 0) { 
      this.applyRotation(context);
    }

    this.drawShape(context); 

    context.beginPath();
  },

  reset: function() {
    
  },

  drawShape: function(context) {
    
    context.save();

      this.applyShadow(context);
      context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);

    context.restore();

    context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);

  },
  
  applyStyle: function(context) {
    
    context.fillStyle = "#1E1E1E";
    context.strokeStyle = "#F2E049";
    
    context.lineJoing = "miter";
    context.lineWidth = 1;
    
  },

  applyShadow: function(context) {

    if (context.drawShadows && this.isInFront) {
      
      var multiplyer = Brick.SIZE / 4;

      context.shadowOffsetX = Math.cos(Math.PI / 4) * - multiplyer;
      context.shadowOffsetY = Math.sin(Math.PI / 4) * multiplyer;

      context.shadowBlur = 5;
      context.shadowColor = "rgba(0, 0, 0, 0.5)";
      
    }

  },

  applyScale: function(context) {
    
    context.translate(Brick.SIZE / 2, Brick.SIZE / 2);
    context.scale(1.1, 1.1);
    context.translate(- Brick.SIZE / 2, - Brick.SIZE / 2);

  },

  applyRotation: function(context) {

    context.translate(Brick.SIZE / 2, Brick.SIZE / 2);
    context.rotate(this.rotation);
    context.translate(- Brick.SIZE / 2, - Brick.SIZE / 2);

  },

  drawGlobal: function(context) {

    var storeSize = Brick.SIZE;
    Brick.SIZE = Brick.BIG_SIZE;

    context.save();

      context.translate(this.x, this.y);
      this.applyStyle(context);
      this.draw(context);

    context.restore();

    Brick.SIZE = storeSize;

    context.addClearRectangle(new Rectangle(this.x - Brick.SIZE / 2, this.y - Brick.SIZE / 2, Brick.SIZE * 2, Brick.SIZE * 2));
  },

  createBody: function(world) {
    var bodyDefinition = new b2BodyDef();

    bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);

    this.body = world.CreateBody(bodyDefinition);

    this.createShapes(this.body);

    this.body.SetMassFromShapes();
    
    if (this.rotation) {
      
      var rotation = this.rotation;
      this.rotation = 0;
      this.rotate(rotation);
      
    }
  },
  
  createShapes: function(body) {
    
    var shapeDefinition = new b2PolygonDef();
    
    shapeDefinition.SetAsBox(0.5, 0.5);
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    body.CreateShape(shapeDefinition);
    
  },
  
  removeBody: function(world) {
    
    var bodyCount = world.m_bodyCount;

    world.DestroyBody(this.body);

    if (bodyCount == world.m_bodyCount) {
      console.error("Body was not removed");
    }
    
  },

  rotate: function(radian) {
    if (this.body) {
      
      this.body.SetXForm(this.body.GetPosition(), this.rotation + radian);
    
      this.rotation = this.body.GetAngle();
      
    } else {
      
      this.rotation += radian;
      
    }
  }

});

Brick.isAvailable = function() {
  return true;
};

Brick.SIZE = 28;
Brick.BIG_SIZE = 32;
Brick.TINY_SIZE = 12;

Brick.prototype.type = "Brick";
