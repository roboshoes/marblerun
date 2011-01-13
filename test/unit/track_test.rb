require 'test_helper'

class TrackTest < ActiveSupport::TestCase
  context "validations with basic unlocks" do
    setup do
      @tracks = Array.new

      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":0,"col":0},"20":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":0}}}');
      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":0,"col":0},"19":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":0}}}');
      @tracks.push('{"bricks":{"20":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":0}}}');
      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":1,"col":0},"20":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":0}}}');
      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":0,"col":0},"20":{"type":"Ramp","rotation":0,"row":2,"col":0}}}');
      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":0,"col":0},"20":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":1}}}');
    
      bricks = {'Brick' => true, 'Ramp' => true, 'Line' => true, 'Curve' => true, 'Kicker' => true}

      bricks.each do |key, value|
        Unlock.create!( {:minimum_length => 0, :is_unlocked => value, :brick_type => key} )
      end
  end

    should "be a valid track" do
      track = Track.new(:json => @tracks[0])
      track.save
      
      assert track.valid?, track.errors.to_s
    end

    should "should be a valid track although there is duplication" do
      track_one = Track.new(:json => @tracks[0])
      track_two = Track.new(:json => @tracks[0])

      track_one.save

      assert track_one.valid?, track_one.errors.to_s
      assert track_two.valid?, track_two.errors.to_s
    end

    should "be another valid track" do
      track_one = Track.new(:json => @tracks[0])
      track_two = Track.new(:json => @tracks[1])

      track_one.save

      assert track_one.valid?, track_one.errors.to_s
      assert track_two.valid?, track_two.errors.to_s
    end

    should "not add a track due to missing ball" do
      track = Track.new(:json => @tracks[2])

      assert !track.valid?, track.errors.to_s
    end

    should "not add a track due to wrong ball position" do
      track = Track.new(:json => @tracks[3])

      assert !track.valid?, track.errors.to_s
    end

    should "not add a track due to missing exit" do
      track = Track.new(:json => @tracks[4])

      assert !track.valid?, track.errors.to_s
    end

    should "not add a track due to wrong ball exit" do
      track = Track.new(:json => @tracks[5])

      assert !track.valid?, track.errors.to_s
    end
  end

  context "validations with special unlocks" do
    setup do
      @tracks = Array.new

      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":2,"col":3},"20":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":12,"col":0}}}');
      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":2,"col":3},"20":{"type":"Breaker","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":12,"col":0}}}');
      
      bricks = {'Brick' => true, 'Ramp' => true, 'Line' => true, 'Curve' => true, 'Kicker' => true, 'Ball' => true, 'Exit' => true, 'Breaker' => false}

      bricks.each do |key, value|
        Unlock.create!( {:minimum_length => 0, :is_unlocked => value, :brick_type => key} )
      end
    end

    should "be a valid track" do
      track = Track.new(:json => @tracks[0])

      assert track.valid?, track.errors.to_s
    end

    should "be an invalid track" do
      track = Track.new(:json => @tracks[1])

      assert !track.valid?, track.errors.to_s
    end
  end

  context "after_save validations" do
    setup do 
      marblerun = MarbleRun.new
      marblerun.total_length = 10
      marblerun.save

      @valid_track_json = '{"bricks":{"0":{"type":"Ball","rotation":0,"row":0,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":0}}}'

      unlock = Unlock.new
      unlock.brick_type = "Kicker"
      unlock.minimum_length = 10
      unlock.is_unlocked = false
      unlock.save
    end

    should "update total_length and unlock brick" do
      track = Track.new
      track.json = @valid_track_json
      track.length = 22
      track.save
      
      assert_equal MarbleRun.first.total_length, 32
      assert_equal Unlock.where(:is_unlocked => true).count, 1  
    end
  end

  context "before_save validations" do
    setup do
      @valid_track_json = '{"bricks":{"0":{"type":"Ball","rotation":0,"row":0,"col":0},"140":{"type":"Exit","rotation":0,"row":14,"col":0}}}'
    end

    should "save the track as given" do
      track = Track.new
      track.json = @valid_track_json
      track.length = 100
      track.username = "David"
      track.trackname = "Rollercoaster"
      track.save

      assert_equal Track.first.length, 100
      assert_equal Track.first.username, "David"
      assert_equal Track.first.trackname, "Rollercoaster"
      assert_equal Track.first.active, true
      assert_equal Track.first.flags, 0
      assert_equal Track.first.likes, 0
    end

    should "save the track with maximum track length" do
      track = Track.new
      track.json = @valid_track_json
      track.length = 1400
      track.save

      assert_equal Track.first.length, 999.9
    end

    should "save the track with minimum track length" do
      track = Track.new
      track.json = @valid_track_json
      track.length = -100
      track.save

      assert_equal Track.first.length, 1.4
    end

    should "save the track with non-default names" do
      track = Track.new
      track.json = @valid_track_json
      track.trackname = "TRACK NAME"
      track.username = "YOUR NAME"
      track.save

      assert_not_equal Track.first.trackname, "TRACK NAME"
      assert_not_equal Track.first.username, "YOUR NAME"
    end
  end
end
