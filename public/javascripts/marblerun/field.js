var Field = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.x = 50;
    this.y = 100;

    this.rows = 15;
    this.cols = 10;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.bricks = [];

    this.initializeBox2D();

    this.intervalID = null;
  },

  onStartDrag: function(mouseX, mouseY) {
    var brick = this.removeBrickAt(this.getCell(mouseX, mouseY));

    if (brick) {
      this.parent.dragBrick(brick);
    }
  },

  initializeBox2D: function() {
    var worldBoundingBox = new b2AABB(),
      gravity = new b2Vec2(0, 9.81);

    worldBoundingBox.lowerBound.Set(-10, -10);
    worldBoundingBox.upperBound.Set(20, 25);

    this.world = new b2World(worldBoundingBox, gravity, true);

    this.createBorders();

    this.ball = new Ball();
    this.ball.createBody(this.world);

    this.ball.reset({
      x: 0.5,
      y: 0.5
    });

    this.intervalLength = 1 / 120;
  },

  startBox2D: function() {
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.calculateBox2D();
    }, this.intervalLength * 1000);
  },

  stopBox2D: function() {
    this.ball.reset({
      x: 0.5,
      y: 0.5
    });

    clearInterval(this.intervalID);

    this.intervalID = null;
  },

  calculateBox2D: function() {
    this.world.Step(this.intervalLength * 3, 10);
  },

  dropBrick: function($super, brick) {
    brick.state = "field";

    if ($super(brick)) {
      brick.createBody(this.world);
    }
  },

  dropBrickAtCell: function($super, brick, cell) {
    $super(brick, cell);

    brick.createBody(this.world);
  },

  removeBrickAt: function($super, cell) {
    var brick = $super(cell);

    if (brick) {
      
      this.world.DestroyBody(brick.body);
      
    }

    return brick;
  },

  draw: function($super, context) {
    this.drawFrame(context);
    this.drawGrid(context);
    this.drawShadows(context);
    this.drawElements(context);

    context.save();

      context.translate(this.x, this.y);

      this.ball.draw(context);

    context.restore();
  },

  onClick: function(mouseX, mouseY) {
    
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell);

    if (brick) {
      
      brick.rotate(Math.PI / 2);

      return;
    }

    if (this.getBrickAt(cell) || !this.parent.toolbox.selectedBrick) return;
      
    var brick = new this.parent.toolbox.selectedBrick.class();
        brick.state = "field";

    this.dropBrickAtCell(brick, cell);
  },

  createBorders: function() {
    var bodyDefinition = new b2BodyDef(),
        shapeDefinitions = [],
        body;

    bodyDefinition.position.Set(0, 0);

    body = this.world.CreateBody(bodyDefinition);

    for (var i = 0; i < 4; i++) {
      shapeDefinitions[i] = new b2PolygonDef();
      shapeDefinitions[i].vertexCount = 3;
      shapeDefinitions[i].restitution = 0;
      shapeDefinitions[i].friction = 0.9;  
    }

    shapeDefinitions[0].vertices[0].Set(this.cols, 0);
    shapeDefinitions[0].vertices[1].Set(0, 0);
    shapeDefinitions[0].vertices[2].Set(this.cols, -1);

    shapeDefinitions[1].vertices[0].Set(this.cols, this.rows);
    shapeDefinitions[1].vertices[1].Set(this.cols, 0);
    shapeDefinitions[1].vertices[2].Set(this.cols + 1, this.rows);

    shapeDefinitions[2].vertices[0].Set(0, this.rows);
    shapeDefinitions[2].vertices[1].Set(this.cols, this.rows);
    shapeDefinitions[2].vertices[2].Set(this.cols, this.rows + 1);

    shapeDefinitions[3].vertices[0].Set(0, 0);
    shapeDefinitions[3].vertices[1].Set(0, this.rows);
    shapeDefinitions[3].vertices[2].Set(-1, 0);

    for (var i = 0; i < 4; i++) {
      body.CreateShape(shapeDefinitions[i]);
    }

    body.SetMassFromShapes();
  }

});


