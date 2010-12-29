var Brick = Class.create(DisplayObject, {
  
  initialize: function($super) {
    $super();

    this.x = 0;
    this.y = 0;
    this.selected = false;
    this.rotation = 0;
    this.state = "dead";

    this.cell = {
      row: 0,
      col: 0
    }
  },

  draw: function(context) {

    context.strokeStyle = (this.selected) ? "#FFFFFF" : "#000000";
    context.lineWidth = 1;
    context.fillStyle = "#000000";

    if (this.state == "drag") this.applyScale(context);

    this.applyShadow(context);

    context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.stroke();

  },

  applyShadow: function(context) {
    if (this.state == "field") return;

    context.shadowOffsetX = (this.state == "drag") ? -6 : -4;  
    context.shadowOffsetY = (this.state == "drag") ? 6 : 4;  
    context.shadowBlur = 2;  
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
    var bodyDefinition = new b2BodyDef(),
      shapeDefinition = new b2PolygonDef();

    bodyDefinition.position.Set(this.cell.col + 0.5, this.cell.row + 0.5);

    this.body = world.CreateBody(bodyDefinition);

    shapeDefinition.SetAsBox(0.5, 0.5);
    shapeDefinition.restitution = 0;
    shapeDefinition.friction = 0.9;

    this.body.CreateShape(shapeDefinition);
    this.body.SetMassFromShapes();
  }, 

  rotate: function(radian) {
    this.rotation += radian;
  }

});

Brick.isAvailable = function() {
  return true;
};

Brick.SIZE = 27;

Brick.prototype.class = Brick;