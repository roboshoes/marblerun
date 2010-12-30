var Toolbox = Class.create(Grid, {
  
  initialize: function($super) {
    $super();

    this.x = 0;
    this.y = 100;

    this.rows = 19;
    this.cols = 3;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.bricks = [new Brick(), new Ramp(), new Kicker(), new Curve(), new Line()];

    for (var i = 0; i < this.bricks.length; i++) {
      this.bricks[i].parent = this;
      this.bricks[i].type = "toolbox";
      this.bricks[i].cell = {row: i * 2 + 2, col: 1};  
    }

    this.selectedBrick;

  },

  addBrick: function(class) {
    currentBrick = new class();

    currentBrick.cell = {row: (this.bricks.length - 5) * 2 + 13, col: 1};
    currentBrick.parent = this;
    currentBrick.type = "toolbox";

    this.bricks.push(currentBrick);

  },

  onStartDrag: function(mouseX, mouseY) {
    var brick = this.getBrickAt(this.getCell(mouseX, mouseY));
    
    if (brick && brick.isDragable) {

      this.parent.dragBrick(new brick.class());
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
    this.selectedBrick = brick;

  }

});
