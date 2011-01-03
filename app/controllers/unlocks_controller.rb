class UnlocksController < ApplicationController
  def index
    @unlocks = Unlock.where(:is_unlocked => true)

    render :partial => "unlocks/index.json", :locals => { :unlocks => @unlocks }
  end
end