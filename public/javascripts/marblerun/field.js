Field = Class.create(Grid, {
  
  initialize: function() {
    this.x = 50;
    this.y = 100;

    this.rows = 15;
    this.cols = 15;

    this.width = Brick.SIZE * this.cols;
    this.height = Brick.SIZE * this.rows;

    this.bricks = [];
  },

  onStartDrag: function(mouseX, mouseY) {
    var brick = this.removeBrickAt(this.getCell(mouseX, mouseY));

    if (brick) {
      this.parent.dragBrick(brick);
    }
  }

});


