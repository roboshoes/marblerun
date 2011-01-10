var Renderer = Class.create(DisplayObject, {
  
  initialize: function($super, staticCanvas, dynamicCanvas, bufferCanvas) {
    $super();

    this.staticCanvas = staticCanvas;
    this.dynamicCanvas = dynamicCanvas;
    this.bufferCanvas = bufferCanvas;

    this.staticContext = this.staticCanvas.getContext('2d');
    this.dynamicContext = this.dynamicCanvas.getContext('2d');
    this.bufferContext = this.bufferCanvas.getContext('2d');

    this.field = null;
    this.initField();

    this.repeat = false;

    this.timeoutID = null;

    //this.staticImageData = null;
  },

  initField: function() {

    if (this.field && this.field.intervalID) {
      clearInterval(this.field.intervalID);
      this.field.intervalID = null;
    }

    this.field = new Field();
    this.field.parent = this;
    this.field.x = 64;
    this.field.y = Brick.SIZE;
    this.field.setup();

  },

  destroy: function() {
    this.stopRender();
    this.field.stopBox2D();

    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }
  },

  initializeHTMLInterface: function() {},
  
  debug: function() {
    this.field.debugMode = !this.field.debugMode;
  },

  startRender: function() {
    
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw();
    }, 25);

  },

  stopRender: function() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  },

  quit: function() {
    this.stopRender();
    this.field.stopBox2D();

    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
      this.timeoutID = null;
    }
  },

  init: function() {
    this.startRender();
  },

  onBallExit: function() {
    
    this.field.stopBox2D();
    
    var myScope = this;

    this.timeoutID = setTimeout(function() {
      myScope.timeoutID = null;

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
    
    this.drawStatics();
    this.drawDynamics();
    
    // this.staticContext.putImageData(this.staticImageData, 0, 0);
    this.dynamicContext.drawImage(this.bufferCanvas, 0, 0);
    
  },
  
  drawStatics: function() {
    
    if (this.field.renderNew) {
      
      this.staticContext.save();

        this.staticContext.translate(0.5, 0.5);
        this.field.drawStatics(this.staticContext);

        //this.staticImageData = this.staticContext.getImageData(0, 0, this.staticCanvas.width, this.staticCanvas.height);

      this.staticContext.restore();
    }
  },
  
  drawDynamics: function() {
    
    this.dynamicContext.save();
    
      this.dynamicContext.clearRectangles();
      
      this.dynamicContext.translate(0.5, 0.5);
      
      this.field.drawDynamics(this.dynamicContext);
      
      
      if (this.field.debugMode) {
      
        this.field.draw(this.dynamicContext);
      
      }
    
    this.dynamicContext.restore();
  }

});