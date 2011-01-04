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
    end

    should "be a valid track" do
      track = Track.new(:json => @tracks[0])
      track.save
      
      assert track.valid?
    end

    should "should not be a valid track due to duplication" do
      track_one = Track.new(:json => @tracks[0])
      track_two = Track.new(:json => @tracks[0])

      track_one.save

      assert track_one.valid?
      assert !track_two.valid?
    end

    should "be another valid track" do
      track_one = Track.new(:json => @tracks[0])
      track_two = Track.new(:json => @tracks[1])

      track_one.save

      assert track_one.valid?
      assert track_two.valid?
    end

    should "not add a track due to missing ball" do
      track = Track.new(:json => @tracks[2])

      assert !track.valid?
    end

    should "not add a track due to wrong ball position" do
      track = Track.new(:json => @tracks[3])

      assert !track.valid?
    end

    should "not add a track due to missing exit" do
      track = Track.new(:json => @tracks[4])

      assert !track.valid?
    end

    should "not add a track due to wrong ball exit" do
      track = Track.new(:json => @tracks[5])

      assert !track.valid?
    end
  end

  context "validations with special unlocks" do
    setup do
      @tracks = Array.new

      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":2,"col":3},"20":{"type":"Ramp","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":12,"col":0}}}');
      @tracks.push('{"bricks":{"0":{"type":"Ball","rotation":0,"row":2,"col":3},"20":{"type":"Breaker","rotation":0,"row":2,"col":0},"140":{"type":"Exit","rotation":0,"row":12,"col":0}}}');
      
      bricks = {'Ball' => true, 'Exit' => true, 'Breaker' => false}

      bricks.each do |key, value|
        Unlock.create!( {:minimum_length => 0, :is_unlocked => value, :brick_type => key} )
      end
    end

    should "be a valid track" do
      track = Track.new(:json => @tracks[0])

      assert track.valid?
    end

    should "be an invalid track" do
      track = Track.new(:json => @tracks[1])

      assert !track.valid?
    end
  end
end
