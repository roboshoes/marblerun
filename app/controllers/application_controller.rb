class ApplicationController < ActionController::Base
  protect_from_forgery

  #app/application_controller.rb
  after_filter :set_access_control_headers
   
  def set_access_control_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Request-Method'] = '*'
  end
end
