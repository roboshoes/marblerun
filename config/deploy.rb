require 'mina/bundler'
require 'mina/rails'
require 'mina/git'

set :domain, 'pandora.stravid.com'
set :repository, 'git@github.com:MathiasPaumgarten/marblerun.git'
set :branch, 'master'
set :user, 'deployer'
set :port, '5020'
set :forward_agent, true
set :shared_paths, ['.env.production', 'log']
set :deploy_to, '/home/deployer/apps/marblerun'
set :rails_env, 'production'

task :environment do
end

task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/log"]

  queue! %[mkdir -p "#{deploy_to}/#{shared_path}/tmp"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/#{shared_path}/tmp"]
end

task :deploy => :environment do
  deploy do
    invoke 'git:clone'
    invoke 'deploy:link_shared_paths'
    invoke 'bundle:install'
    invoke 'rails:db_migrate'
    queue 'bundle exec jammit --base-url www.marblerun.at RAILS_ENV=production'
    invoke 'deploy:cleanup'

    to :launch do
      queue! "sudo systemctl restart marblerun"
    end
  end
end
