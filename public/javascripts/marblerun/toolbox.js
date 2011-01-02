var Toolbox = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.rows = 15;
    this.cols = 3;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.otherBox;

    this.selectedBrick;

  },

  addBrick: function(klass) {
    currentBrick = new klass();

    currentBrick.cell = {row: this.bricks.length * 2 + 1, col: 1};
    currentBrick.parent = this;
    currentBrick.state = "toolbox";

    this.dropBrickAtCell(currentBrick, {row: this.bricks.length * 2 + 1, col: 1});

  },

  onStartDrag: function(mouseX, mouseY) {
    var brick = this.getBrickAt(this.getCell(mouseX, mouseY));
    
    if (brick && brick.isDragable) {

      this.parent.dragBrick(new (eval(brick.type))());
      this.onClick(mouseX, mouseY);
      
    }

  },

  onClick: function(mouseX, mouseY) {
    var brick = this.getBrickAt(this.getCell(mouseX, mouseY));
    if (!brick) return;

    if (this.selectedBrick) {
      this.selectedBrick.selected = false;
    }

    brick.selected = true;

    if (this.otherBox.selectedBrick) {
      this.otherBox.selectedBrick.selected = false;
      this.otherBox.selectedBrick = null;
    }

    this.selectedBrick = brick;

  }

});
