var Showroom = Class.create(Renderer, {
  
  initialize: function($super, staticCanvas, dynamicCanvas, bufferCanvas) {
    $super(staticCanvas, dynamicCanvas, bufferCanvas);

    this.setSize();

    this.trackID = null;
    
    this.fieldOffset = 0;
    this.fieldImageData = null;
  },

  destroy: function($super) {
    $super();

    $('showButton').stopObserving();
    $('nextButton').stopObserving();
    $('previousButton').stopObserving();
  },

  quit: function($super) {
    $super();
    
    if (this.tweenTimeoutID) {
      clearTimeout(this.tweenTimeoutID);
      this.tweeTimeoutID = null;
    }
    
    $('showroomLikeButton').stopObserving();
    $('showroomFlagButton').stopObserving();
  },

  init: function($super) {
    
    this.initField();
    this.setSize();
    trackStore.loadNext(currentTrack);
    trackStore.loadPrevious(currentTrack);
    this.setLikeBlameButtons();
  
    $super();
  },
  
  drawDynamics: function($super, context) {
    
    if (!this.fieldImageData) {
      
      $super(context);
      
    }
    
  },

  onBallExit: function($super) {

    $super();

    if (auto) {

      if (trackStore.hasNext(currentTrack)) {

        this.fadeTrack(trackStore.next(currentTrack), true);

      } else {

        contentLoader.loadContent("/tracks/" + currentTrack + "/next", true);

      }

    }

  },

  setSize: function() {
    
    var width = this.field.x + this.field.width + 3,
        height = this.field.y + this.field.height + 3;

    this.width = this.staticCanvas.width = this.dynamicCanvas.width = this.bufferCanvas.width = width;
    this.height = this.staticCanvas.height = this.dynamicCanvas.height = this.bufferCanvas.height = height;
    
  },

  parseTrack: function(data) {
    this.field.setTrack(data.json);

    if (auto && !this.fieldImageData) {
      this.field.startBox2D();
    }
  },

  initializeHTMLInterface: function() {
    var myScope = this;

    $('showButton').observe('click', function(event) {
      myScope.field.startBox2D();
    });

    
    $('nextButton').observe('click', function(event) {

      if (trackStore.hasNext(currentTrack)) {
        myScope.fadeTrack(trackStore.next(currentTrack), true);
        return;
      }

      contentLoader.loadContent("/tracks/" + currentTrack + "/next");
    });

    $('previousButton').observe('click', function(event) {

      if (trackStore.hasPrevious(currentTrack)) {
        myScope.fadeTrack(trackStore.previous(currentTrack), false);
        return;
      }

      contentLoader.loadContent("/tracks/" + currentTrack + "/previous");
    });
    
  },

  setLikeBlameButtons: function() {
    var myScope = this;

    if (Cookie.likedTracks.indexOf(this.trackID) === -1) {
      $('showroomLikeButton').observe('click', function() {
        myScope.like();
      });

      $('showroomLikeButton').setStyle({display: "block"});
    } else {

      $('showroomLikeButton').stopObserving();
      $('showroomLikeButton').setStyle({display: "none"});
    }

    if (Cookie.flagedTracks.indexOf(this.trackID) === -1) {
      $('showroomFlagButton').observe('click', function() {
        myScope.flag();
      });

      $('showroomFlag').setStyle({display: "block"});
    } else {
      $('showroomFlagButton').stopObserving();
      $('showroomFlag').setStyle({display: "none"});
    }
  },

  startRender: function($super) {
    $super();
    
    if (auto && !this.fieldImageData) {
      this.field.startBox2D();
    }
  },

  like: function() {

    if (this.trackID) {
      var parameters = {};
      var myScope = this;

      parameters.likes = 1;
        
      var request = new Ajax.Request('/tracks/' + this.trackID, {
        method: 'put',
        parameters: parameters,
        requestHeaders: {Accept: 'application/json'},
        
        onSuccess: function(transport) {
          Cookie.likedTracks.push(myScope.trackID);
          Cookie.set('likes', JSON.stringify(Cookie.likedTracks), {maxAge: 60 * 60 * 24 * 365});

          $('tableLikes').update(parseInt($('tableLikes').innerHTML, 10) + 1);

          $('showroomLikeButton').setStyle({display: "none"});
        },
        
        onFailure: function(transport) {
          $('showroomLikeButton').setStyle({display: "none"});
        }
      });
    }
  },

  flag: function() {
    if (this.trackID) {
      var parameters = {};
      var myScope = this;

      parameters.flags = 1;
        
      var request = new Ajax.Request('/tracks/' + this.trackID, {
        method: 'put',
        parameters: parameters,
        requestHeaders: {Accept: 'application/json'},
        
        onSuccess: function(transport) {
          Cookie.flagedTracks.push(myScope.trackID);
          Cookie.set('flags', JSON.stringify(Cookie.flagedTracks), {maxAge: 60 * 60 * 24 * 365});

          $('showroomFlag').setStyle({display: "none"});
        },
        
        onFailure: function(transport) {
          $('showroomFlag').setStyle({display: "none"});
        }
      });
    }
  },
  
  fadeTrack: function(trackID, fadeDown) {
    
    this.fieldImageData = this.staticContext.getImageData(this.field.x, this.field.y, this.field.width, this.field.height);
    
    trackStore.loadTrack(trackID, contentLoader.parseResponse, contentLoader, true);
    
    this.fieldOffset = (fadeDown ? this.field.height : -this.field.height);
    
    this.tween();
    
  },
  
  tween: function() {
    
    this.field.renderNew = true;
    
    if (Math.abs(this.fieldOffset) < 1) {
      
      this.fieldOffset = 0;
      
      this.fieldImageData = null;
      
      this.tweenTimeoutID = null;
      
      if (auto) {
        this.field.startBox2D();
      }
      
      return;
    }
    
    this.fieldOffset += -this.fieldOffset / 10;
    
    // this.fieldOffset += (this.fieldOffset > 0 ? -stepSize : stepSize);
    
    var myScope = this;
    
    this.tweenTimeoutID = setTimeout(function() {
      
      myScope.tween();
      
    }, 50);
    
  }

});