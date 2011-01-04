var Renderer = Class.create(DisplayObject, {
  
  initialize: function($super, mainCanvas, bufferCanvas) {
    $super();

    this.mainCanvas = mainCanvas;
    this.bufferCanvas = bufferCanvas;

    this.mainContext = this.mainCanvas.getContext('2d');
    this.bufferContext = this.bufferCanvas.getContext('2d');

    this.field = new Field();
    this.field.parent = this;
    this.field.x = 64;
    this.field.y = 50;
    this.field.setup();

    this.repeat = false;

    this.initializeHTMLInterface();

  },

  destroy: function() {
    this.stopRender();
    this.field.stopBox2D();
  },

  initializeHTMLInterface: function() {},

  handleRunClick: function(event) {
    if (this.field.intervalID) {
      this.field.resetTrack();
    } else {
      this.field.startBox2D();
    }
  },

  startRender: function() {
    
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw();
    }, 1000 / 60);

  },

  stopRender: function() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  },

  onBallExit: function() {
    
    this.field.stopBox2D();
    this.field.renderNew = true;
    
    var myScope = this;

    this.timoutID = setTimeout(function() {
      myScope.field.resetTrack();

      if (myScope.repeat) {
        myScope.field.startBox2D();
      }

    }, 10);
    
  }, 

  clearCanvas: function(canvas) {
    var context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
  },

  draw: function() {
    
    this.clearCanvas(this.mainCanvas);

    this.bufferContext.save();

      this.bufferContext.translate(.5, .5);
 
      if (this.field.renderNew || this.field.intervalID) {
        
        this.field.draw(this.bufferContext);
        this.field.renderNew = false;

      }

    this.bufferContext.restore();

    this.mainContext.drawImage(this.bufferCanvas, 0, 0);
  }

});