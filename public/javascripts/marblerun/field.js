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

    this.initializeBox2D();

    this.addEntryAndExit();

    this.reset();
  },
  
  reset: function() {
    
    this.ball.reset({
      x: this.entry.cell.col + 0.5,
      y: this.entry.cell.row + 0.5
    });
    
    if (this.intervalID)
      clearInterval(this.intervalID);
    
    this.intervalID = null;
    this.stopCalculation = false;
    
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

    this.ball = new Ball();
    this.ball.createBody(this.world);

    this.intervalLength = 1 / 120;
  },

  startBox2D: function() {
    
    this.reset();
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.calculateBox2D();
    }, this.intervalLength * 1000);
    
  },

  stopBox2D: function() {
    this.stopCalculation = true;
  },

  calculateBox2D: function() {
    
    if (this.stopCalculation) {
      
      this.reset();
      //this.startBox2D();
      
    } else {
      
      this.world.Step(this.intervalLength * 3, 10);
      
    }
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

    this.drawGrid(context);

    if (!this.debugMode) {
      this.drawShadows(context);
      this.drawFieldShadow(context);
      this.drawElements(context);
    } else {
      this.drawBodies(context);
    } 

    this.drawFrame(context);

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
    
    this.world.SetContactListener(contactListener);
    
  },
  
  addEntryAndExit: function() {
    
    this.entry = new Entry();
    this.exit = new Exit();
    
    this.dropBrickAtCell(this.entry, {row: 0, col: 0});
    this.dropBrickAtCell(this.exit, {row: (this.rows - 1), col: 0});
    
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

        if (shape.m_vertices) {
          context.moveTo(shape.m_vertices[0].x * Brick.SIZE, shape.m_vertices[0].y * Brick.SIZE);

          for (var i = 1; i < shape.m_vertexCount; i++) {

            context.lineTo(shape.m_vertices[i].x * Brick.SIZE, shape.m_vertices[i].y * Brick.SIZE);
            
          } 

          context.lineTo(shape.m_vertices[0].x * Brick.SIZE, shape.m_vertices[0].y * Brick.SIZE);
        }  

      }

      context.stroke();

    context.restore();
  }

});
