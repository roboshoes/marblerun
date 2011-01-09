var Field = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.rows = 15;
    this.cols = 10;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.bricks = [];
    this.singles = {};

    this.debugMode = false;

    this.trackLength = 0;
  },
  
  setup: function() {
    $('lengthDisplay').update("0000");
    this.trackLength = 0;

    this.initializeBox2D();

    this.clearTrack(true);
  },
  
  draw: function($super, context) {

    if (!this.debugMode) {
      
      $super(context);

    } else {

      this.drawBodies(context);

    }
  },
  
  drawBodies: function(context) {
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;

    context.save();

      context.translate(this.x, this.y);
      
      var body;

      for (body = this.world.GetBodyList(); body !== null; body = body.GetNext()) {
        this.drawBody(context, body);
      }
    
    context.restore();
    
    context.addClearRectangle(new Rectangle(
      this.x - Brick.SIZE, this.y - Brick.SIZE, 
      (this.cols + 2) * Brick.SIZE, (this.rows + 2) * Brick.SIZE
    ));
  },

  drawBody: function(context, body) {
    context.save();
      
      var position = body.GetPosition(),
        shape, i;

      context.translate(Brick.SIZE * position.x, Brick.SIZE * position.y);
      context.rotate(body.GetAngle());
      
      context.beginPath();

      context.moveTo(0, 0);
      context.lineTo(0, -Brick.SIZE / 2);
      
      for (shape = body.GetShapeList(); shape !== null; shape = shape.GetNext()) {

        if (shape.m_vertices && shape.m_vertices[0]) {
          context.moveTo(shape.m_vertices[0].x * Brick.SIZE, shape.m_vertices[0].y * Brick.SIZE);

          for (i = 1; i < shape.m_vertexCount; i++) {

            context.lineTo(shape.m_vertices[i].x * Brick.SIZE, shape.m_vertices[i].y * Brick.SIZE);

          } 

          context.lineTo(shape.m_vertices[0].x * Brick.SIZE, shape.m_vertices[0].y * Brick.SIZE);
          
        } else {
          
          context.moveTo(Ball.radius * Brick.SIZE, 0);
          context.arc(0, 0, Ball.radius * Brick.SIZE, 0, Math.PI * 2, true);
          
        }
      }

      context.stroke();

    context.restore();
  },

  initializeBox2D: function() {
    var worldBoundingBox = new b2AABB(),
        gravity = new b2Vec2(0, 9.81);

    worldBoundingBox.lowerBound.Set(-10, -10);
    worldBoundingBox.upperBound.Set(20, 25);

    this.world = new b2World(worldBoundingBox, gravity, true);

    this.createBorders();
    this.initContactListener();
    this.initContactFilter();

    this.intervalLength = 1 / 120;
  },

  startBox2D: function() {
    
    this.time = new Date().getMilliseconds();
    
    this.resetTrack();
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.calculateBox2D();
    }, this.intervalLength * 1000);

    $('lengthDisplay').update("0000");
    this.trackLength = 0;
  },

  stopBox2D: function() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
    
    this.intervalID = null;
  },

  calculateBox2D: function() {
    var i;
    
    for (i = 0; i < this.bricks.length; i++) {
      
      this.bricks[i].update();
      
    }

    this.world.Step(0.02, 20);
    
    // this.currentTime = new Date().getMilliseconds();
    // 
    // console.log(this.currentTime - this.time);
    // 
    // this.time = this.currentTime;
    
  },

  createBorders: function() {
    var bodyDefinition = new b2BodyDef(),
        shapeDefinitions = [],
        body, i;

    bodyDefinition.position.Set(0, 0);

    body = this.world.CreateBody(bodyDefinition);

    for (i = 0; i < 4; i++) {
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

    for (i = 0; i < 4; i++) {
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

    contactListener.Remove = function(contact) {

      if (contact.shape1.GetBody().afterCollision) {
        
        contact.shape1.GetBody().afterCollision(contact);
        
      } else if (contact.shape2.GetBody().afterCollision) {
        
        contact.shape2.GetBody().afterCollision(contact);
        
      }
      
    };
    
    this.world.SetContactListener(contactListener);
    
  },
  
  initContactFilter: function() {
    
    var contactFilter = new b2ContactFilter();
    
    contactFilter.ShouldCollide = function(shape1, shape2) {
      
      if (shape1.GetBody().beforeCollision) {
        
        return shape1.GetBody().beforeCollision(shape1, shape2);
        
      } else if (shape1.GetBody().beforeCollision) {

        return shape1.GetBody().beforeCollision(shape1, shape2);

      }
      
      var filter1 = shape1.GetFilterData(),
          filter2 = shape2.GetFilterData();
      
      if (filter1.groupIndex === filter2.groupIndex && filter1.groupIndex !== 0) {
          return filter1.groupIndex > 0;
      }
      
      return (filter1.maskBits & filter2.categoryBits) !== 0 && (filter1.categoryBits & filter2.maskBits) !== 0;
      
    };
    
    this.world.SetContactFilter(contactFilter);
    
  },
  
  findPartner: function(brick) {
    
    if (this.singles[brick.pairType]) {
      
      if (this.singles[brick.pairType] === brick) {
        console.log("self");
        return;
      }
      
      brick.partner = this.singles[brick.pairType];
      this.singles[brick.pairType].partner = brick;
      
      this.singles[brick.pairType] = null;
      
    } else {
      
      this.singles[brick.type] = brick;
      
    }
    
  },
  
  dropBrickAt: function($super, brick, cell) {

    if ($super(brick, cell)) {
      brick.createBody(this.world);
      
      this.validTrack = false;
      $('publishButton').removeClassName('activePublish');
    }
  },

  removeBrickAt: function($super, cell) {
    var brick = this.getBrickAt(cell);

    if (brick) {
      if ($super(cell)) {
        
        brick.removeBody(this.world);
        
        this.validTrack = false;
        $('publishButton').removeClassName('activePublish');
        
        return true;
        
      } else {

        return false;
        
      }
    }
    
    return true;
  },

  onClick: function(mouseX, mouseY) {
    
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell);

    if (brick) {

      brick.rotate(Math.PI / 2);

    } else if (cell && this.parent.selectElement && this.parent.selectElement.brick) {

      var dropBrick = new (eval(this.parent.selectElement.brick.type))();
          dropBrick.setRotation(this.parent.selectElement.brick.rotation);

      this.dropBrickAt(dropBrick, cell);

    }
    
    this.renderNew = true;
  },
  
  onStartDrag: function(mouseX, mouseY) {
    var brick = this.getBrickAt(this.getCell(mouseX, mouseY));

    if (brick) {

      if (brick.isDraggable) {
      
        brick.isVisible = false;
        this.renderNew = true;
        
        var draggedBrick = new (eval(brick.type))();
            draggedBrick.setRotation(brick.rotation);
            draggedBrick.origin = brick;
        
        this.parent.dragBrick(draggedBrick);
      
      }
      
    } else {

      this.onDrag(mouseX, mouseY);
      this.parent.startDragBricking();
      
    }
  },
  
  onDrag: function(mouseX, mouseY) {
    
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell);

    if (!cell || !this.parent.selectElement) {
      return;
    }
        
    if (this.parent.selectElement.brick) {
      
      if (brick && (!brick.isRemoveable ||
        (brick.type === this.parent.selectElement.brick.type && brick.rotation === this.parent.selectElement.brick.rotation))) {
        return;
      }

      var dropBrick = new (eval(this.parent.selectElement.brick.type))();
          dropBrick.setRotation(this.parent.selectElement.brick.rotation);

      this.dropBrickAt(dropBrick, cell);
      
    } else if (brick && brick.isRemoveable) {
      
        this.removeBrickAt(cell);
      
    }
    
    this.renderNew = true;
  },
  
  onStopDrag: function(event, dragBrick) {
    
    var cell = this.getCell(
      dragBrick.x - this.x + Brick.SIZE / 2,
      dragBrick.y - this.y + Brick.SIZE / 2
    );
    
    if (cell) {
      
      var brick = this.getBrickAt(cell);
    
      if (this.intervalID) {
      
        this.resetTrack();
      
      }
      
      if (brick && !brick.isRemoveable) {
        
        if (dragBrick.origin) {
          
          dragBrick.origin.isVisible = true;
          this.renderNew = true;
          
        }
        
      } else {
        
        if (brick && dragBrick.origin !== brick) {
          
          this.removeBrickAt(cell);
          
        }
        
        if (dragBrick.origin) {
          
          dragBrick.origin.x = this.x + cell.col * Brick.SIZE;
          dragBrick.origin.y = this.y + cell.row * Brick.SIZE;
          
          dragBrick.origin.moveToCell(cell);
          
          dragBrick.origin.isVisible = true;
          this.renderNew = true;
          
        } else {
        
          this.dropBrickAt(dragBrick, cell);
          
        }
        
      }
      
    } else if (dragBrick.origin) {
      
      if (dragBrick.isRemoveable) {
        
        this.removeBrickAt(dragBrick.origin.cell);
      
      } else {
        
        dragBrick.origin.isVisible = true;
        this.renderNew = true;
      
      }
        
    }
  },
  
  resetTrack: function() {
    
    this.stopBox2D();
    
    var i;
    
    for (i = 0; i < this.bricks.length; i++) {
      
      this.bricks[i].reset();
      
    }
  },
  
  setTrack: function(track) {
    
    var that = this, 
        p, b;
    
    var error = function(message) {
      
      console.error(message);
      that.clearTrack(true);
      
      return false;
    };
    
    if (!track.bricks || track.bricks.length < 3) {
      return error("track has no/not enough bricks");
    }
    
    this.clearTrack();
    
    var hasBall = false,
        hasExit = false;
    
    
    for (b in track.bricks) {
      
      if (track.bricks.hasOwnProperty(b)) {
        
        var brick = track.bricks[b];
    
        if (brick.type === "Ball") {
      
          if (hasBall) {
            return error("track has more than one ball");
          } else {
            hasBall = true;
          }
        }
    
        if (brick.type === "Exit") {
      
          if (hasExit) {
            return error("track has more than one exit");
          } else {
            hasExit = true;
          }
      
        }
    
        var dropBrick = new (eval(brick.type))();
    
        dropBrick.setRotation(brick.rotation * Math.PI / 2);
    
        this.dropBrickAt(
          dropBrick,
          {
            row: brick.row,
            col: brick.col
          }
        );
      }
    }
    
    if (!hasBall || !hasExit) {
      return error("track has no ball and/or exit");
    }
    
    if (track.pairs) {
      for (p = 0; p < track.pairs.length; p++) {
        
        var girl = this.getBrickAt(track.pairs[p].girl),
            boy = this.getBrickAt(track.pairs[p].boy);
            
        if (girl && boy && girl.pairType === boy.type) {
          
          girl.partner = boy;
          boy.partner = girl;
          
        } else {
          
          return error("track has false pair information");
          
        }
        
      }
    }
      
    return true;
  },
  
  getTrack: function() {
    
    this.resetTrack();
    
    var track = {
      bricks: {},
      pairs: []
    };
    
    var i, j;
    
    var getRotationAsNumber = function(radians) {
      var number = 0;
      
      while (radians > 0) {
        
        radians -= Math.PI / 2;
        number++;
        
      }
      
      return (number %= 4);
    };
      
    for (i = 0; i < this.bricks.length; i++) {
      
      var brick = this.bricks[i];
      
      track.bricks[brick.cell.row * this.cols + brick.cell.col] = {
        type: brick.type,
        rotation: getRotationAsNumber(brick.rotation),
        row: brick.cell.row,
        col: brick.cell.col
      };
      
      if (brick.pairType && brick.partner) {
        
        var isPushed = false;
        
        for (j = 0; j < track.pairs.length; j++) {
          
          if (track.pairs[j].girl === brick || track.pairs[j].boy === brick) {
            
            isPushed = true;
            break;
            
          }
          
        }
        
        if (!isPushed) {
          track.pairs.push({
            girl: {
              row: brick.cell.row,
              col: brick.cell.col
            },
            boy: {
              row: brick.partner.cell.row,
              col: brick.partner.cell.col
            }
          });
        }
      }
    }
    
    return track;
    
  },
  
  clearTrack: function(setBallAndExit) {
    
    this.resetTrack();
    
    var i;
    
    for (i = 0; i < this.bricks.length; i++) {
      
      this.bricks[i].removeBody(this.world);
      
    }
    
    this.bricks = [];
    this.singles = {};
    
    if (setBallAndExit) {
      
      this.dropBrickAt(new Ball(), {row: 0, col: 0});
      this.dropBrickAt(new Exit(), {row: (this.rows - 1), col: 0});
      
    }
    
  },

  getTrackImage: function(canvas) {

    this.resetTrack();

    var context = canvas.getContext("2d");
    var storeBrickSize = Brick.SIZE,
        i;
    Brick.SIZE = Brick.TINY_SIZE;

    canvas.width = Brick.SIZE * this.cols + 2;
    canvas.height = Brick.SIZE * this.rows + 2;

    context.save();

      context.translate(0.5, 0.5);

      context.lineWidth = 0.5;

      context.beginPath();

      for (i = 1; i < this.rows; i++) {
        
        context.dashedLine(0, Brick.SIZE * i, Brick.SIZE * this.cols, Brick.SIZE * i, 2);

      }

      for (i = 1; i < this.cols; i++) {

        context.dashedLine(Brick.SIZE * i, 0, Brick.SIZE * i, Brick.SIZE * this.rows, 2);

      }

      context.stroke();
      context.beginPath(); // Clear Context Buffer
      
      if (this.bricks.length) {

        this.bricks[0].applyStyle(context);
        context.lineWidth = 0.5;

        for (i = 0; i < this.bricks.length; i++) {
          context.save();

            context.translate(this.bricks[i].cell.col * Brick.SIZE, this.bricks[i].cell.row * Brick.SIZE);
            this.bricks[i].draw(context);

          context.restore();
        }
      }
      
      context.strokeStyle = "#000000";
      context.lineWidth = 1;

      //context.fillRect(0, 0, Brick.SIZE * this.cols, Brick.SIZE * this.rows);
      context.strokeRect(0, 0, Brick.SIZE * this.cols, Brick.SIZE * this.rows);

    context.restore();

    Brick.SIZE = storeBrickSize;

    return canvas.toDataURL("image/png");

  }

});
