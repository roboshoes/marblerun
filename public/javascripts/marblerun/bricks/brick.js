var Brick = Class.create(DisplayObject, {
  
  initialize: function($super) {
    $super();

    this.x = 0;
    this.y = 0;
    
    this.rotation = 0;
    
    this.state = "dead";
    this.selected = false;
    this.isDragable = true;

    this.cell = {
      row: 0,
      col: 0
    }
  },
  
  update: function() {
    
  },

  draw: function(context) {

    context.strokeStyle = (this.selected) ? "#FFFFFF" : "#F6F254";
    context.lineWidth = 1;
    context.fillStyle = "#000000";

    if (this.rotation != 0 || true) this.applyRotation(context);
    if (this.state == "drag") this.applyScale(context);

    this.drawShape(context);

    context.beginPath();
    context.closePath();

  },

  drawShape: function(context) {
    
    context.save();

      this.applyShadow(context);
      context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);

    context.restore();

    context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);

  },

  applyShadow: function(context) {
    if (this.state == "field") return;

    var multiplyer = (this.state == "drag") ? 8 : 6;
    var shadowRotation = this.rotation + Math.PI / 4;

    if (Prototype.Browser.Gecko) {
      
      context.shadowOffsetX = Math.cos(Math.PI / 4) * - multiplyer;
      context.shadowOffsetY = Math.sin(Math.PI / 4) * multiplyer;

    } else {
      
      context.shadowOffsetX = Math.cos(shadowRotation) * - multiplyer;
      context.shadowOffsetY = Math.sin(shadowRotation) * multiplyer;

    }

    context.shadowBlur = 3;
    context.shadowColor = "rgba(0, 0, 0, 0.3)";

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

    context.save();

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

  rotate: function(radian) {
    this.body.SetXForm(this.body.GetPosition(), this.rotation + radian);
    
    this.rotation = this.body.GetAngle();

  }

});

Brick.isAvailable = function() {
  return true;
};

Brick.SIZE = 27;

Brick.prototype.class = Brick;