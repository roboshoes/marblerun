var Editor = Class.create(DisplayObject, {

  initialize: function($super, canvas, imageCanvas) {
    $super();

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.imageCanvas = imageCanvas;

    this.eventEngine = new EventEngine();
    this.eventEngine.addListener("startDrag", this.onStartDrag, this);
    this.eventEngine.addListener("stopDrag", this.onStopDrag, this);
    this.eventEngine.addListener("click", this.onClick, this);

    this.field = new Field();
    this.field.parent = this;
    this.field.setup();

    this.baseToolbox = new Toolbox();
    this.baseToolbox.parent = this;
    this.baseToolbox.x = 50 + this.field.width + 3 * Brick.SIZE;
    this.baseToolbox.y = 50;

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
    var specialBricks = [Ball, Exit, Spring, Boost];
    for (var i = 0; i < specialBricks.length; i++) {
      if (specialBricks[i].isAvailable()) {

        this.specialToolbox.addBrick(specialBricks[i]);

      }
    }

    this.setSize();
    this.initializeHTMLInterface();

  },

  setSize: function() {

    this.width = this.canvas.width = this.specialToolbox.x + this.specialToolbox.width + Brick.SIZE;
    this.height = this.canvas.height = 580;

  },

  startRender: function() {
    
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw();
    }, 1000 / 60);

  },

  draw: function() {

    this.setSize();

    this.context.translate(.5, .5);

    this.context.save();

      
      this.baseToolbox.draw(this.context);
      this.specialToolbox.draw(this.context);
      this.field.draw(this.context);

    this.context.restore();

    if (this.dragElement) this.dragElement.drawGlobal(this.context);

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
      
      this.field.dropBrick(this.dragElement);
      
    }

    this.dragElement = null;
    this.eventEngine.removeListener("drag", this.onDrag);
  },

  onStartDrag: function(event) {

    var point = this.parentToLocal({x: event.mouseX, y: event.mouseY});

    if (this.field.hitTest(event.mouseX, event.mouseY)) {

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

  },

  initializeHTMLInterface: function() {
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

  handleRunClick: function(event) {
    if (this.field.intervalID) {
      this.field.resetTrack();
    } else {
      this.field.startBox2D();
    }
  },

  onClick: function(event) {

    var point = this.parentToLocal({x: event.mouseX, y: event.mouseY});

    if (this.baseToolbox.hitTest(event.mouseX, event.mouseY)) {
      
      this.baseToolbox.onClick(event.mouseX - this.baseToolbox.x, event.mouseY - this.baseToolbox.y);

    } else if (this.specialToolbox.hitTest(event.mouseX, event.mouseY)) {

      this.specialToolbox.onClick(event.mouseX - this.specialToolbox.x, event.mouseY - this.specialToolbox.y);

    }else if (this.field.hitTest(event.mouseX, event.mouseY)) {
      
      this.field.onClick(event.mouseX - this.field.x, event.mouseY - this.field.y);
      
    }
  },
  
  onBallExit: function() {
    
    this.field.stopBox2D();
    
  }, 

  publishTrack: function() {
    
    // TODO: refactor
    var json = Object.toJSON(this.field.getTrack());
    var imagedata = this.field.getTrackImage(this.imageCanvas);
    var username = "Dummy User";
    var trackname = "Dummy Name";
    var length = 1.42;
    var parameters = {};

    parameters['track[json]'] = json;
    parameters['track[username]'] = username;
    parameters['track[trackname]'] = trackname;
    parameters['track[length]'] = length;
    parameters['track[imagedata]'] = imagedata;

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