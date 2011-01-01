var Field = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.x = 50;
    this.y = 50;

    this.rows = 15;
    this.cols = 10;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.bricks = [];

    this.debugMode = false;
  },
  
  setup: function() {
    this.initializeBox2D();

    this.clearTrack();
  },
  
  resetTrack: function() {
    
    this.stopBox2D();
    
    for (var i = 0; i < this.bricks.length; i++) {
      
      this.bricks[i].reset();
      
    }
    
  },

  onStartDrag: function(mouseX, mouseY) {
    var brick = this.getBrickAt(this.getCell(mouseX, mouseY));

    if (brick && brick.isDragable) {
      
      this.removeBrickAt(brick.cell);
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
    this.initContactListener();

    this.intervalLength = 1 / 120;
  },

  startBox2D: function() {
    
    this.resetTrack();
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.calculateBox2D();
    }, this.intervalLength * 1000);
    
  },

  stopBox2D: function() {
    if (this.intervalID)
      clearInterval(this.intervalID);
      
    this.intervalID = null;
  },

  calculateBox2D: function() {
    
    for (var i = 0; i < this.bricks.length; i++) {
      
      this.bricks[i].update();
      
    }

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
    
    if (brick)
      brick.removeBody(this.world);

    return brick;
  },

  draw: function($super, context) {

    context.save();

      context.beginPath();
      context.moveTo(this.x - 2, this.y - 2);
      context.lineTo(this.x + this.width + 1, this.y - 2);
      context.lineTo(this.x + this.width + 1, this.y + this.height + 1);
      context.lineTo(this.x - 2, this.y + this.height + 1);
      context.closePath();
      context.clip();

      this.drawGrid(context);

      if (!this.debugMode) { 

        this.drawShadows(context);
        this.drawFieldShadow(context);
        this.drawElements(context);

      } else {
        this.drawBodies(context);
      } 

      this.drawFrame(context);

    context.restore();

  },

  onClick: function(mouseX, mouseY) {
    
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell);

    if (brick) {
      
      brick.rotate(Math.PI / 2);

      return;
    }

    var selectedBrick = this.parent.baseToolbox.selectedBrick || this.parent.specialToolbox.selectedBrick;

    if (this.getBrickAt(cell) || !selectedBrick) return;
      
    var brick = new selectedBrick.class();
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
      shapeDefinitions[i].vertexCount = 4;
      shapeDefinitions[i].restitution = 0;
      shapeDefinitions[i].friction = 0.9;  
    }

    shapeDefinitions[0].vertices[0].Set(this.cols, 0);
    shapeDefinitions[0].vertices[1].Set(0, 0);
    shapeDefinitions[0].vertices[2].Set(0, -1);
    shapeDefinitions[0].vertices[3].Set(this.cols, -1);

    shapeDefinitions[1].vertices[0].Set(this.cols, this.rows);
    shapeDefinitions[1].vertices[1].Set(this.cols, 0);
    shapeDefinitions[1].vertices[2].Set(this.cols + 1, 0);
    shapeDefinitions[1].vertices[3].Set(this.cols + 1, this.rows);

    shapeDefinitions[2].vertices[0].Set(0, this.rows);
    shapeDefinitions[2].vertices[1].Set(this.cols, this.rows);
    shapeDefinitions[2].vertices[2].Set(this.cols, this.rows + 1);
    shapeDefinitions[2].vertices[3].Set(0, this.rows + 1);

    shapeDefinitions[3].vertices[0].Set(0, 0);
    shapeDefinitions[3].vertices[1].Set(0, this.rows);
    shapeDefinitions[3].vertices[2].Set(-1, this.rows);
    shapeDefinitions[3].vertices[3].Set(-1, 0);

    for (var i = 0; i < 4; i++) {
      body.CreateShape(shapeDefinitions[i]);
    }

    body.SetMassFromShapes();
  },
  
  initContactListener: function() {
    
    var contactListener = new b2ContactListener();
    
    contactListener.Add = function(contact) {

      if (contact.shape1.GetBody().onCollision) {
        
        contact.shape1.GetBody().onCollision(contact);
        
      } else if (contact.shape2.GetBody().onCollision) {
        
        contact.shape2.GetBody().onCollision(contact);
        
      }
      
    };

    contactListener.Persist = function(contact) {

      if (contact.shape1.GetBody().whileCollision) {
        
        contact.shape1.GetBody().whileCollision(contact);
        
      } else if (contact.shape2.GetBody().whileCollision) {
        
        contact.shape2.GetBody().whileCollision(contact);
        
      }
      
    };
    
    this.world.SetContactListener(contactListener);
    
  },

  drawBodies: function(context) {
    context.strokeStyle = "#000000";
    context.lineWidth = 1;

    context.save();

      context.translate(this.x, this.y);

      for (var body = this.world.GetBodyList(); body != null; body = body.GetNext()) {
        this.drawBody(context, body);
      }
    
    context.restore();
  },

  drawBody: function(context, body) {
    context.save();
      
      var position = body.GetPosition();

      context.translate(Brick.SIZE * position.x, Brick.SIZE * position.y);
      context.rotate(body.GetAngle());
      context.beginPath();

      context.moveTo(0, 0);
      context.lineTo(0, -Brick.SIZE / 2);
      
      for (var shape = body.GetShapeList(); shape != null; shape = shape.GetNext()) {

        if (shape.m_vertices && shape.m_vertices[0]) {
          context.moveTo(shape.m_vertices[0].x * Brick.SIZE, shape.m_vertices[0].y * Brick.SIZE);

          for (var i = 1; i < shape.m_vertexCount; i++) {

            context.lineTo(shape.m_vertices[i].x * Brick.SIZE, shape.m_vertices[i].y * Brick.SIZE);
            
          } 

          context.lineTo(shape.m_vertices[0].x * Brick.SIZE, shape.m_vertices[0].y * Brick.SIZE);
        }  

      }

      context.stroke();

    context.restore();
  },
  
  setTrack: function(track) {
    
    if (!track.bricks || track.bricks.length <= 3 || 
        track.bricks[0].type != "Ball" || track.bricks[1].type != "Exit")
        return;
    
    this.clearTrack();
    
    this.ball.cell = {
      row: track.bricks[0].row, 
      col: track.bricks[0].col
    };
    
    this.exit.cell = {
      row: track.bricks[1].row, 
      col: track.bricks[1].col
    };
    
    for (var i = 2; i < track.bricks.length; i++) {
      
      var brick = new (eval(track.bricks[i].type))();
      
      brick.rotation = track.bricks[i].rotation * Math.PI / 2;
      
      this.dropBrickAtCell(
        brick,
        {
          row: track.bricks[i].row,
          col: track.bricks[i].col
        }
      );
      
    }
    
  },
  
  getTrack: function() {
    
    this.resetTrack();
    
    var track = {
      bricks: []
    };
    
    var getRotationAsNumber = function(radians) {
      var number = 0;
      
      while (radians > 0) {
        
        radians -= Math.PI / 2;
        number++;
        
      }
      
      return number %= 4;
      
    };
    
    for (var i = 0; i < this.bricks.length; i++) {
      
      track.bricks.push({
        type: this.bricks[i].type,
        rotation: getRotationAsNumber(this.bricks[i].rotation),
        row: this.bricks[i].cell.row,
        col: this.bricks[i].cell.col
      });
      
    }
    
    return track;
    
  },
  
  clearTrack: function () {
    
    this.resetTrack();
    
    for (var i = 0; i < this.bricks.length; i++) {
      
      this.bricks[i].removeBody(this.world);
      
    }
    
    this.bricks = [];
    
    this.ball = new Ball();
    this.exit = new Exit();
    
    this.dropBrickAtCell(this.ball, {row: 0, col: 0});
    this.dropBrickAtCell(this.exit, {row: (this.rows - 1), col: 0});
    
  },

  getTrackImage: function(canvas) {
    
    this.resetTrack();
    
    var context = canvas.getContext("2d");
    var tinyBrickSize = 12;
    var storeBrickSize = Brick.SIZE;

    canvas.width = tinyBrickSize * this.cols + 2;
    canvas.height = tinyBrickSize * this.rows + 2;

    context.save();

      context.translate(.5, .5);

      Brick.SIZE = tinyBrickSize;

      context.strokeStyle = "#000000";
      context.fillStyle = "#FBE500";
      context.lineWidth = 1;

      context.fillRect(0, 0, Brick.SIZE * this.cols, Brick.SIZE * this.rows);
      context.strokeRect(0, 0, Brick.SIZE * this.cols, Brick.SIZE * this.rows);

      context.lineWidth = .5;

      context.beginPath();

      for (var i = 1; i < this.rows; i++) {
        
        context.dashedLine(0, Brick.SIZE * i, Brick.SIZE * this.cols, Brick.SIZE * i, 2);

      }

      for (var i = 1; i < this.cols; i++) {

        context.dashedLine(Brick.SIZE * i, 0, Brick.SIZE * i, Brick.SIZE * this.rows, 2);

      }

      context.stroke();
      context.beginPath(); // Clear Context Buffer

      context.lineWidth = 0;
      context.fillStyle = "#000000";

      for (var i = 0; i < this.bricks.length; i++) {
        context.save();
          
          this.bricks[i].state = "tiny";

          context.translate(this.bricks[i].cell.col * Brick.SIZE, this.bricks[i].cell.row * Brick.SIZE);
          this.bricks[i].draw(context);

          this.bricks[i].state = "field";

        context.restore();
      }

      Brick.SIZE = storeBrickSize;

    context.restore();

    return canvas.toDataURL("image/png");

  }

});
