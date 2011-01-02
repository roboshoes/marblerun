class Track < ActiveRecord::Base
  attr_accessible :json, :username, :trackname, :length, :imagedata

  validates_uniqueness_of :json

  def json_object
    string = '{'
    string += '"id":'
    string += self.id.to_s
    string += ', '
    string += '"json":'
    string += self.json
    string += ', '
    string += '"trackname":"'
    string += self.trackname
    string += '", '
    string += '"username":"'
    string += self.username
    string += '", '
    string += '"imagedata":"'
    string += self.imagedata
    string += '", '
    string += '"length":'
    string += self.length.to_s
    string += '}'

    string
  end
end
