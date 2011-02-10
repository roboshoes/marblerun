require 'test_helper'

class UnlockTest < ActiveSupport::TestCase
  should "unlock the Curve brick" do
    Unlock.create!(:brick_type => "Kicker", :is_unlocked => true, :minimum_length => 0)
    Unlock.create!(:brick_type => "Curve", :is_unlocked => false, :minimum_length => 10)

    MarbleRun.create!(:total_length => 11)

    Unlock.unlock_bricks

    assert_equal 2, Unlock.where(:is_unlocked => true).count
  end
end
