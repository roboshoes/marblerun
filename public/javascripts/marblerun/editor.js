Editor = Class.create({

  initialize: function(canvas) {

    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.setSize();

    this.field = new Field();
    this.field.parent = this;

    this.toolbox = new Toolbox();
    this.toolbox.parent = this;

    this.dragElements;

    var specialBricks = [Kicker, Kicker];

    for (var i = 0; i < specialBricks.length; i++) {

      if (specialBricks[i].isAvailable()) {

        this.toolbox.addBrick(specialBricks[i]);

      }

    }

    this.initializeHTMLInterface();

  },

  setSize: function() {

    this.canvas.width = window.innerWidth - document.getElementById("sidebar").clientWidth - 30;
    this.canvas.height = window.innerHeight;

  },

  startRender: function() {
    
    myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw.call(myScope);
    }, 1000 / 60);

  },

  draw: function() {

    this.setSize();

    this.context.translate(.5, .5);

    this.context.save();

      this.field.draw(this.context);

      this.toolbox.x = 50 + this.field.width + 50;
      this.toolbox.draw(this.context);

    this.context.restore();

    if (this.dragElement) this.dragElement.drawGlobal(this.context);

  }, 

  dragBrick: function(brick) {
    this.dragElement = brick;

    this.dragElement.x = parseInt(event.offsetX - Brick.SIZE / 2, 10);
    this.dragElement.y = parseInt(event.offsetY - Brick.SIZE / 2, 10);

    var that = this;
    document.onmousemove = function(event) {that.onMouseMove(event)};
  },

  onMouseUp: function(event) {
    var x = event.offsetX;
    var y = event.offsetY;

    if (this.dragElement) {
      
      document.onmousemove = null;
      this.field.dropBrick(this.dragElement);
      this.dragElement = null;

    }
  },

  onMouseDown: function(event) {
    var x = event.offsetX;
    var y = event.offsetY;

    if (this.field.hitTest(x, y)) {

      this.field.onMouseDown(x - this.field.x, y - this.field.y);
      return;

    } else if (this.toolbox.hitTest(x, y)) {
      
      this.toolbox.onMouseDown(x - this.toolbox.x, y - this.toolbox.y);

    }
  },

  onMouseMove: function(event) {
    
    if (!this.dragElement) return;

    this.dragElement.x = parseInt(event.offsetX - Brick.SIZE / 2, 10);
    this.dragElement.y = parseInt(event.offsetY - Brick.SIZE / 2, 10);

  },

  initializeHTMLInterface: function() {
    var myScope = this;

    $('runButton').observe('click', function(event) {
      myScope.handleRunClick(event);
    });
  },

  handleRunClick: function(event) {
    if (this.field.intervalID) {
      this.field.stopBox2D();
    } else {
      this.field.startBox2D();
    }
  }
  
});