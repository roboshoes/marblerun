/* ---- GLOBAL VARS ---- */

var basePath = "http://localhost:3000";
var currentMode = "build";
var currentTrack;
var currentPage = 1;
var localTracks = {};

var canvasContent, meter, contentLoader, sidebarController;
var editorPosition = $('editor').cumulativeOffset($('editor'));

var staticCanvas = document.getElementById("staticCanvas"),
    dynamicCanvas = document.getElementById("dynamicCanvas"),
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
  "staticCanvas",
  "dynamicCanvas",
  "publishButtonWarning",
  "aboutPage",
  "imprintPage",
  "contactPage",
  "errorPage",
  "loadingPage"
];

/* ---- GLOBAL SETUP ---- */

staticCanvas.onselectstart = function() {return false;};
dynamicCanvas.onselectstart = function() {return false;};
meterCanvas.onselectstart = function() {return false;};

imageCanvas.style.visibility = 'hidden';
bufferCanvas.style.visibility = 'hidden';

/* ---- */

var setSwitchMode = function(mode) {
  if (mode === currentMode){
    return;
  }

  currentMode = mode;
  $('modeSwitch').toggleClassName("view");
};


var setToggleElementsVisibility = function(visibleElements) {
  var i;
  
  for (i = 0; i < toggleElements.length; i++) {

    if (visibleElements.indexOf(toggleElements[i]) > -1) {

      $(toggleElements[i]).setStyle({visibility: "visible"});
      
    } else {

      $(toggleElements[i]).setStyle({visibility: "hidden"});

    }
  }
};

var setTrackTweetButton = function(trackID) {
  var parameters = {
    url: "http://marblerun.at/tracks/" + trackID,
    via: "themarblerun",
    text: "I built an awesome MARBLE RUN track, check it out!",
    counturl: "http://marblerun.at/tracks/" + trackID
  };

  Element.writeAttribute($('showroomTwitterButton'), {href: 'http://twitter.com/share?' + Object.toQueryString(parameters)});
};

var setBuildTweetButton = function() {
  var parameters = {
    url: "http://marblerun.at/",
    via: "themarblerun",
    text: "I help MARBLE RUN to build the longest marble run on earth!",
    counturl: "http://marblerun.at/tracks/"
  };

  Element.writeAttribute($('twitterButton'), {href: 'http://twitter.com/share?' + Object.toQueryString(parameters)});
};

var loadTrack = function(trackID) {
  if (localTracks[trackID]) {
    contentLoader.parseResponse({
      responseJSON: {
        mode: 'show',
        track: localTracks[trackID]
      }
    }, true);
  } else {
    contentLoader.loadContent('/tracks/' + trackID, true);
  }
};

var initializeHTMLInterface = (function() {

  var myScope = this;

  $('modeSwitch').observe('click', function(event) {

    if (myScope.currentMode === "view") {

      setSwitchMode("build");
      contentLoader.parseResponse({responseJSON: {mode: "build"}}, true);

    } else {
      
      setSwitchMode("view");
      contentLoader.loadContent("/tracks?page=" + currentPage, true);

    }
  });

  $('helpButton').observe('click', function(event) {
    $('helpBox').toggle();
    $('helpButton').toggleClassName('active');
  });

  $('helpBox').toggleClassName('toggleElement');
  $('helpBox').toggle();

  $("newTrackButton").observe('click', function(event) {
    contentLoader.parseResponse({responseJSON: {mode: "build"}}, true);
  });

  $("galleryButton").observe('click', function(event) {
    contentLoader.loadContent("/tracks?page=" + currentPage);
  });

  $("menuAbout").observe('click', function(event) {
    contentLoader.parseResponse({responseJSON: {mode:"about"}}, true);
  });

  $("menuImprint").observe('click', function(event) {
    contentLoader.parseResponse({responseJSON: {mode:"imprint"}}, true);
  });

  $("menuContact").observe('click', function(event) {
    contentLoader.parseResponse({responseJSON: {mode:"contact"}}, true);
  });

  $('trackName').observe('focus', function(event) {
    if (this.value === 'TRACK NAME') {
      this.value = '';
    }
  });

  $('userName').observe('focus', function(event) {
    if (this.value === 'YOUR NAME') {
      this.value = '';
    }
  });

  $('trackName').observe('blur', function(event) {
    if (this.value === '') {
      this.value = 'TRACK NAME';
    }
  });

  $('userName').observe('blur', function(event) {
    if (this.value === '') {
      this.value = 'YOUR NAME';
    }
  });

}());

window.onload = function() {
  contentLoader = new ContentLoader();

  setTimeout(function() {

    window.onpopstate = function(event) {
      contentLoader.onPopState.call(contentLoader, event);
    };

  }, 50);
};
