EventEngine = Class.create({
  
  initialize: function() {
    
    // startDrag, stopDrag, click

    this.listeners = [];
    this.state = {type: "unknown"};
    this.latestEvent;
    this.clickTimeout;

    this.clickTime = 500; // in milliseconds;

    var that = this;

    document.onmousedown = function(event) {that.onMouseDown.call(that, event);};
    document.onmouseup = function(event) {that.onMouseUp.call(that, event);};
    document.onmousemove = function(event) {that.onMouseMove.call(that, event);};

  },

  addListener: function(type, closure, thisArgument) {
    
    this.listeners.push({type: type, closure: closure, thisArgument: thisArgument});

  }, 

  removeListener: function(type, closure) {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].type == type && this.listeners[i].type == closure) {
        this.listeners.splice(i, 1);
      }
    }
  },

  dispatchEvent: function(event) {
    this.latestEvent = event;
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].type == event.type) {
        this.listeners[i].closure.call(this.listeners[i].thisArgument, event);
      }
    }
  },

  onMouseDown: function(event) {
    var coordinates = getRelativeCoordinates(event, $("editor"));

    var myEvent = new Event("mouseDown");
        myEvent.parameter = event;
        myEvent.mouseX = coordinates.x;
        myEvent.mouseY = coordinates.y;

    this.dispatchEvent(myEvent);

    this.state = {type: "down", x: coordinates.x, y: coordinates.y};

    var myScope = this;
    
    this.clickTimeout = setTimeout(
      
      function(coordinates, event) {
        myScope.onClickTimeout(coordinates, event);
      },
       
      this.clickTime, coordinates, event
    );
    
    this.dispatchEvent(myEvent);
  }, 

  onMouseUp: function(event) {

    var type;

    if (this.state.type == "drag") type = "stopDrag";
    else if (this.state.type == "down") type = "click";

    var coordinates = getRelativeCoordinates(event, $("editor"));

    var myEvent = new Event(type);
        myEvent.parameter = event;
        myEvent.mouseX = coordinates.x;
        myEvent.mouseY = coordinates.y;

    this.state.type = "up";

    this.dispatchEvent(myEvent);
  },

  onMouseMove: function(event) {

    if (this.state.type == "up") return;

    var coordinates = getRelativeCoordinates(event, $("editor"));

    if (this.state.type == "down") {
      var distance = function(oldX, oldY, newX, newY) {
        
        var x = newX - oldX;
        var y = newY - oldY;

        return Math.sqrt(x * x + y * y);
      }(this.state.x, this.state.y, coordinates.x, coordinates.y);

      if (distance > 5) {
        
        this.onClickTimeout({x: this.state.x, y: this.state.y});

      }
    }

    var myEvent = new Event("drag");
        myEvent.parameter = event;
        myEvent.mouseX = coordinates.x;
        myEvent.mouseY = coordinates.y;

    this.dispatchEvent(myEvent);

  },

  onClickTimeout: function(coordinates, event) {

    if (this.state.type != "down") return;

    this.clickTimeout = null;

    this.state.type = "drag";

    var myEvent = new Event("startDrag");
        myEvent.parameter = event;
        myEvent.mouseX = coordinates.x;
        myEvent.mouseY = coordinates.y;

    this.dispatchEvent(myEvent);
  }

});