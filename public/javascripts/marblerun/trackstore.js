var TrackStore = Class.create({
  
  initialize: function() {
    this.tracks = {};
  },

  addTrack: function(track, next, previous) {
    if (this.tracks[track.id]) {
      if (next) {
        this.tracks[track.id].next = next;
      } 

      if (previous) {
        this.tracks[track.id].previous = previous;
      }

      return;
    }

    this.tracks[track.id] = {
      track: track,
      nextID: next,
      previousID: previous 
    }
  },

  getTrack: function(id) {
    if (!this.tracks[id]) {
      return null;
    } 
      
    return this.tracks[id].track;

  },

  loadTrack: function(id, callback, thisArgument, param) {

    if (this.tracks[id]) {
      if (callback) {
        callback.call(thisArgument, {responseJSON: {mode: "show", track: this.tracks[id].track}}, param);
        return;
      }
    }

    var thisClass = this;

    var request = new Ajax.Request("/tracks/" + id, {
      method: 'get',
      requestHeaders: {Accept: 'application/json'},

      onSuccess: function(transport) {
        thisClass.addTrack.call(thisClass, transport.responseJSON.track);

        if (callback) {
          callback.call(thisArgument, transport, param);
        }
      },

      onFailure: function(transport) {
        console.log("TrackStore:loadTrack() failed.");
      }

    });

  },

  loadNext: function(id) {

    console.log("load Next");
    
    if (this.tracks[id] && this.tracks[this.tracks[id].next]) {
      return;
    }

    var thisClass = this;
    var request = new Ajax.Request("/tracks/" + id + "/next", {
      method: 'get',
      requestHeaders: {Accept: 'application/json'},

      onSuccess: function(transport) {
        thisClass.tracks[id].next = transport.responseJSON.track.id;
        thisClass.addTrack.call(thisClass, transport.responseJSON.track, null, id);
      },

      onFailure: function(transport) {
        console.log("TrackStore:loadNext() failed.");
      }

    });
  },

  loadPrevious: function(id) {
    if (this.tracks[id] && this.tracks[this.tracks[id].previous]) {
      return;
    }

    var thisClass = this;
    var request = new Ajax.Request("/tracks/" + id + "/previous", {
      method: 'get',
      requestHeaders: {Accept: 'application/json'},

      onSuccess: function(transport) {
        thisClass.tracks[id].previous = transport.responseJSON.track.id;
        thisClass.addTrack.call(thisClass, transport.responseJSON.track, id, null);
      },

      onFailure: function(transport) {
        console.log("TrackStore:loadPrevious() failed.");
      }

    });
  },

  hasNext: function(id) {
    return (this.tracks[id].next !== null);
  },

  next: function(id) {
    if (this.hasNext(id)) {
      return this.tracks[id].next;
    }

    return null;
  },

  hasPrevious: function(id) {
    return (this.tracks[id].previous !== null);
  },

  previous: function(id) {
    if (this.hasPrevious(id)) {
      return this.tracks[id].previous;
    }

    return null;
  },

  prefetchTrack: function(id) {

    this.loadTrack(id);

  }

});