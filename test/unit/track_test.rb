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
end
