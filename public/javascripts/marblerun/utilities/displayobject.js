var DisplayObject = Class.create({
  
  initialize: function() {
    this.x;
    this.y;

    this.width;
    this.height;

    this.parent;
  },

  hitTest: function(x, y) {
    if (x < this.x || y < this.y  || x > this.x + this.width || y > this.y + this.height) 
      return false;
    else 
      return true;
  }, 

  parentToLocal: function(point) {
    
    return {x: point.x - this.x, y: point.y - this.y};

  }

});