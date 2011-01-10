class Track < ActiveRecord::Base
  cattr_reader :per_page
  @@per_page = 12

  attr_accessible :json, :username, :trackname, :length, :imagedata

  validate :check_ball
  validate :check_exit
  validate :check_bricks

  scope :ordered, lambda {|*args| {:order => (args.first || 'created_at DESC')} }

  def json_track
    hash = Hash.new
    
    hash['id'] = self.id
    hash['json'] = ActiveSupport::JSON.decode(self.json)
    hash['trackname'] = self.trackname
    hash['username'] = self.username
    hash['imagedata'] = self.imagedata 
    hash['length'] = self.length
    hash['likes'] = self.likes
    hash['date'] = self.created_at.strftime("%d. %B %Y")
    hash['time'] = self.created_at.strftime("%I:%M %p")

    hash
  end

  def clean_names
    random_usernames = Array.new
    random_tracknames = Array.new

    random_usernames.push "Anonymous"
    random_usernames.push "Anonymous Architect"

    random_tracknames.push "Wild Ride"
    random_tracknames.push "Rollercoaster"

    if self.username == "YOUR NAME"
      self.username = random_usernames[rand(random_usernames.length)]
    end

    if self.trackname == "TRACK NAME"
      self.trackname = random_tracknames[rand(random_tracknames.length)]
    end
  end

  def show_response
    hash = Hash.new

    hash['mode'] = 'show'
    hash['track'] = self.json_track

    hash
  end

  def check_ball
    hash = ActiveSupport::JSON.decode(self.json)

    hash['bricks'].each_value do |brick|
      if brick['type'] == 'Ball'
        return
      end
    end

    errors[:json] << "Doesn't include a ball!"
  end

  def check_exit
    hash = ActiveSupport::JSON.decode(self.json)

    hash['bricks'].each_value do |brick|
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

    hash['bricks'].each_value do |brick|
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

  def previous
    self.class.first(:conditions => ["created_at > ? AND active = ?", self.created_at, true], :order => 'created_at ASC')
  end

  def next
    self.class.first(:conditions => ["created_at < ? AND active = ?", self.created_at, true], :order => 'created_at DESC')
  end

end
