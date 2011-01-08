var basePath = "http://localhost:3000";
var currentMode = "build";
var overviewSort = "alphabetic";
var localTracks = {};

var canvasContent, meter;
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
  "contactPage"
];

staticCanvas.onselectstart = function() {return false};
dynamicCanvas.onselectstart = function() {return false};
meterCanvas.onselectstart = function() {return false};

imageCanvas.style.visibility = 'hidden';
bufferCanvas.style.visibility = 'hidden';

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

  $('helpButton').observe('click', function(event) {
    $('helpBox').toggle();
    $('helpButton').toggleClassName('active');
  });

  $('helpBox').toggleClassName('toggleElement');
  $('helpBox').toggle();

  $("newTrackButton").observe('click', function(event) {
    loadContent("/tracks/new");
  });

  $("galleryButton").observe('click', function(event) {
    loadContent("/tracks");
  });

  $("menuAbout").observe('click', function(event) {
    parseResponse({responseJSON: {mode:"about"}}, true);
  });

  $("menuImprint").observe('click', function(event) {
    parseResponse({responseJSON: {mode:"imprint"}}, true);
  });

  $("menuContact").observe('click', function(event) {
    parseResponse({responseJSON: {mode:"contact"}}, true);
  });

  $('trackName').observe('focus', function(event) {
    if (this.value == 'TRACK NAME') {
      this.value = '';
    }
  });

  $('userName').observe('focus', function(event) {
    if (this.value == 'YOUR NAME') {
      this.value = '';
    }
  });

  $('trackName').observe('blur', function(event) {
    if (this.value == '') {
      this.value = 'TRACK NAME';
    }
  });

  $('userName').observe('blur', function(event) {
    if (this.value == '') {
      this.value = 'YOUR NAME';
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

    setBuildTweetButton();

    if (setPath) {
      setURL("/tracks/new");
    }

    canvasContent = new Editor(staticCanvas, dynamicCanvas, bufferCanvas, imageCanvas);
    canvasContent.x = editorPosition.left;
    canvasContent.y = editorPosition.top;

    canvasContent.startRender();

    visibleList = ["editorControlsTop", "editorControlsBottom", "editorToolboxTop", "editorToolboxBottom", "staticCanvas", "dynamicCanvas"];
    $('editor').setStyle({height: "560px"});
    setSwitchMode("build");

  } else if (content.mode == "show") {

    setTrackTweetButton(content.track.id);

    if (!localTracks[content.track.id]) {
        localTracks[content.track.id] = content.track;
    }

    if (setPath) {
      setURL("/tracks/" + content.track.id);
    }

    canvasContent = new Showroom(staticCanvas, dynamicCanvas, bufferCanvas);
    canvasContent.x = editorPosition.left;
    canvasContent.y = editorPosition.top;

    canvasContent.parseTrack(content.track);
    canvasContent.trackID = content.track.id;

    canvasContent.initializeHTMLInterface();
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

    visibleList = ["showroomControlsTop", "showroomControlsBottom", "showroomDetail", "staticCanvas", "dynamicCanvas"];
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
      listString += '<li class="length">' + Math.round(content.tracks[i].length * 10) / 10 + ' Meter | LIKES ' + content.tracks[i].likes + '</li>'
      listString += '</ul>'

      listString += "</li>";

      htmlString += listString;
    }

    htmlString += "</ul>";

    $('overviewGrid').update(htmlString);
    setSwitchMode("view");
    
  } else if (content.mode == "about") {

    if (setPath) {
      setURL("/about");
    }

    visibleList = ["aboutPage"];
  } else if (content.mode == "imprint") {

    if (setPath) {
      setURL("/imprint");
    }

    visibleList = ["imprintPage"];
  }

  else if (content.mode == "contact") {

    if (setPath) {
      setURL("/contact");
    }

    visibleList = ["contactPage"];
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

  if (path == "/about" || path == "/imprint" || path == "/contact") {

    parseResponse({responseJSON: {mode: path.substr(1)}});
    return;

  } 

  new Ajax.Request(path, {
    method: 'get',
    requestHeaders: {Accept: 'application/json'},
    onSuccess: parseResponse,
    onFailure: function() {
      console.error("JSON Content Request failed! Refactor Me!");
    }
  });

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

var setURL = function(path) {

  var pathArray = path.split("/");

  if (pathArray[pathArray.length - 1] == '/') {
    pathArray.pop();
  }

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

var setLatestTrack = function(content) {

  var newTag = '<div><img width="122" height="182" src="';
  newTag += content.imagedata;
  newTag += '" /><div class="background"></div><div><div class="header">LATEST TRACK</div><div id="latestInfo">';
  newTag += content.trackname.toUpperCase() + "<br>";
  newTag += content.username.toUpperCase() + "<br>";
  newTag += (Math.round(content.length * 10) / 10).toString() + " METER";
  newTag += "</div></div><div>";

  $('lastTrackHolder').update(newTag);
}

window.onload = function() {

  if (!Cookie.get("isFirstVisit")) {
    $('firstVisitContainer').setStyle({visibility: "visible"});
    $('firstVisitText').setStyle({visibility: "visible"});
    $('firstVisitCloseButton').setStyle({visibility: "visible"});

    $('firstVisitCloseButton').observe('click', function(event) {
      $('firstVisitContainer').setStyle({visibility: "hidden"});
      $('firstVisitText').setStyle({visibility: "hidden"});
      $('firstVisitCloseButton').setStyle({visibility: "hidden"});
    });
  } else {
    $('firstVisitContainer').setStyle({visibility: "hidden"});
    $('firstVisitText').setStyle({visibility: "hidden"});
    $('firstVisitCloseButton').setStyle({visibility: "hidden"});
  }

  //Cookie.set("isFirstVisit", true, {maxAge: 60 * 60 * 24 * 30});
  Cookie.set("isFirstVisit", true, {maxAge: 60 * 1});

  Cookie.likedTracks = JSON.parse(Cookie.get('likes')) || [];
  Cookie.flagedTracks = JSON.parse(Cookie.get('flags')) || [];

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
    
    loadContent(window.location.pathname);
  };

  new Ajax.PeriodicalUpdater('', '/tracks/info', {
    method: 'get',
    frequency: 3,
    decay: 2,
    onSuccess: function(transport) {
      response = JSON.parse(transport.responseText);
      
      meter.setRotation(response.percentage);

      var length = (parseInt(response.total_length * 10, 10).toString());

      while(length.length < 7) {
        length = "0" + length;
      }

      $('lengthMeter').update(length);

      setLatestTrack(response.latest_track);
    },
    onFailure: function(transport) {
      console.error("JSON Content Request failed! Refactor Me! Periodical Updater");
    }
  });
};