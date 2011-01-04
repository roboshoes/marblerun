var Meter = Class.create(DisplayObject, {
  
  initialize: function($super, canvas) {
    $super();

    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  },

  setSize: function() {
    this.canvas.width = this.canvas.height = 185;
  },

  draw: function() {

    this.setSize();

    this.context.fillStyle = Pattern.meterBackground;
    this.context.fillRect(0, 0, 185, 185);

    this.context.fillStyle = Pattern.meterForeground;
    this.context.fillRect(0, 0, 185, 185);

  }

});