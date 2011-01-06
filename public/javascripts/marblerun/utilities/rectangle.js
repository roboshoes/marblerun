var Rectangle = Class.create(DisplayObject, {
  
  initialize: function($super) {
    $super();
    
    this.minX = 0;
    this.minY = 0;
    
    this.maxX = 0;
    this.maxY = 0;
    
    this.clear();
  },
  
  setSizes: function() {
    
    this.x = this.minX;
    this.y = this.minY;
    
    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;
    
    this.clear();
  },
  
  clear: function() {
    
    this.isEmpty = true;
    
  },
  
  addPoint: function(x, y) {
    
    if (this.isEmpty) {
      
      this.minX = this.maxX = x;
      this.minY = this.maxY = y;
      
    } else {
      
      this.minX = this.minX < x ? this.minX : x;
      this.maxX = this.maxX > x ? this.maxX : x;
      this.minY = this.minY < y ? this.minY : y;
      this.maxY = this.maxY > y ? this.maxY : y;
      
    }
    
    this.isEmpty = false;
  }
  
});