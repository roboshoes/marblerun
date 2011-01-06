var basePath = "http://localhost:3000";
var currentMode = "build";
var overviewSort = "alphabetic";

var canvasContent, meter;
var editorPosition = $('editor').cumulativeOffset($('editor'));

var mainCanvas = document.getElementById("mainCanvas"),
    bufferCanvas = document.getElementById("bufferCanvas"),
    imageCanvas = document.getElementById("imageCanvas"),
    meterCanvas = document.getElementById("brickMeterCanvas");

var toggleElements = [
  "editorControlsTop", 
  "editorControlsBottom",
  "editorToolboxTop",
  "editorToolboxBottom",
  "showroomControlsTop",
  "showroomControlsBottom",
  "showroomDetail"
];

mainCanvas.onselectstart = function() {return false};
bufferCanvas.onselectstart = function() {return false};
meterCanvas.onselectstart = function() {return false};

imageCanvas.style.visibility = 'hidden';

var initializeHTMLInterface = function() {

  var myScope = this;

  $('modeSwitch').observe('click', function(event) {

    if (myScope.currentMode == "view") {

      myScope.setSwitchMode("build");
      loadContent("/tracks/new");

    } else {
      
      myScope.setSwitchMode("view");

    }
  });

}();

var setSwitchMode = function(mode) {
  if (mode == currentMode){
    return;
  }

  currentMode = mode;
  $('modeSwitch').toggleClassName("view");
}

var parseResponse = function(jsonContent, setPath) {

  var content = jsonContent.responseJSON;
  var visibleList = [];
  
  if (canvasContent) {
    canvasContent.destroy();
    canvasContent = null;
  }

  if (content.mode == "build") {

    if (setPath) {
      setURL("/tracks/new");
    }

    canvasContent = new Editor(mainCanvas, bufferCanvas, imageCanvas);
    canvasContent.x = editorPosition.left;
    canvasContent.y = editorPosition.top;

    canvasContent.startRender();

    visibleList = ["editorControlsTop", "editorControlsBottom", "editorToolboxTop", "editorToolboxBottom"];
    $('editor').setStyle({height: "560px"});
    setSwitchMode("build");

  } else if (content.mode == "show") {

    if (setPath) {
      setURL("/tracks/" + content.track.id);
    }

    canvasContent = new Showroom(mainCanvas, bufferCanvas);
    canvasContent.x = editorPosition.left;
    canvasContent.y = editorPosition.top;

    canvasContent.parseTrack(content.track);

    canvasContent.startRender();

    var trackDate = new Date(0);
    
    trackDate.setFullYear(content.track.created_at.substr(0, 4));
    trackDate.setMonth(parseInt(content.track.created_at.substr(5, 2), 10) - 1);
    trackDate.setDate(content.track.created_at.substr(9, 2));
    trackDate.setHours(content.track.created_at.substr(11, 2));
    trackDate.setMinutes(content.track.created_at.substr(14, 2));

    $('tableTrack').update(content.track.trackname.toUpperCase());
    $('tableBuilder').update(content.track.username.toUpperCase());
    $('tableLength').update((parseInt(content.track.length * 10, 10)) / 10 + " METER");
    $('tableDate').update(trackDate.getDate() + ". " + trackDate.getMonthName().toUpperCase() + " " + trackDate.getFullYear());
    $('tableTime').update(trackDate.getFormatHours() + ":" + trackDate.getFormatMinutes() + " " + trackDate.getDayTime());
    $('tableLikes').update(content.track.likes);

    visibleList = ["showroomControlsTop", "showroomControlsBottom", "showroomDetail"];
    $('editor').setStyle({height: "520px"});
    setSwitchMode("view");

  }

  /* --- set visibilty of html elemnts --- */
  for (var i = 0; i < toggleElements.length; i++) {

    if (visibleList.indexOf(toggleElements[i]) > -1) {

      $(toggleElements[i]).setStyle({visibility: "visible"});
      
    } else {

      $(toggleElements[i]).setStyle({visibility: "hidden"});

    }
  }

};

var loadContent = function(path) {
  
  setURL(path);

  new Ajax.Request(path, {
    method: 'get',
    requestHeaders: {Accept: 'application/json'},
    onSuccess: parseResponse,
    onFailure: function() {
      console.error("JSON Content Request failed! Refactor Me!");
    }
  });

};

var setURL = function(path) {

  var pathArray = path.split("/");
  var site = pathArray.pop();
  var splitPath = pathArray.join("/") + "/";

  if (history && history.pushState) {

    history.pushState({}, splitPath, site);

  } else {

    //window.location = basePath + path;

  } 
}

window.onload = function() {
  loadContent(window.location.pathname);

  meter = new Meter(meterCanvas);

  Pattern.context = meterCanvas.getContext("2d");
  Pattern.loadPattern([
    {name: "meterBackground", path: "../images/sidebar-meter-background.png"},
    {name: "meterForeground", path: "../images/sidebar-meter-foreground.png"},
    {name: "meterPointer", path: "../images/sidebar-meter-pointer.png"}
  ]);

  Pattern.onload = function() {
    meter.setRotation(.0);
  };

  new Ajax.PeriodicalUpdater('', '/tracks/info', {
    method: 'get',
    frequency: 1,
    decay: 2,
    onSuccess: function(transport) {
      response = JSON.parse(transport.responseText);
      meter.setRotation(response.percentage);

      var length = (parseInt(response.total_length * 10, 10).toString());

      while(length.length < 7) {
        length = "0" + length;
      }

      $('lengthMeter').update(length);
    },
    onFailure: function(transport) {
      console.error("JSON Content Request failed! Refactor Me!");
    }
  });
};