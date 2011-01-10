class UnlocksController < ApplicationController
  def index
    @unlocks = Unlock.where(:is_unlocked => true)
    @locks = Unlock.where(:is_unlocked => false)

    unlocks_array = Array.new
    locks_array = Array.new

    @unlocks.each do |unlock|
      unlocks_array.push unlock.brick_type
    end

    @locks.each do |lock|
      locks_array.push lock.brick_type
    end

    hash = Hash.new
    hash['unlocks'] = unlocks_array
    hash['locks'] = locks_array

    render :partial => "unlocks/index.json", :locals => { :hash => hash }
  end
end