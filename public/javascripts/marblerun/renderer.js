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

  },

  initializeHTMLInterface: function() {},

  startRender: function() {
    
    var myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw();
    }, 1000 / 60);

  },

  onBallExit: function() {
    
    this.field.stopBox2D();
    this.field.renderNew = true;
    
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