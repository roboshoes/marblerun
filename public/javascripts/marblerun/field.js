var Field = Class.create(Grid, {
  
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
  },

  onClick: function(mouseX, mouseY) {
    
    var cell = this.getCell(mouseX, mouseY)
    var brick = this.getBrickAt(cell);

    if (brick) {
      
      brick.rotation += 90;

      return;
    }

    if (this.getBrickAt(cell) || !this.parent.toolbox.selectedBrick) return;
      
    var brick = new this.parent.toolbox.selectedBrick.class();

    this.dropBrickAtCell(brick, cell);

  }

});


