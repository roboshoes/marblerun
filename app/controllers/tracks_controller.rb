class TracksController < ApplicationController
  require "digest"
  
  before_filter :get_track, :only => [:show, :update]

  def index
    @tracks = Track.all

    respond_to do |format|
      format.html

      format.json do 
        render :partial => "tracks/index.json", :locals => { :tracks => @tracks }
      end
    end
  end

  def new
    respond_to do |format|
      format.html

      format.json do 
        render :partial => "tracks/new.json"
      end
    end
  end

  def show
    respond_to do |format|
      #format.html

      format.json do
        render :partial => "tracks/show.json", :locals => { :track => @track }
      end
    end
  end

  def create
    track = Track.new(params[:track])

    if track.valid?
      if track.save
        marble_run = MarbleRun.first
        marble_run.total_length += track.length
        marble_run.save

        Unlock.unlock_bricks

        redirect_to track
      else
        render :status => 500
      end
    else
      render :status => 500
    end
  end

  def update
    if params[:likes]
      hash_string = request.user_agent + request.ip + Date.today.to_s + @track.id.to_s
      hash = Digest::MD5.hexdigest(hash_string)

      like = Like.new(:hash => hash)

      if like.valid?
        @track.likes += 1
        @track.save
        like.save

        render :nothing => true
      else
        render :status => 500
      end
    end
  end

  def get_track
    @track = Track.find(params[:id])
  end
end
