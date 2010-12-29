var Field = Class.create(Grid, {
  
  initialize: function() {
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

    this.ball = new Ball();
    this.ball.createBody(this.world);

    this.intervalLength = 1 / 120;
  },

  startBox2D: function() {

    var myScope = this;

    this.ball.setPosition({
      x: .5,
      y: .5
    });

    this.intervalID = setInterval(function() {
      myScope.calculateBox2D();
    }, this.intervalLength * 1000);
  },

  stopBox2D: function() {
    clearInterval(this.intervalID);

    this.intervalID = null;
  },

  calculateBox2D: function() {
    this.world.Step(this.intervalLength, 10);
  },

  dropBrick: function($super, brick) {
    if ($super(brick)) {
      brick.createBody(this.world);
    }
  },

  removeBrickAt: function($super, cell) {
    var brick = $super(cell);

    if (brick) {
      
      this.world.DestroyBody(brick.body);
      
    }

    return brick;
  },

  draw: function($super, context) {
    $super(context);

    context.save();

      context.translate(this.x, this.y);

      this.ball.draw(context);

    context.restore();
  },

  onClick: function(mouseX, mouseY) {
    
    var cell = this.getCell(mouseX, mouseY),
      brick = this.getBrickAt(cell);

    if (brick) {
      
      brick.rotation += 90;

      return;
    }

    if (this.getBrickAt(cell) || !this.parent.toolbox.selectedBrick) return;
      
    var brick = new this.parent.toolbox.selectedBrick.class();

    this.dropBrickAtCell(brick, cell);
  }

});


