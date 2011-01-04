var Toolbox = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.rows = 15;
    this.cols = 3;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.otherBox;

  },

  addBrick: function(klass) {
    currentBrick = new klass();

    currentBrick.cell = {row: this.bricks.length * 2 + 1, col: 1};
    currentBrick.parent = this;
    currentBrick.state = "toolbox";

    this.dropBrickAt(currentBrick, {row: this.bricks.length * 2 + 1, col: 1});

  },
  
  onMouseDown: function(mouseX, mouseY) {
    var cell = this.getCell(mouseX, mouseY),
        brick = this.getBrickAt(cell),
        box = null;
    
    if (cell) {
      
      box = this.getCellBox(cell);
      box.brick = brick;
      
      if (brick && this.parent.selectElement && this.parent.selectElement.brick == brick) {
        brick.rotate(Math.PI / 2);
        this.renderNew = true;
      }
    }
    
    this.parent.selectElement = box;
  },

  onStartDrag: function(mouseX, mouseY) {
    var brick = this.getBrickAt(this.getCell(mouseX, mouseY));
    
    if (brick && brick.isDragable) {

      this.parent.dragBrick(new (eval(brick.type))());
      
    }
  }

});
