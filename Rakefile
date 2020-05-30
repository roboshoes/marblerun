# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'

Marblerun::Application.load_tasks

task :clean_tracks => :environment do
  count = 0

  Track.find_each do |track|
    if track.imagedata =~ /data/
      count += 1
    end
  end

  puts count
end
