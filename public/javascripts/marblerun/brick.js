var Brick = Class.create(DisplayObject, {
  
  initialize: function() {
    this.x = 0;
    this.y = 0;
    this.selected = false;
    this.rotation = 0;

    this.cell = {
      row: 0,
      col: 0
    }
  },

  draw: function(context) {

    context.strokeStyle = (this.selected) ? "#999999" : "#000000";
    context.lineWidth = (this.selected) ? 5 : 1;
    context.fillStyle = "#000000";

    context.fillRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.strokeRect(0, 0, Brick.SIZE, Brick.SIZE);
    context.stroke();

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

  rotate: function(context) {
    
    context.translate(Brick.SIZE / 2, Brick.SIZE / 2);
    context.rotate(this.rotation * Math.PI / 180);
    context.translate(- Brick.SIZE / 2, - Brick.SIZE / 2);
    
  }

});

Brick.isAvailable = function() {
  return true;
};

Brick.SIZE = 50;

Brick.prototype.class = Brick;