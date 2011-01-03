class Track < ActiveRecord::Base
  attr_accessible :json, :username, :trackname, :length, :imagedata

  validates_uniqueness_of :json

  validate :check_ball
  validate :check_exit
  validate :check_bricks

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

  def check_ball
    hash = ActiveSupport::JSON.decode(self.json)

    hash['bricks'].each do |brick|
      if brick['type'] == 'Ball'
        return
      end
    end

    errors[:json] << "Doesn't include a ball!"
  end

  def check_exit
    hash = ActiveSupport::JSON.decode(self.json)

    hash['bricks'].each do |brick|
      if brick['type'] == 'Exit'
        return
      end
    end

    errors[:json] << "Doesn't include an exit!"
  end

  def check_bricks
    unlocks = Unlock.where(:is_unlocked => true)
    available_bricks = Array.new

    unlocks.each do |unlock|
      available_bricks.push(unlock['brick_type'])
    end

    hash = ActiveSupport::JSON.decode(self.json)

    hash['bricks'].each do |brick|
      if !available_bricks.include?(brick['type'])
        if brick['type'] == 'Ball'
          if brick['col'] != 0 || brick['row'] != 0
            errors[:json] << "Ball on wrong position!"

            return
          end
        elsif brick['type'] == 'Exit'
          if brick['col'] != 0 || brick['row'] != 14
            errors[:json] << "Exit on wrong position!"

            return
          end
        else
          errors[:json] << "Includes an locked brick!"

          return
        end
      end
    end

  end
end
