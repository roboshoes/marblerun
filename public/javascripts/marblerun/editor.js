var Editor = Class.create(Renderer, {

  initialize: function($super, mainCanvas, bufferCanvas, imageCanvas) {
    $super(mainCanvas, bufferCanvas);

    this.imageCanvas = imageCanvas;

    this.eventEngine = new EventEngine();
    this.eventEngine.addListener("startDrag", this.onStartDrag, this);
    this.eventEngine.addListener("stopDrag", this.onStopDrag, this);
    this.eventEngine.addListener("click", this.onClick, this);
    this.eventEngine.addListener("mouseMove", this.onMouseMove, this);

    this.baseToolbox = new Toolbox();
    this.baseToolbox.parent = this;
    this.baseToolbox.x = this.field.x + this.field.width + 3 * Brick.SIZE;
    this.baseToolbox.y = this.field.y;

    this.specialToolbox = new Toolbox();
    this.specialToolbox.parent = this;
    this.specialToolbox.x = this.baseToolbox.x + this.baseToolbox.width + Brick.SIZE;
    this.specialToolbox.y = this.baseToolbox.y;

    this.baseToolbox.otherBox = this.specialToolbox;
    this.specialToolbox.otherBox = this.baseToolbox;

    this.dragElement = null;
    this.hoverElement = null;

    /* 
     * Fill base toolbox with base Bricks.
     */
    var baseBricks = [Brick, Ramp, Kicker, Curve, Line];
    for (var i = 0; i < baseBricks.length; i++) {

      this.baseToolbox.addBrick(baseBricks[i]);
      
    }

    /* 
     * Fill special toolbox with special Bricks.
     */
    var specialBricks = [Ball, Exit, Spring, Boost, Breaker];
    for (var i = 0; i < specialBricks.length; i++) {
      if (specialBricks[i].isAvailable()) {

        this.specialToolbox.addBrick(specialBricks[i]);

      }
    }

    this.setSize();

    this.renderAll = true;
  },

  setSize: function() {

    this.width = this.mainCanvas.width = this.bufferCanvas.width = this.specialToolbox.x + this.specialToolbox.width + Brick.SIZE;
    this.height = this.mainCanvas.height = this.bufferCanvas.height = 580;

  },
  
  drawStatics: function() {
    
    if (this.renderAll || this.field.renderNew || 
      this.baseToolbox.renderNew || this.specialToolbox.renderNew) {
        
        this.clearCanvas(this.mainCanvas);

        this.mainContext.save();

          this.mainContext.translate(.5, .5);
          
          this.field.drawStatics(this.mainContext);
          
          this.baseToolbox.draw(this.mainContext);
          this.specialToolbox.draw(this.mainContext);
          
          this.staticImageData = this.mainContext.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    
        this.mainContext.restore();
        
        this.renderAll = false;
        this.field.renderNew = false;
        this.baseToolbox.renderNew = false; 
        this.specialToolbox.renderNew = false;
    }
  },
  
  drawDynamics: function() {
    
    this.bufferContext.save();
    
      this.clearCanvas(this.bufferCanvas);
    
      this.bufferContext.translate(.5, .5);
      
      this.field.drawDynamics(this.bufferContext);
      
      if (this.hoverElement) {
        
        this.drawHoverElement(this.bufferContext);
        
      }
      
      if (this.dragElement) {
        
        this.dragElement.drawGlobal(this.bufferContext);
        this.renderAll = true;
        
      }
    
    this.bufferContext.restore();
  },
  
  drawHoverElement: function(context) {
    
    context.save();
    
      context.fillStyle = "#333333";
      context.globalAlpha = 0.3;
      
      context.fillRect(
        this.hoverElement.x, this.hoverElement.y,
        this.hoverElement.width, this.hoverElement.height
      );
    
    context.restore();
    
  },
  
  dragBrick: function(brick) {

    brick.state = "drag";

    var point = {x: this.eventEngine.latestEvent.mouseX, y: this.eventEngine.latestEvent.mouseY};

    brick.x = point.x - Brick.BIG_SIZE / 2;
    brick.y = point.y - Brick.BIG_SIZE / 2; 

    this.dragElement = brick;

    this.eventEngine.addListener("drag", this.onDrag, this);
  },

  onStopDrag: function(event) {
    var x = event.mouseX;
    var y = event.mouseY;

    if (this.dragElement && this.field.hitTest(x, y)) {
      
      if (this.field.intervalID) {
        
        this.field.resetTrack();
        
      }
      
      this.field.dropBrick(this.dragElement);
      
    }
    
    this.renderAll = true;
    this.dragElement = null;
    this.eventEngine.removeListener("drag", this.onDrag);
  },

  onStartDrag: function(event) {
    
    if (this.field.renderDynamics) {
      this.field.resetTrack();
    }

    if (this.field.hitTest(event.mouseX, event.mouseY)) {

      this.field.resetTrack();
      this.field.onStartDrag(event.mouseX - this.field.x, event.mouseY- this.field.y);

    } else if (this.baseToolbox.hitTest(event.mouseX, event.mouseY)) {
      
      this.baseToolbox.onStartDrag(event.mouseX - this.baseToolbox.x, event.mouseY - this.baseToolbox.y);

    } else if (this.specialToolbox.hitTest(event.mouseX, event.mouseY)) {
      
      this.specialToolbox.onStartDrag(event.mouseX - this.specialToolbox.x, event.mouseY - this.specialToolbox.y);

    }
  },

  onDrag: function(event) {

    if (!this.dragElement) return;

    this.dragElement.x = parseInt(event.mouseX - Brick.SIZE / 2, 10);
    this.dragElement.y = parseInt(event.mouseY - Brick.SIZE / 2, 10);
    
    this.renderAll = true;

  },

  initializeHTMLInterface: function($super) {
    var myScope = this;

    $('runButton').observe('click', function(event) {
      myScope.handleRunClick(event);
    });

    $('clearButton').observe('click', function(event) {
      myScope.field.clearTrack(true);
    });

    $('debugButton').observe('click', function(event) {
      myScope.field.debugMode = !myScope.field.debugMode;
    });

    $('publishButton').observe('click', function(event) {
      myScope.publishTrack();
    });
  },

  onClick: function(event) {

    if (this.baseToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.baseToolbox.renderNew = true;
      this.baseToolbox.onClick(event.mouseX - this.baseToolbox.x, event.mouseY - this.baseToolbox.y);

    } else if (this.specialToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.specialToolbox.renderNew = true;
      this.specialToolbox.onClick(event.mouseX - this.specialToolbox.x, event.mouseY - this.specialToolbox.y);

    } else if (this.field.hitTest(event.mouseX, event.mouseY)) {

      this.field.renderNew = true;
      
      if (this.field.intervalID) {
      
        this.field.resetTrack();
      
      } else {
      
        this.field.onClick(event.mouseX - this.field.x, event.mouseY - this.field.y);
    
      }
    }
  },
  
  onMouseMove: function(event) {

    this.hoverElement = null;

    if (this.field.hitTest(event.mouseX, event.mouseY)) {

      this.hoverElement = this.getCellBox(this.field, event.mouseX, event.mouseY);

    } else if (this.baseToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.hoverElement = this.getCellBox(this.baseToolbox, event.mouseX, event.mouseY);

    } else if (this.specialToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.hoverElement = this.getCellBox(this.specialToolbox, event.mouseX, event.mouseY);

    }
  },
  
  getCellBox: function(grid, x, y) {
    return grid.getCellBox(
      grid.getCell(
        x - grid.x, 
        y - grid.y
      )
    );
  },

  publishTrack: function() {
    
    // TODO: refactor

    var parameters = {};

    parameters['track[json]'] = Object.toJSON(this.field.getTrack());
    parameters['track[imagedata]'] = this.field.getTrackImage(this.imageCanvas);;
    parameters['track[username]'] = $('userName').value;
    parameters['track[trackname]'] = $('trackName').value;
    parameters['track[length]'] = this.field.trackLength;

    new Ajax.Request('/tracks', {
      method: 'post',
      parameters: parameters,
      requestHeaders: {Accept: 'application/json'},
      onSuccess: function(transport) {
        parseResponse(transport, true);
      },
      onFailure: function(transport) {
        console.log("AjaxError: Publishing failed!")
      }
    });
  }
  
});