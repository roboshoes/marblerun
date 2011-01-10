var Showroom = Class.create(Renderer, {
  
  initialize: function($super, staticCanvas, dynamicCanvas, bufferCanvas) {
    $super(staticCanvas, dynamicCanvas, bufferCanvas);

    this.setSize();

    this.trackID = null;
  },

  destroy: function($super) {
    $super();

    $('showButton').stopObserving();
    $('nextButton').stopObserving();
    $('previousButton').stopObserving();
    $('repeatButton').stopObserving();
    $('showroomLikeButton').stopObserving();
    $('showroomFlagButton').stopObserving();
  },

  init: function($super) {
    
    this.initField();
    this.setSize();
    trackStore.loadNext(currentTrack);
    trackStore.loadPrevious(currentTrack);

    $super();
  },


  onBallExit: function($super) {
    
    this.field.stopBox2D();
    
    if (auto) {
      
      if (trackStore.hasNext(currentTrack)) {

        trackStore.loadTrack(trackStore.next(currentTrack), contentLoader.parseResponse, contentLoader, true);
        return;

      } else { 

        contentLoader.loadContent("/tracks/" + currentTrack + "/next", true);
        
      }

    } 

    $super();
    
  },

  setSize: function() {
    
    var width = this.field.x + this.field.width + 3,
        height = this.field.y + this.field.height + 3;

    this.width = this.staticCanvas.width = this.dynamicCanvas.width = this.bufferCanvas.width = width;
    this.height = this.staticCanvas.height = this.dynamicCanvas.height = this.bufferCanvas.height = height;
    
  },

  parseTrack: function(data) {
    this.field.setTrack(data.json);

    if (auto) {
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
        trackStore.loadTrack(trackStore.next(currentTrack), contentLoader.parseResponse, contentLoader, true);
        return;
      }

      contentLoader.loadContent("/tracks/" + currentTrack + "/next");
    });

    $('previousButton').observe('click', function(event) {

      if (trackStore.hasPrevious(currentTrack)) {
        trackStore.loadTrack(trackStore.previous(currentTrack), contentLoader.parseResponse, contentLoader, true);
        return;
      }

      contentLoader.loadContent("/tracks/" + currentTrack + "/previous");
    });

    $('repeatButton').observe('click', function(event) {
      $('repeatButton').toggleClassName('active');

      myScope.repeat = $('repeatButton').hasClassName('active');
    });

    $('repeatButton').removeClassName('active');

    if (Cookie.likedTracks.indexOf(this.trackID) === -1) {
      $('showroomLikeButton').observe('click', function() {
        myScope.like();
      });
      $('showroomLikeButton').setStyle({display: "block"});
    } else {
      $('showroomLikeButton').setStyle({display: "none"});
    }

    if (Cookie.flagedTracks.indexOf(this.trackID) === -1) {
      $('showroomFlagButton').observe('click', function() {
        myScope.flag();
      });

      $('showroomFlag').setStyle({display: "block"});
    } else {
      $('showroomFlag').setStyle({display: "none"});
    }
  },

  startRender: function($super) {
    $super();
    
    if (auto) {
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
          console.log("Sounds like fail!");
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
          console.log("Sounds flag fail!");
        }
      });
    }
  }

});