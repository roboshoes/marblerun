var SidebarController = Class.create({
  
  initialize: function() {
    
    meter = new Meter(meterCanvas);
    meter.setRotation(0.0);

    var thisClass = this;

    var request = new Ajax.PeriodicalUpdater('', '/tracks/info', {

      method: 'get',
      frequency: 3,
      decay: 2,

      onSuccess: function(transport) {thisClass.onInfoUpdate.call(thisClass, transport);},
      onFailure: function(transport) {
        console.error("Periodical Update failed!");
      }
    });

  },

  onInfoUpdate: function(transport) {

    response = JSON.parse(transport.responseText);
     
    meter.setRotation(response.percentage);

    var length = (parseInt(response.total_length * 10, 10).toString());
    while(length.length < 7) {
      length = "0" + length;
    }

    $('lengthMeter').update(length);

    this.setLatestTrack(response.latest_track);
  },

  setLatestTrack: function(track) {

    var newTag = '<div><img width="122" height="182" src="';
    newTag += track.imagedata;
    newTag += '" /><div class="background"></div><div><div class="header">LATEST TRACK</div><div id="latestInfo">';
    newTag += track.trackname.toUpperCase() + "<br>";
    newTag += track.username.toUpperCase() + "<br>";
    newTag += (Math.round(track.length * 10) / 10).toString() + " METER";
    newTag += "</div></div><div>";

    $('lastTrackHolder').update(newTag);

  }

});