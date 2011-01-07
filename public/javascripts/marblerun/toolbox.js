var Toolbox = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.rows = 15;
    this.cols = 3;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

  },

  addBrick: function(klass) {
    currentBrick = new klass();

    currentBrick.cell = {row: this.bricks.length * 2 + 1, col: 1};
    currentBrick.parent = this;

    this.dropBrickAt(currentBrick, currentBrick.cell);

  },
  
  onClick: function(mouseX, mouseY) {
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell);

    if (brick && brick.isDraggable && this.parent.selectElement && this.parent.selectElement.brick == brick) {

      brick.rotate(Math.PI / 2);
      this.renderNew = true;

    }

    this.select(cell);
  },

  onStartDrag: function(mouseX, mouseY) {
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell);
    
    if (brick && brick.isDraggable) {

      var dragBrick = new (eval(brick.type))()
          dragBrick.rotation = brick.rotation;
          
      this.parent.dragBrick(dragBrick);
      
    }
    
    this.select(cell);
  },

  select: function(cell) {
    var brick = this.getBrickAt(cell),
        box = null;

    box = this.getCellBox(cell);
    box.brick = brick;

    this.parent.selectElement = box;
  }

});
