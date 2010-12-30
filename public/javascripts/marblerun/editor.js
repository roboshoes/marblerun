var Editor = Class.create(DisplayObject, {

  initialize: function($super, canvas) {
    $super();

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.eventEngine = new EventEngine();
    this.eventEngine.addListener("startDrag", this.onStartDrag, this);
    this.eventEngine.addListener("stopDrag", this.onStopDrag, this);
    this.eventEngine.addListener("click", this.onClick, this);

    this.field = new Field();
    this.field.parent = this;

    this.toolbox = new Toolbox();
    this.toolbox.parent = this;
    this.toolbox.x = 50 + this.field.width + 50;

    this.dragElements;

    var specialBricks = [Kicker, Kicker];

    for (var i = 0; i < specialBricks.length; i++) {

      if (specialBricks[i].isAvailable()) {

        this.toolbox.addBrick(specialBricks[i]);

      }

    }

    this.setSize();
    this.initializeHTMLInterface();

  },

  setSize: function() {

    this.width = this.canvas.width = this.field.width + this.toolbox.width + 150;
    this.height = this.canvas.height = 580;

  },

  startRender: function() {
    
    myScope = this;

    this.intervalID = setInterval(function() {
      myScope.draw();
    }, 1000 / 60);

  },

  draw: function() {

    this.setSize();

    this.context.translate(.5, .5);

    this.context.save();

      this.field.draw(this.context);
      this.toolbox.draw(this.context);

    this.context.restore();

    if (this.dragElement) this.dragElement.drawGlobal(this.context);

  }, 

  dragBrick: function(brick) {

    brick.state = "drag";

    var point = this.parentToLocal({x: this.eventEngine.latestEvent.mouseX, y: this.eventEngine.latestEvent.mouseY});

    brick.x = point.x - Brick.SIZE;
    brick.y = point.y - Brick.SIZE; 

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
      return;

    } else if (this.toolbox.hitTest(event.mouseX, event.mouseY)) {
      
      this.toolbox.onStartDrag(event.mouseX - this.toolbox.x, event.mouseY - this.toolbox.y);

    }
  },

  onDrag: function(event) {

    if (!this.dragElement) return;

    var point = this.parentToLocal({x: event.mouseX, y: event.mouseY});

    this.dragElement.x = parseInt(event.mouseX - Brick.SIZE / 2, 10);
    this.dragElement.y = parseInt(event.mouseY - Brick.SIZE / 2, 10);

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
  },

  onClick: function(event) {

    var point = this.parentToLocal({x: event.mouseX, y: event.mouseY});

    if (this.toolbox.hitTest(event.mouseX, event.mouseY)) {
      
      this.toolbox.onClick(event.mouseX - this.toolbox.x, event.mouseY - this.toolbox.y);

    } else if (this.field.hitTest(event.mouseX, event.mouseY)) {
      
      this.field.onClick(event.mouseX - this.field.x, event.mouseY - this.field.y);
      
    }
  }
  
});