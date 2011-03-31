class UnlocksController < ApplicationController
  def index
    unlocks = Unlock.all

    unlocks_array = []
    locks_array = []

    unlocks.each do |unlock|
      if unlock.is_unlocked
        unlocks_array.push unlock.brick_type
      else
        locks_array.push unlock.brick_type
      end
    end

    hash = Hash.new
    hash['unlocks'] = unlocks_array
    hash['locks'] = locks_array

    respond_to do |format|
      format.html do 
        render :partial => "unlocks/index.json", :locals => { :hash => hash }
      end

      format.json do 
        render :partial => "unlocks/index.json", :locals => { :hash => hash }
      end
    end
  end
end