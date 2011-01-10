class InsertSpecialBricks < ActiveRecord::Migration
  def self.up
    unlock = Unlock.new( { :minimum_length => 1, :is_unlocked => false, :brick_type => "Spring"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 500, :is_unlocked => false, :brick_type => "OneWay"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 10000, :is_unlocked => false, :brick_type => "Beamer"} )
    unlock.save

    unlock = Unlock.new( { :minimum_length => 100000, :is_unlocked => false, :brick_type => "Breaker"} )
    unlock.save
  end

  def self.down
    Unlock.where(:brick_type => "Spring").first.destroy
    Unlock.where(:brick_type => "OneWay").first.destroy
    Unlock.where(:brick_type => "Beamer").first.destroy
    Unlock.where(:brick_type => "Breaker").first.destroy
  end
end
