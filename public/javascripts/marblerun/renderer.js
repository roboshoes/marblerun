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

    this.initializeHTMLInterface();
    
    this.staticImageData = null;

  },

  destroy: function() {
    this.stopRender();
    this.field.stopBox2D();
  },

  initializeHTMLInterface: function() {},

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
    
    // this.timoutID = setTimeout(function() {
    //   myScope.field.resetTrack();
    //   myScope.field.renderNew = true;
    // }, 1000);
    
  }, 

  clearCanvas: function(canvas) {
    var context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    context.beginPath();
  },

  draw: function() {
    
    this.drawStatics();
    this.drawDynamics();
    
    this.mainContext.putImageData(this.staticImageData, 0, 0);
    this.mainContext.drawImage(this.bufferCanvas, 0, 0);
    
  },
  
  drawStatics: function() {
    
    if (this.field.renderNew) {
    
      this.field.renderNew = false;
      
      this.mainContext.save();

        this.mainContext.translate(.5, .5);
        this.field.drawStatics(this.mainContext);

        this.staticImageData = this.mainContext.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height);

      this.mainContext.restore();
      
    }
  },
  
  drawDynamics: function() {
    
    this.bufferContext.save();
    
      this.bufferContext.translate(.5, .5);
      
      this.field.drawDynamics(this.bufferContext);
    
    this.bufferContext.restore();
  }

});