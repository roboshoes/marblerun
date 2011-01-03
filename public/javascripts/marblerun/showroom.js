var Showroom = Class.create(Renderer, {
  
  initialize: function($super, mainCanvas, bufferCanvas) {
    $super(mainCanvas, bufferCanvas);

    this.setSize();
  },

  setSize: function() {
    this.width = this.mainCanvas.width = this.bufferCanvas.width = this.field.x + this.field.width + 3;
    this.height = this.mainCanvas.height = this.bufferCanvas.height = 580;
  },

  parseTrack: function(json) {

    var data = json.evalJSON();

    this.field.setTrack(data.json);
    this.field.startBox2D();
  }

});