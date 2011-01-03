class Track < ActiveRecord::Base
  attr_accessible :json, :username, :trackname, :length, :imagedata

  validates_uniqueness_of :json

  def json_track
    hash = Hash.new
    
    hash['id'] = self.id
    hash['json'] = ActiveSupport::JSON.decode(self.json)
    hash['trackname'] = self.trackname
    hash['username'] = self.username
    hash['imagedata'] = self.imagedata 
    hash['length'] = self.length

    hash
  end

  def show_response
    hash = Hash.new

    hash['mode'] = 'show'
    hash['track'] = self.json_track

    hash
  end
end
