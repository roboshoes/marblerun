var Editor = Class.create(DisplayObject, {

  initialize: function($super, mainCanvas, bufferCanvas, imageCanvas) {
    $super();

    this.mainCanvas = mainCanvas;
    this.bufferCanvas = bufferCanvas;
    this.imageCanvas = imageCanvas;
    
    this.mainContext = this.mainCanvas.getContext('2d');
    this.bufferContext = this.bufferCanvas.getContext('2d');

    this.eventEngine = new EventEngine();
    this.eventEngine.addListener("startDrag", this.onStartDrag, this);
    this.eventEngine.addListener("stopDrag", this.onStopDrag, this);
    this.eventEngine.addListener("click", this.onClick, this);
    //this.eventEngine.addListener("mouseDown", this.onMouseDown, this);

    this.field = new Field();
    this.field.parent = this;
    this.field.x = 64;
    this.field.y = 50;
    this.field.setup();

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

    this.dragElements;

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
    this.initializeHTMLInterface();
    
    this.renderAll = true;

  },

  setSize: function() {

    this.width = this.mainCanvas.width = this.bufferCanvas.width = this.specialToolbox.x + this.specialToolbox.width + Brick.SIZE;
    this.height = this.mainCanvas.height = this.bufferCanvas.height = 580;

  },

  startRender: function() {
    
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw();
    }, 1000 / 30);

  },

  draw: function() {
    
    this.clearCanvas(this.mainCanvas);

    this.bufferContext.save();

      this.bufferContext.translate(.5, .5);
      
      if (this.renderAll) {
        
        this.clearCanvas(this.bufferCanvas);
        
      }

      if (this.baseToolbox.renderNew || this.renderAll) {
        
        this.baseToolbox.draw(this.bufferContext);
        this.baseToolbox.renderNew = false;
        
      }
      
      if (this.specialToolbox.renderNew || this.renderAll) {
        
        this.specialToolbox.draw(this.bufferContext);
        this.specialToolbox.renderNew = false;
        
      }
      
      if (this.field.renderNew || this.field.intervalID || this.renderAll) {
        
        this.field.draw(this.bufferContext);
        this.field.renderNew = false;
      }

      this.renderAll = false;

      if (this.dragElement) {
        this.dragElement.drawGlobal(this.bufferContext);
        this.renderAll = true;
      }

    this.bufferContext.restore();

    this.mainContext.drawImage(this.bufferCanvas, 0, 0);
  },
  
  clearCanvas: function(canvas) {
    var context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
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
    
    this.field.renderNew = true;

    this.dragElement = null;
    this.eventEngine.removeListener("drag", this.onDrag);
  },

  onStartDrag: function(event) {

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

  initializeHTMLInterface: function() {
    var myScope = this;

    $('runButton').observe('click', function(event) {
      myScope.handleRunClick(event);
    });

    $('clearButton').observe('click', function(event) {
      myScope.field.clearTrack(true);
      myScope.field.renderNew = true;
    });

    $('debugButton').observe('click', function(event) {
      myScope.field.debugMode = !myScope.field.debugMode;
    });

    $('publishButton').observe('click', function(event) {
      myScope.publishTrack();
    });
  },

  handleRunClick: function(event) {
    if (this.field.intervalID) {
      this.field.resetTrack();
    } else {
      this.field.startBox2D();
    }
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
  
  onBallExit: function() {
    
    this.field.stopBox2D();
    this.field.renderNew = true;
    
    var myScope = this;
    
    // this.timoutID = setTimeout(function() {
    //   myScope.field.resetTrack();
    //   myScope.field.renderNew = true;
    // }, 1000);
    
  }, 

  publishTrack: function() {
    
    // TODO: refactor

    var length = 1.42;
    var parameters = {};

    parameters['track[json]'] = Object.toJSON(this.field.getTrack());
    parameters['track[imagedata]'] = this.field.getTrackImage(this.imageCanvas);;
    parameters['track[username]'] = $('userName').value;
    parameters['track[trackname]'] = $('trackName').value;
    parameters['track[length]'] = length;
    
    new Ajax.Request('/tracks', {
      method: 'post',
      parameters: parameters,
      requestHeaders: {Accept: 'application/json'},
      onSuccess: function(transport) {
        // track was successfully saved
      },
      onFailure: function(transport) {
        // track couldn't be saved
      }
    });
  }
  
});