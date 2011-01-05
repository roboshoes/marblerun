var Renderer = Class.create(DisplayObject, {
  
  initialize: function($super, staticCanvas, dynamicCanvas) {
    $super();

    this.staticCanvas = staticCanvas;
    this.dynamicCanvas = dynamicCanvas;

    this.staticContext = this.staticCanvas.getContext('2d');
    this.dynamicContext = this.dynamicCanvas.getContext('2d');

    this.field = new Field();
    this.field.parent = this;
    this.field.x = 64;
    this.field.y = 50;
    this.field.setup();

    this.repeat = false;

    this.initializeHTMLInterface();
    
    this.staticImageData = null;
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
      
    this.drawStatics();
    this.drawDynamics();
    
    //this.staticContext.putImageData(this.staticImageData, 0, 0);
    //this.staticContext.drawImage(this.dynamicCanvas, 0, 0);
    
  },
  
  drawStatics: function() {
    
    if (this.field.renderNew) {
      
      this.staticContext.save();

        this.staticContext.translate(.5, .5);
        this.field.drawStatics(this.staticContext);

        //this.staticImageData = this.staticContext.getImageData(0, 0, this.staticCanvas.width, this.staticCanvas.height);

      this.staticContext.restore();
      
      this.field.renderNew = false;
    }
  },
  
  drawDynamics: function() {
    
    this.dynamicContext.save();
    
      this.dynamicContext.translate(.5, .5);
      
      this.field.drawDynamics(this.dynamicContext);
      
      
      if (this.field.debugMode) {
      
        this.field.draw(this.dynamicContext);
      
      }
    
    this.dynamicContext.restore();
  }

});