class PagesController < ApplicationController
  def manifest
    manifest = Hash.new

    manifest['name'] = 'MARBLE RUN'
    manifest['description'] = "What is MARBLE RUN all about? It's about fun and easy gameplay. It's about creativeness and playfulness. It's about being a part of a big piece, actually a big marble run. Everyone is invited to build a track and add it to the big marble run. By doing so we will all create the longest marble run ever in history. The longer the run gets, the more special bricks will be available allowing us to build even more creative and awesome tracks.

Long story short - it's all about building stuff like we all did when we were little kids."
    manifest['developer'] = Hash.new
    manifest['developer']['name'] = 'MARBLE RUN Team'
    manifest['developer']['url'] = ''
    manifest['icons'] = Hash.new
    manifest['icons']['128'] = ''
    manifest['installs_allowed_from'] = ['*']

    render :partial => "pages/manifest.json", :locals => { :manifest => manifest }
  end
end

#, :content_type => 'application/x-web-app-manifest+json'