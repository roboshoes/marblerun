class InsertBaseBricks < ActiveRecord::Migration
  def self.up
    unlock = Unlock.new( { :minimum_length => 0, :is_unlocked => true, :brick_type => "Brick"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 0, :is_unlocked => true, :brick_type => "Ramp"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 0, :is_unlocked => true, :brick_type => "Kicker"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 0, :is_unlocked => true, :brick_type => "Curve"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 0, :is_unlocked => true, :brick_type => "Line"} )
    unlock.save
  end

  def self.down
    Unlock.where(:brick_type => "Brick").destroy
    Unlock.where(:brick_type => "Ramp").destroy
    Unlock.where(:brick_type => "Kicker").destroy
    Unlock.where(:brick_type => "Curve").destroy
    Unlock.where(:brick_type => "Line").destroy
  end
end
