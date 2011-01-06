var Editor = Class.create(Renderer, {

  initialize: function($super, staticCanvas, dynamicCanvas, imageCanvas) {
    $super(staticCanvas, dynamicCanvas);
    
    this.dynamicContext.clearRectangle = new Rectangle();

    this.imageCanvas = imageCanvas;

    this.eventEngine = new EventEngine();

    this.eventEngine.addListener("click", this.onClick, this);
    this.eventEngine.addListener("mouseMove", this.onMouseMove, this);

    this.eventEngine.addListener("startDrag", this.onStartDrag, this);
    this.eventEngine.addListener("stopDrag", this.onStopDrag, this);

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

    var that = this;

    new Ajax.Request('/unlocks', {
      method: 'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: function(transport) {
        for (var i = 5; i < transport.responseJSON.unlocks.length; i++) {
          that.specialToolbox.addBrick(eval(transport.responseJSON.unlocks[i]));
        }          
      },
      onFailure: function(transport) {
        console.log("AjaxError on loading unlocks!")
      }
    });

    /* 
     * Fill base toolbox with base Bricks.
     */
    var baseBricks = [Brick, Ramp, Kicker, Curve, Line];
    for (var i = 0; i < baseBricks.length; i++) {

      this.baseToolbox.addBrick(baseBricks[i]);
      
    }


    this.setSize();

    this.dragElement = null;
    this.hoverElement = null;
    this.selectElement = null;
  },

  setSize: function() {

    this.width = this.staticCanvas.width = this.dynamicCanvas.width = this.specialToolbox.x + this.specialToolbox.width + 3;
    this.height = this.staticCanvas.height = this.dynamicCanvas.height = this.field.y + this.field.height + Brick.SIZE;

  },
  
  drawStatics: function() {
    
    if (this.field.renderNew || 
      this.baseToolbox.renderNew || this.specialToolbox.renderNew) {

        this.clearCanvas(this.staticCanvas);

        this.staticContext.save();

          this.staticContext.translate(.5, .5);

          this.field.drawStatics(this.staticContext);

          this.baseToolbox.draw(this.staticContext);
          this.specialToolbox.draw(this.staticContext);

          // this.staticImageData = this.staticContext.getImageData(0, 0, this.staticCanvas.width, this.staticCanvas.height);

        this.staticContext.restore();
    }
  },
  
  drawDynamics: function() {
    
    this.dynamicContext.save();
    
      // this.clearCanvas(this.dynamicCanvas);
      // this.dynamicContext.clearRects = [];
      
      this.dynamicContext.clearRectangles();
      
    
      this.dynamicContext.translate(.5, .5);
      
      this.field.drawDynamics(this.dynamicContext);
      
      if (this.hoverElement) {
        
        this.drawBoxElement(this.dynamicContext, this.hoverElement);
        
      }
      
      if (this.selectElement) {
        
        this.drawBoxElement(this.dynamicContext, this.selectElement);
        
      }
      
      if (this.field.debugMode) {
      
        this.field.draw(this.dynamicContext);
      
      }
      
      if (this.dragElement) {
        
        this.dragElement.drawGlobal(this.dynamicContext);
        
      }
    
    this.dynamicContext.restore();
  },
  
  drawBoxElement: function(context, element) {
    
    context.save();

      context.fillStyle = (element == this.hoverElement ? "#333333" : "#550000");
      context.globalAlpha = 0.3;
      
      context.fillRect(element.x, element.y, element.width, element.height);
    
    context.restore();
    
    context.addClearRectangle(new Rectangle(element.x, element.y, element.width, element.height));
  },
  
  dragBrick: function(brick) {

    brick.state = "drag";

    var point = {x: this.eventEngine.latestEvent.mouseX, y: this.eventEngine.latestEvent.mouseY};

    brick.x = point.x - Brick.BIG_SIZE / 2;
    brick.y = point.y - Brick.BIG_SIZE / 2; 

    this.dragElement = brick;

    this.eventEngine.addListener("drag", this.onDrag, this);
  },
  
  startDragBricking: function() {
    
    this.eventEngine.addListener("drag", this.onDragBricking, this);
    
  },
  
  onDragBricking: function(event) {

    if (this.field.hitTest(event.mouseX, event.mouseY)) {

      this.field.onDrag(event.mouseX - this.field.x, event.mouseY - this.field.y);

    }

  },

  onStopDrag: function(event) {

    if (this.dragElement) {
      
      if (this.field.hitTest(event.mouseX, event.mouseY)) {
      
        if (this.field.intervalID) {
        
          this.field.resetTrack();
        
        }
      
        this.field.dropBrickAt(this.dragElement, this.field.getCell(
          this.dragElement.x - this.field.x + Brick.SIZE / 2,
          this.dragElement.y - this.field.y + Brick.SIZE / 2
        ));
      }
      
      this.dragElement = null;
      
    }
    
    this.eventEngine.removeListener("drag", this.onDragBricking);
    this.eventEngine.removeListener("drag", this.onDrag);
  },

  onStartDrag: function(event) {

    this.field.resetTrack();

    if (this.field.hitTest(event.mouseX, event.mouseY)) {

      this.field.resetTrack();
      this.field.onStartDrag(event.mouseX - this.field.x, event.mouseY - this.field.y);

    } else if (this.baseToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.baseToolbox.onStartDrag(event.mouseX - this.baseToolbox.x, event.mouseY - this.baseToolbox.y);

    } else if (this.specialToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.specialToolbox.onStartDrag(event.mouseX - this.specialToolbox.x, event.mouseY - this.specialToolbox.y);

    }
  },

  onDrag: function(event) {

    if (this.dragElement) {
      
      if (event.mouseX && event.mouseY) {

        this.dragElement.x = parseInt(event.mouseX - Brick.SIZE / 2, 10);
        this.dragElement.y = parseInt(event.mouseY - Brick.SIZE / 2, 10);
        
      }
    }
  },

  initializeHTMLInterface: function($super) {
    var myScope = this;

    $('runButton').observe('click', function(event) {
      myScope.field.startBox2D();
    });

    $('clearButton').observe('click', function(event) {
      myScope.field.clearTrack(true);
    });

    $('publishButton').observe('click', function(event) {
      if ($('publishButton').hasClassName('activePublish') && myScope.field.validTrack) {

        myScope.publishTrack();
        
      } else {

        $('publishButtonWarning').style.visibility = "visible";

      }
    });
  },

  onClick: function(event) {
    
    if (this.field.hitTest(event.mouseX, event.mouseY)) {
      
      if (this.field.intervalID) {
      
        this.field.resetTrack();
      
      } else {
      
        this.field.onClick(event.mouseX - this.field.x, event.mouseY - this.field.y);
      
      }
      
    } else if (this.baseToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.baseToolbox.onClick(event.mouseX - this.baseToolbox.x, event.mouseY - this.baseToolbox.y);

    } else if (this.specialToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.specialToolbox.onClick(event.mouseX - this.specialToolbox.x, event.mouseY - this.specialToolbox.y);

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
  
  getCellBox: function(grid, mouseX, mouseY) {
    return grid.getCellBox(
      grid.getCell(
        mouseX - grid.x, 
        mouseY - grid.y
      )
    );
  },

  publishTrack: function() {
    
    if (this.field.validTrack) {

      var parameters = {};

      parameters['track[json]'] = Object.toJSON(this.field.getTrack());
      parameters['track[imagedata]'] = this.field.getTrackImage(this.imageCanvas);
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
  }
  
});