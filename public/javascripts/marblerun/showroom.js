var Showroom = Class.create(Renderer, {
  
  initialize: function($super, staticCanvas, dynamicCanvas) {
    $super(staticCanvas, dynamicCanvas);

    this.setSize();
  },

  setSize: function() {
    this.width = this.staticCanvas.width = this.dynamicCanvas.width = this.field.x + this.field.width + 3;
    this.height = this.staticCanvas.height = this.dynamicCanvas.height = 480;
  },

  parseTrack: function(data) {
    this.field.setTrack(data.json);
  },

  initializeHTMLInterface: function() {
    var myScope = this;

    $('showButton').observe('click', function(event) {
      myScope.handleRunClick(event);
    });

    $('nextButton').observe('click', function(event) {
      myScope.handleRunClick(event);
    });

    $('previousButton').observe('click', function(event) {
      myScope.handleRunClick(event);
    });

    $('repeatButton').observe('click', function(event) {
      $('repeatButton').toggleClassName('active');

      if ($('repeatButton').hasClassName('active')) {

        myScope.repeat = true;

      } else {

        myScope.repeat = false;
        
      }
    });
  }

});