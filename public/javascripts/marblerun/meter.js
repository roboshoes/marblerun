var Meter = Class.create(DisplayObject, {
  
  initialize: function($super, canvas) {
    $super();

    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this.setSize();
  },

  setSize: function() {
    
  },

  draw: function() {
    
  }

});