class TracksController < ApplicationController
  require "digest"
  
  before_filter :get_track, :only => [:show, :update, :previous, :next]

  def get_track
    begin
      @track = Track.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      @track = nil
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
    track_response
  end

  def previous
    if @track
      begin
        @track = @track.previous(params[:sorting])
      rescue ActiveRecord::RecordNotFound
        @track = nil
      end
    end

    track_response
  end

  def next
    if @track
      begin
        @track = @track.next(params[:sorting])
      rescue ActiveRecord::RecordNotFound
        @track = nil
      end
    end

    track_response
  end

  def create
    respond_to do |format|
      format.html

      format.json do
        track = Track.new(params[:track])
        track.active = true
        track.blames = 0
        track.likes = 0

        if track.valid?
          if track.save
            marble_run = MarbleRun.first
            marble_run.total_length += track.length
            marble_run.save

            Unlock.unlock_bricks

            render :partial => "tracks/show.json", :locals => { :track => track }
          else
            render :partial => "tracks/errors/unable_to_save.json", :status => 500
          end
        else
          render :partial => "tracks/errors/invalid_track.json", :status => 400
        end
      end
    end
  end

  def track_response
    if @track
      respond_to do |format|
        format.html

        format.json do
          render :partial => "tracks/show.json", :locals => { :track => @track }
        end
      end
    else
      respond_to do |format|
        format.html do
          render :status => 404
        end

        format.json do
          render :partial => "tracks/errors/not_found.json", :status => 404
        end
      end
    end    
  end




  ###################################
  def index
    @tracks = Track.all

    respond_to do |format|
      format.html

      format.json do 
        render :partial => "tracks/index.json", :locals => { :tracks => @tracks }
      end
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
        render :nothing => true, :status => 500
      end
    end
  end
end
