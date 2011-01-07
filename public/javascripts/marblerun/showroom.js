var Showroom = Class.create(Renderer, {
  
  initialize: function($super, staticCanvas, dynamicCanvas, bufferCanvas) {
    $super(staticCanvas, dynamicCanvas, bufferCanvas);

    this.setSize();
  },

  setSize: function() {
    
    var width = this.field.x + this.field.width + 3,
        height = this.field.y + this.field.height + 3;

    this.width = this.staticCanvas.width = this.dynamicCanvas.width = this.bufferCanvas.width = width;
    this.height = this.staticCanvas.height = this.dynamicCanvas.height = this.bufferCanvas.height = height;
    
  },

  parseTrack: function(data) {
    this.field.setTrack(data.json);
  },

  initializeHTMLInterface: function() {
    var myScope = this;

    $('showButton').observe('click', function(event) {
      myScope.field.startBox2D();
    });

    $('nextButton').observe('click', function(event) {
      
    });

    $('previousButton').observe('click', function(event) {
      
    });

    $('repeatButton').observe('click', function(event) {
      $('repeatButton').toggleClassName('active');

      myScope.repeat = $('repeatButton').hasClassName('active');
    });

    $('repeatButton').removeClassName('active');
  }

});