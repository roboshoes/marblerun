EventEngine = Class.create({
  
  initialize: function() {
    
    this.listeners = [];
    this.state = {type: "unknown"};

    that = this;

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
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].type == event.type) {
        this.listeners[i].closure.call(this.listeners[i].thisArgument, event.parameter);
      }
    }
  },

  onMouseDown: function(event) {
    this.state = {type: "down", x: event.offsetX, y: event.offsetY};
  }, 

  onMouseUp: function(event) {

    if (this.state.type != "drag" && this.state.type != "down") {
      this.state.type = "up";
      return;
    }

    var type;

    if (this.state.type == "drag") type = "stopDrag";
    else if (this.state.type == "down") type = "click";

    var myEvent = new Event(type);
    myEvent.parameter = event;

    this.state.type = "up";

    this.dispatchEvent(myEvent);
  },

  onMouseMove: function(event) {

    if (this.state.type != "down" && this.state.type != "drag") return;

    var type;

    if (this.state.type == "down") type = "startDrag";
    else if (this.state.type == "drag") type = "drag";

    this.state.type = "drag";

    var myEvent = new Event(type);
    myEvent.parameter = event;

    this.dispatchEvent(myEvent);

  }

});