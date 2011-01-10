var SidebarController = Class.create({
  
  initialize: function() {
    
    meter = new Meter(meterCanvas);
    meter.setRotation(0.0);

    var thisClass = this;

    var request = new Ajax.PeriodicalUpdater('', '/tracks/info', {

      method: 'get',
      frequency: 6,
      decay: 1,

      onSuccess: function(transport) {thisClass.onInfoUpdate.call(thisClass, transport);},
      onFailure: function(transport) {
        console.error("Periodical Update failed!");
      }
    });

    this.targetMeters = null;
    this.meters = 0;

  },

  onInfoUpdate: function(transport) {

    response = JSON.parse(transport.responseText);
     
    meter.setRotation(response.percentage);

    this.setMeters(parseInt(response.total_length * 10, 10));

    this.setLatestTrack(response.latest_track);
  },

  setMeters: function(length) {
    
    this.targetMeters = length;

    var myScope = this;

    setTimeout(function() {
      myScope.updateMeters();
    }, 100);

  },

  updateMeters: function() {

    if (this.targetMeters - this.meters > 1) {

      this.meters += (this.targetMeters - this.meters) / 9;

      var myScope = this;

      setTimeout(function() {
        myScope.updateMeters();
      }, 50);
      
    } else {
    
      this.meters = this.targetMeters;  

    }

    var length = (parseInt(this.meters, 10).toString());

    while(length.length < 7) {
      length = "0" + length;
    }

    $('lengthMeter').update(length);

  },

  setLatestTrack: function(track) {

    var newTag = '<a href="/tracks/' + track.id + '"><div><img width="122" height="182" src="';
    newTag += track.imagedata;
    newTag += '" /><div class="background"></div><div><div class="header">LATEST TRACK</div><div id="latestInfo">';
    newTag += track.trackname.toUpperCase() + "<br>";
    newTag += track.username.toUpperCase() + "<br>";
    newTag += (Math.round(track.length * 10) / 10).toString() + " METER";
    newTag += "</div></div><div></a>";

    $('lastTrackHolder').update(newTag);

  }

});