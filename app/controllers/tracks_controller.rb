class TracksController < ApplicationController
  require "digest"
  
  before_filter :get_track, :only => [:show, :update, :previous, :next]

  def get_track
    begin
      @track = Track.find(params[:id])

      if !@track.active
        @track = nil
      end
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
        @track = @track.previous
      rescue ActiveRecord::RecordNotFound
        @track = nil
      end
    end

    track_response
  end

  def next
    if @track
      begin
        @track = @track.next
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
        track.flags = 0
        track.likes = 0

        if track.valid?
          track.clean_names

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

  def info
    total_length = MarbleRun.first.total_length
    last_unlock = Unlock.where("is_unlocked = ?", true).order("minimum_length DESC").first
    next_unlock = Unlock.where("is_unlocked = ?", false).order("minimum_length ASC").first
    latest_track = Track.where("active = ?", true).order("created_at DESC").first

    if last_unlock && next_unlock
      needed_length = next_unlock.minimum_length - last_unlock.minimum_length
      current_length = total_length - last_unlock.minimum_length
      
      percentage = current_length.to_f / needed_length.to_f

      info_hash = Hash.new

      info_hash['latest_track'] = latest_track.json_track
      info_hash['total_length'] = total_length
      info_hash['percentage'] = percentage

      respond_to do |format|
        format.html do
          render :partial => "tracks/info.json", :locals => { :info_hash => info_hash }
        end

        format.json do
          render :partial => "tracks/info.json", :locals => { :info_hash => info_hash }
        end
      end
    end
      # TODO: return a 100%?
  end

  ###################################
  def index
    if params[:page]
      page = params[:page]
    else
      page = 1
    end

    @tracks = Track.paginate :page => page, :conditions => ['active = ?', true], :order => 'created_at DESC'

    tracks = Array.new

    @tracks.each do |track|
      tracks.push track.json_track
    end

    response_hash = Hash.new

    response_hash['mode'] = "overview"
    response_hash['tracks'] = tracks
    response_hash['current_page'] = @tracks.current_page
    response_hash['total_pages'] = @tracks.total_pages

    respond_to do |format|
      format.html  #do 
        #render :partial => "tracks/index.json", :locals => { :response_hash => response_hash }
      #end

      format.json do 
        render :partial => "tracks/index.json", :locals => { :response_hash => response_hash }
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

        render :nothing => true, :status => 200
      else
        render :nothing => true, :status => 500
      end
    elsif params[:flags]
      hash_string = request.user_agent + request.ip + Date.today.to_s + @track.id.to_s
      hash = Digest::MD5.hexdigest(hash_string)

      flag = Flag.new(:hash => hash)

      if flag.valid?
        @track.flags += 1

        if @track.flags > 5 && @track.flags > @track.likes / 10
          @track.active = false
        end

        @track.save
        flag.save

        render :nothing => true, :status => 200
      else
        render :nothing => true, :status => 500
      end
    else
      render :nothing => true, :status => 500
    end
  end
end
