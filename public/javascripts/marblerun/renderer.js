var Renderer = Class.create(DisplayObject, {
  
  initialize: function($super, staticCanvas, dynamicCanvas) {
    $super();

    this.staticCanvas = staticCanvas;
    this.dynamicCanvas = dynamicCanvas;
    
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.style.visibility = 'hidden';

    this.staticContext = this.staticCanvas.getContext('2d');
    this.dynamicContext = this.dynamicCanvas.getContext('2d');
    this.bufferContext = this.bufferCanvas.getContext('2d');

    this.field = new Field();
    this.field.parent = this;
    this.field.x = 64;
    this.field.y = Brick.SIZE;
    this.field.setup();

    this.repeat = false;

    this.initializeHTMLInterface();

    //this.staticImageData = null;
  },

  destroy: function() {
    this.stopRender();
    this.field.stopBox2D();
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

  onBallExit: function() {
    
    this.field.stopBox2D();
    
    var myScope = this;

    this.timoutID = setTimeout(function() {
      //myScope.field.resetTrack();

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

        this.staticContext.translate(.5, .5);
        this.field.drawStatics(this.staticContext);

        //this.staticImageData = this.staticContext.getImageData(0, 0, this.staticCanvas.width, this.staticCanvas.height);

      this.staticContext.restore();
    }
  },
  
  drawDynamics: function() {
    
    this.dynamicContext.save();
    
      this.dynamicContext.clearRectangles();
      
      this.dynamicContext.translate(.5, .5);
      
      this.field.drawDynamics(this.dynamicContext);
      
      
      if (this.field.debugMode) {
      
        this.field.draw(this.dynamicContext);
      
      }
    
    this.dynamicContext.restore();
  }

});