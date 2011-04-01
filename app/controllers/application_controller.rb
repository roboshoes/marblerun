class ApplicationController < ActionController::Base
  protect_from_forgery

  after_filter :set_access_control_headers
  before_filter :catch_options_requests
   
  def set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Request-Method'] = '*'
  end

  def catch_options_requests
    render :nothing => true, :status => 200 if request.method == :options
  end
end
