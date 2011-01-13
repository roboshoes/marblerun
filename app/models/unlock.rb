class Unlock < ActiveRecord::Base
  def self.unlock_bricks
    marblerun = MarbleRun.first

    if marblerun
      unlocks = Unlock.where("minimum_length <= ?", marblerun.total_length)

      unlocks.each do |unlock| 
        unlock.is_unlocked = true;
        unlock.save
      end
    end
  end
end
