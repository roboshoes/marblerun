var ContentLoader = Class.create({
  
  initialize: function() {

    this.canvasContent;
    this.visibleList;

    var thisClass = this;
      
    Pattern.context = meterCanvas.getContext("2d");
    Pattern.loadPattern([
      {name: "meterBackground", path: "../images/sidebar-meter-background.png"},
      {name: "meterForeground", path: "../images/sidebar-meter-foreground.png"},
      {name: "meterPointer", path: "../images/sidebar-meter-pointer.png"}
    ]);

    Pattern.onload = function() {
      sidebarController = new SidebarController();

      thisClass.loadContent(window.location.pathname);
    };

    this.setInitialScreen();

    //window.onpopstate = thisClass.onPopState;

  }, 

  loadContent: function(path, setPath) {

    if (path == "/about" || path == "/imprint" || path == "/contact") {

      parseResponse({responseJSON: {mode: path.substr(1)}}, setPath);
      return;

    } 

    var thisClass = this;

    new Ajax.Request(path, {
      method: 'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: function(transport) {thisClass.parseResponse.call(thisClass, transport, setPath)},
      onFailure: function() {
        console.error("JSON Content Request failed! Refactor Me!");
      }
    });

  },

  parseResponse: function(jsonContent, setPath) {

    console.log(jsonContent);

    var content = jsonContent.responseJSON;
    var path;

    this.visibleList = [];

    if (this.canvasContent) {
      this.canvasContent.destroy();
      this.canvasContent = null;
    }

    switch(content.mode) {
      
      case "build":
        this.createBuildMode(content);
        path = "/tracks/new";
      break;

      case "show":    
        this.createShowMode(content);
        path = "/tracks/" + content.track.id;
      break;

      case "overview":
        this.createOverviewMode(content);
        path = "/tracks";
      break;

      case "about":
      case "imprint":
      case "contact":
        this.visibleList = [content.mode + "Page"];
        path = "/" + content.mode
      break;

    }

    setToggleElementsVisibility(this.visibleList);

    setPath && this.pushURL(path, jsonContent);

  },

  createBuildMode: function(content, visibleList) {

    setBuildTweetButton();
    setSwitchMode("build");

    this.canvasContent = new Editor(staticCanvas, dynamicCanvas, bufferCanvas, imageCanvas);
    this.canvasContent.x = editorPosition.left;
    this.canvasContent.y = editorPosition.top;

    this.canvasContent.startRender();

    $('editor').setStyle({height: "560px"});

    this.visibleList = [
      "editorControlsTop", "editorControlsBottom", 
      "editorToolboxTop", "editorToolboxBottom", 
      "staticCanvas", "dynamicCanvas"
    ];
    
  },

  createShowMode: function(content) {

    setTrackTweetButton(content.track.id);
    setSwitchMode("view");

    if (!localTracks[content.track.id]) {
        localTracks[content.track.id] = content.track;
    }

    this.canvasContent = new Showroom(staticCanvas, dynamicCanvas, bufferCanvas);
    this.canvasContent.x = editorPosition.left;
    this.canvasContent.y = editorPosition.top;

    this.canvasContent.parseTrack(content.track);
    this.canvasContent.trackID = content.track.id;

    this.canvasContent.initializeHTMLInterface();
    this.canvasContent.startRender();

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

    $('editor').setStyle({height: "520px"});

    this.visibleList = ["showroomControlsTop", "showroomControlsBottom", "showroomDetail", "staticCanvas", "dynamicCanvas"];

  },

  createOverviewMode: function(content, visibleList) {

    setSwitchMode("view");
    
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

    this.visibleList = ["overviewControls", "overviewGrid"];
    
  }, 

  pushURL: function(path, content) {
    
    if (history && history.pushState) {
      
      history.pushState(content, "", path);

    }

  },

  onPopState: function(event) {

  },

  setInitialScreen: function() {
    
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

    Cookie.set("isFirstVisit", true, {maxAge: 60 * 60 * 24 * 30 * 2});

    Cookie.likedTracks = JSON.parse(Cookie.get('likes')) || [];
    Cookie.flagedTracks = JSON.parse(Cookie.get('flags')) || [];

  }

});