var ContentLoader = Class.create({
  
  initialize: function() {

    this.canvasContent = null;
    this.visibleList = null;
    this.loadingInterval = null;
    this.oldMode = null;
    this.oldContent = null;

    this.setInitialScreen();

    this.editor = new Editor(staticCanvas, dynamicCanvas, bufferCanvas, imageCanvas);
    this.editor.x = editorPosition.left;
    this.editor.y = editorPosition.top;

    this.showroom = new Showroom(staticCanvas, dynamicCanvas, bufferCanvas);
    this.showroom.x = editorPosition.left;
    this.showroom.y = editorPosition.top;

    var thisClass = this;
      
    Pattern.context = meterCanvas.getContext("2d");
    Pattern.loadPattern([
      {name: "meterBackground", path: "../images/sidebar-meter-background.png"},
      {name: "meterForeground", path: "../images/sidebar-meter-foreground.png"},
      {name: "meterPointer", path: "../images/sidebar-meter-pointer.png"}
    ]);

    Pattern.onload = function() {
      sidebarController = new SidebarController();

      thisClass.loadContent(window.location.href);
    };

    this.showroom.initializeHTMLInterface();

  }, 

  loadContent: function(path, setPath) {

    this.parseResponse({responseJSON: {mode: "load"}});

    if (path === "/about" || path === "/imprint" || path === "/contact") {

      this.parseResponse({responseJSON: {mode: path.substr(1)}}, setPath);
      return;

    } 

    var thisClass = this;

    var request = new Ajax.Request(path, {
      method: 'get',
      requestHeaders: {Accept: 'application/json'},

      onSuccess: function(transport) {
        thisClass.parseResponse.call(thisClass, transport, setPath);
      },
      onFailure: function(transport) {
        thisClass.parseResponse.call(thisClass, transport, false);
      }
    });

  },

  parseResponse: function(jsonContent, setPath) {

    this.loadingInterval && clearInterval(this.loadingInterval);

    if (typeof(setPath) === "undefined") {
      setPath = true;
    }

    var content = jsonContent.responseJSON;
    var path;

    this.visibleList = [];

    if (this.oldContent) {
      this.oldContent.quit();
    }

    switch(content.mode) {
      
      case "build":
        this.oldContent = this.editor;
        this.createBuildMode(content);
        path = "/tracks/new";
      break;

      case "show":  
        this.oldContent = this.showroom;  
        this.createShowMode(content);
        trackStore.addTrack(content.track);
        path = "/tracks/" + content.track.id;
      break;

      case "overview":
        this.oldContent = null;
        this.createOverviewMode(content);
        path = "/tracks?page=" + currentPage;
      break;

      case "about":
      case "imprint":
      case "contact":
        this.oldContent = null;
        this.visibleList = [content.mode + "Page"];
        path = "/" + content.mode;
      break;

      case "load":
        this.oldContent = null;
        setPath = false;
        this.visibleList = ["loadingPage"];
        this.loadingInterval = setInterval(function() {
          $("loadingPage").toggleClassName("blink");
        }, 500);
      break;

      case "failure":
        this.oldContent = null;
        this.visibleList = ["errorPage"];
        $("errorMessage").update(content.message.toUpperCase());
      break;

    }

    this.oldMode = content.mode;

    setToggleElementsVisibility(this.visibleList);

    if (setPath) {
      this.pushURL(path, jsonContent);
    }

    $('helpBox').setStyle({display: "none"});
    $('helpButton').removeClassName('active');

  },

  createBuildMode: function(content, visibleList) {

    setBuildTweetButton();
    setSwitchMode("build");

    this.editor.init();

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
    currentTrack = content.track.id;

    this.showroom.init();

    this.showroom.parseTrack(content.track);
    this.showroom.trackID = content.track.id;

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

  createOverviewMode: function(content) {

    setSwitchMode("view");
    currentPage = content.current_page;

    $('overviewPageDisplay').update("" + content.current_page + " / " + content.total_pages);

    $('overviewPreviousButton').removeClassName("inactive");
    $('overviewNextButton').removeClassName("inactive");

    if (content.current_page <= 1) {

      $('overviewPreviousButton').addClassName("inactive");

    }

    if (content.current_page >= content.total_pages) {

      $('overviewNextButton').addClassName("inactive");

    } 
    
    
    var htmlString = "<ul>", i, next = null, previous = null;

    for (i = 0; i < content.tracks.length; i++) {

      if (i === content.tracks.length - 1) {
        next = null;
      } else {
        next = content.tracks[i+1].id
      }

      trackStore.addTrack(content.tracks[i], next, previous);

      previous = content.tracks[i].id;

      var listString = "<li>";

      listString += '<a onclick="trackStore.loadTrack(' + content.tracks[i].id + ', contentLoader.parseResponse, contentLoader)"><img src="' + content.tracks[i].imagedata + '"></a>';
      listString += '<ul>';
      listString += '<li class="trackname">' + content.tracks[i].trackname + '</li>';
      listString += '<li class="username">' + content.tracks[i].username + '</li>';
      listString += '<li class="length">' + Math.round(content.tracks[i].length * 10) / 10 + ' Meter | LIKES ' + content.tracks[i].likes + '</li>';
      listString += '</ul>';

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

    this.parseResponse(event.state, false);

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