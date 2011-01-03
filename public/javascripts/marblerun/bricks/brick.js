var Brick = Class.create(DisplayObject, {
  
  initialize: function($super) {
    $super();

    this.x = 0;
    this.y = 0;
    
    this.rotation = 0;
    
    this.state = "dead";
    this.selected = false;
    
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

    if (this.state != "tiny") {

      if (this.selected) {

        context.strokeStyle = "#999999";
        context.lineJoin = "bevel";
        context.lineWidth = 5;

      } else {

        context.strokeStyle = "#F6F254";
        context.lineJoing = "miter";
        context.lineWidth = 1;

      }

      context.strokeStyle = (this.selected) ? "#FFFFFF" : "#F6F254";
    }

    if (this.rotation !== 0 || true) { 
      this.applyRotation(context);
    }

    if (this.state == "drag") {
      
      var storeSize = Brick.SIZE;
      Brick.SIZE = Brick.BIG_SIZE;

      this.drawShape(context);

      Brick.SIZE = storeSize;

    } else {

      this.drawShape(context); 

    }

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

  applyShadow: function(context) {
    if (this.state == "field" || this.state == "tiny") { 
      return;
    }

    var multiplyer = (this.state == "drag") ? 8 : 6;
    var shadowRotation = this.rotation + Math.PI / 4;

    context.shadowOffsetX = Math.cos(Math.PI / 4) * - multiplyer;
    context.shadowOffsetY = Math.sin(Math.PI / 4) * multiplyer;

    // context.shadowOffsetX = Math.cos(shadowRotation) * - multiplyer;
    // context.shadowOffsetY = Math.sin(shadowRotation) * multiplyer;

    context.shadowBlur = 3;
    context.shadowColor = "rgba(0, 0, 0, 0.3)";

  },

  applyScale: function(context) {
    
    // DEPRICATED - SCALE MADE BY BRICKSIZE;

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

    context.save();

      context.fillStyle = Pattern.brick;
      context.translate(this.x, this.y);
      this.draw(context);

    context.restore();

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

Brick.prototype.type = "Brick";
