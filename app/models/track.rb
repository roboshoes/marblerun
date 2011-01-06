class Track < ActiveRecord::Base
  attr_accessible :json, :username, :trackname, :length, :imagedata

  validates_uniqueness_of :json

  validate :check_ball
  validate :check_exit
  validate :check_bricks

  scope :ordered, lambda {|*args| {:order => (args.first || 'created_at DESC')} }

  #scope :previous, lambda { |i| {:conditions => ["#{self.table_name}.id < ?", i.id], :order => "#{self.table_name}.id DESC"} }
  #scope :next, lambda { |i| {:conditions => ["#{self.table_name}.id > ?", i.id], :order => "#{self.table_name}.id ASC"} }

  def json_track
    hash = Hash.new
    
    hash['id'] = self.id
    hash['json'] = ActiveSupport::JSON.decode(self.json)
    hash['trackname'] = self.trackname
    hash['username'] = self.username
    hash['imagedata'] = self.imagedata 
    hash['length'] = self.length
    hash['likes'] = self.likes
    hash['created_at'] = self.created_at

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

  def previous(sorted_by)
    case sorted_by
      when 'created_at'
        self.class.first(:conditions => ['created_at < ?', self.created_at], :limit => 1, :order => "created_at DESC") 
      when 'likes'
        self.class.first(:conditions => ['likes < ?', self.likes], :limit => 1, :order => "likes DESC") 
      when 'username'
        self.class.first(:conditions => ['username < ?', self.username], :limit => 1, :order => "username DESC") 
      when 'trackname'
        self.class.first(:conditions => ['trackname < ?', self.trackname], :limit => 1, :order => "trackname DESC")
      else
        self.class.first(:conditions => ['created_at < ?', self.created_at], :limit => 1, :order => "created_at DESC")
    end
  end

  def next(sorted_by)
    case sorted_by
      when 'created_at'
        self.class.first(:conditions => ['created_at > ?', self.created_at], :limit => 1, :order => "created_at ASC") 
      when 'likes'
        self.class.first(:conditions => ['likes > ?', self.likes], :limit => 1, :order => "likes ASC") 
      when 'username'
        self.class.first(:conditions => ['username > ?', self.username], :limit => 1, :order => "username ASC") 
      when 'trackname'
        self.class.first(:conditions => ['trackname > ?', self.trackname], :limit => 1, :order => "trackname ASC")
      else
        self.class.first(:conditions => ['created_at > ?', self.created_at], :limit => 1, :order => "created_at ASC")
    end
  end

end
