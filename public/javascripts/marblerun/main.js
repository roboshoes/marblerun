var basePath = "http://localhost:3000";
var currentMode = "build";
var overviewSort = "alphabetic";
var localTracks = {};

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
  "showroomDetail",
  "overviewControls",
  "overviewGrid",
  "mainCanvas",
  "bufferCanvas",
  "imageCanvas"
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
      loadContent("/tracks");

    }
  });

}();

var setSwitchMode = function(mode) {
  if (mode == currentMode){
    return;
  }

  currentMode = mode;
  $('modeSwitch').toggleClassName("view");
};

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

    visibleList = ["editorControlsTop", "editorControlsBottom", "editorToolboxTop", "editorToolboxBottom", "mainCanvas", "bufferCanvas"];
    $('editor').setStyle({height: "560px"});
    setSwitchMode("build");

  } else if (content.mode == "show") {

    if (!localTracks[content.track.id]) {
        localTracks[content.track.id] = content.track;
    }

    if (setPath) {
      setURL("/tracks/" + content.track.id);
    }

    canvasContent = new Showroom(mainCanvas, bufferCanvas);
    canvasContent.x = editorPosition.left;
    canvasContent.y = editorPosition.top;

    canvasContent.parseTrack(content.track);

    canvasContent.startRender();

    var trackDate = new Date();
    
    // trackDate.setTime(content.created_at);
    // trackDate.setFullYear(content.created_at.substr(0, 4));
    // trackDate.setMonth(parseInt(content.created_at.substr(5, 2), 10));
    // trackDate.setDate(content.created_at.substr(9, 2));

    console.log(trackDate);

    $('tableTrack').update(content.track.trackname.toUpperCase());
    $('tableBuilder').update(content.track.username.toUpperCase());
    $('tableLength').update((parseInt(content.track.length * 10, 10)) / 10 + " METER");

    $('tableLikes').update(content.track.likes);

    visibleList = ["showroomControlsTop", "showroomControlsBottom", "showroomDetail", "mainCanvas", "bufferCanvas"];
    $('editor').setStyle({height: "520px"});
    setSwitchMode("view");

  } else if (content.mode == "overview") {
    visibleList = ["overviewControls", "overviewGrid"];

    var htmlString = "<ul>";

    for (var i = 0; i < content.tracks.length; i++) {

      if (!localTracks[content.tracks[i].id]) {
        localTracks[content.tracks[i].id] = content.tracks[i];
      }

      var listString = "<li>";

      listString += '<a onclick="loadTrack(' + content.tracks[i].id + ')"><img src="' + content.tracks[i].imagedata + '"></a>';
      listString += '<ul>'
      listString += '<li class="trackname">' + content.tracks[i].trackname + '</li>'
      listString += '<li class="username">' + content.tracks[i].username + '</li>'
      listString += '<li class="length">' + Math.round(content.tracks[i].length * 10) / 10 + ' Meter</li>'
      listString += '</ul>'

      listString += "</li>";

      htmlString += listString;
    }

    htmlString += "</ul>";

    $('overviewGrid').update(htmlString);
    
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
};

var loadTrack = function(trackID) {
  if (localTracks[trackID]) {
    parseResponse({
      responseJSON: {
        mode: 'show',
        track: localTracks[trackID]
      }
    });
  } else {
    loadContent('/tracks/' + trackID);
  }
};

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