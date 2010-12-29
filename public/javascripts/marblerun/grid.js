Grid = Class.create(DisplayObject, {

  initialize: function() {
    this.rows = 0;
    this.cols = 0;

    this.bricks = [];
  },

  drawGrid: function (context) {
    
    context.strokeStyle = "#000000";
    context.lineWidth = .5;

    for (var i = 1; i < this.rows; i++) {
      
      context.beginPath();
      context.dashedLine(0, i * Brick.SIZE, this.cols * Brick.SIZE, i * Brick.SIZE, 3);
      context.closePath();
      
      context.stroke();

    }

    for (var i = 1; i < this.cols; i++) {
      
      context.beginPath();
      context.dashedLine(i * Brick.SIZE, 0,  i * Brick.SIZE, this.rows * Brick.SIZE, 3);
      context.closePath();
      
      context.stroke();

    }

    // FIXME: last line gets drawn two times
    context.beginPath();
    context.closePath();

  },

  draw: function(context) {

    context.save();

      context.translate(this.x, this.y);

      context.strokeStyle = "#000000";
      context.lineWidth = 1;
      context.fillStyle = "#FBE500";

      context.fillRect(0, 0, this.width, this.height);
      context.strokeRect(0, 0, this.width, this.height);
      context.stroke();

      this.drawGrid(context);

      for (var i = 0; i < this.bricks.length; i++) {
        context.save();

          context.translate(this.bricks[i].cell.col * Brick.SIZE, this.bricks[i].cell.row * Brick.SIZE);
          this.bricks[i].draw(context);

        context.restore();
      }

    context.restore();

  },

  getCell: function(x, y) {
    if (x < 0 || y < 0 || x > this.width || y > this.height) return null;
    return {row: parseInt(y / Brick.SIZE, 10), col: parseInt(x / Brick.SIZE, 10)};
  },

  getBrickAt: function(cell) {
    if (!cell) return null;

    for (var i = 0; i < this.bricks.length; i++) {
      if (this.bricks[i].cell.row == cell.row && this.bricks[i].cell.col == cell.col) {
        return this.bricks[i];
      }
    }

    return null;
  },

  removeBrickAt: function(cell) {
    if (!cell) return null;

    for (var i = 0; i < this.bricks.length; i++) {
      if (this.bricks[i].cell.row == cell.row && this.bricks[i].cell.col == cell.col) {
        return this.bricks.splice(i, 1)[0];
      }
    }

    return null;
  },

  dropBrick: function(brick) {
    
    var brickX = parseInt(brick.x - this.x + Brick.SIZE / 2, 10);
    var brickY = parseInt(brick.y - this.y + Brick.SIZE / 2, 10);

    brick.cell = this.getCell(brickX, brickY);
    brick.parent = this;

    if (!brick.cell) {
      
      console.log("You fucking dumbfuck missed the huge fucking grid, shitwad!");
      return false;

    }

    this.removeBrickAt(brick.cell);

    this.bricks.push(brick);

    return true;
  },

  dropBrickAtCell: function(brick, cell) {
    brick.cell = cell;
    brick.parent = this;

    this.removeBrickAt(cell);
    this.bricks.push(brick);
  }

});