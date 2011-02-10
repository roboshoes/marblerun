require 'test_helper'

class MarbleRunTest < ActiveSupport::TestCase
  setup do
    marblerun_instance = MarbleRun.new

    marblerun_instance.total_length = 4

    marblerun_instance.save
  end

  should "increase the total track length" do
    MarbleRun.update_length 10

    assert_equal MarbleRun.first.total_length, 14
  end

  should "decrease the total track length" do
    MarbleRun.update_length -3

    assert_equal MarbleRun.first.total_length, 1
  end

  should "in- and decrease the total track length" do
    MarbleRun.update_length 34
    MarbleRun.update_length -8

    assert_equal MarbleRun.first.total_length, 30
  end
end
