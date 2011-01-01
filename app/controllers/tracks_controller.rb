class TracksController < ApplicationController
  def index
    
  end

  def show

    respond_to do |format|
      format.html
      format.json do
        render :partial => "tracks/show.json"
      end
    end
  end
end
