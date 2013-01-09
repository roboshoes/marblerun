class Track < ActiveRecord::Base
  cattr_reader :per_page
  @@per_page = 12

  attr_accessible :json, :username, :trackname, :length, :imagedata

  validate :check_bricks

  before_create do |track|
    track.active = true
    track.flags = 0
    track.likes = 0
  end

  before_save do |track|
    if !track.length
      track.length = 1.4
    elsif track.length > 999.9
      track.length = 999.9
    elsif track.length < 1.4
      track.length = 1.4
    end

    track.clean_names
  end

  after_save do |track|
    MarbleRun.update_length track.length
    Unlock.unlock_bricks
  end

  def json_track
    hash = Hash.new
    
    hash['id'] = self.id
    hash['json'] = ActiveSupport::JSON.decode(self.json)
    hash['trackname'] = self.trackname.gsub(/<\/?[^>]*>/, "")
    hash['username'] = self.username.gsub(/<\/?[^>]*>/, "")
    hash['imagedata'] = self.imagedata 
    hash['length'] = self.length
    hash['likes'] = self.likes
    hash['date'] = self.created_at.strftime("%d. %B %Y")
    hash['time'] = self.created_at.strftime("%I:%M %p")

    hash
  end

  def show_response
    hash = Hash.new

    hash['mode'] = 'show'
    hash['track'] = self.json_track

    hash
  end

  def check_bricks
    unlocks = Unlock.where(:is_unlocked => true)
    available_bricks = Array.new

    unlocks.each do |unlock|
      available_bricks.push(unlock['brick_type'])
    end

    is_ball_included = false
    is_exit_included = false

    hash = ActiveSupport::JSON.decode(self.json)

    hash['bricks'].each_value do |brick|
      if brick['type'] == 'Ball'
        is_ball_included = true
      end

      if brick['type'] == 'Exit'
        is_exit_included = true
      end

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

    errors[:json] << "Doesn't include a ball!" unless is_ball_included
    errors[:json] << "Doesn't include an exit!" unless is_exit_included
  end

  def previous
    self.class.first(:conditions => ["created_at > ? AND active = ?", self.created_at, true], :order => 'created_at ASC')
  end

  def next
    self.class.first(:conditions => ["created_at < ? AND active = ?", self.created_at, true], :order => 'created_at DESC')
  end

  protected
  def clean_names
    random_usernames = ["Anonymous", "Anonymous Architect"]
    random_tracknames = ["Wild Ride", "Rollercoaster"]

    if self.username == "YOUR NAME"
      self.username = random_usernames[rand(random_usernames.length)]
    end

    if self.trackname == "TRACK NAME"
      self.trackname = random_tracknames[rand(random_tracknames.length)]
    end
  end
end
