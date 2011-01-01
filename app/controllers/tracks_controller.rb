class TracksController < ApplicationController
  before_filter :get_track, :only => [:show, :update]

  def index
  end

  def new
  end

  def show
    respond_to do |format|
      format.html
      format.json do
        render :partial => "tracks/show.json", :locals => { :track => @track }
      end
    end
  end

  def create
    track = Track.new(params[:track])

    if track.valid?
      if track.save
        redirect_to track
      else
        render :status => 500
      end
    else
      render :status => 500
    end
  end

  def get_track
    @track = Track.find(params[:id])
  end
end
