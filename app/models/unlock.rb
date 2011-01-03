class Unlock < ActiveRecord::Base
  def self.unlock_bricks
    total_length = MarbleRun.first.total_length

    unlocks = Unlock.where("minimum_length <= ?", total_length)

    unlocks.each do |unlock| 
      unlock.is_unlocked = true;
      unlock.save
    end
  end
end
