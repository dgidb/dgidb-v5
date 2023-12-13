require_relative 'deploy/sidekiq'
require_relative 'deploy/puma'

# config valid for current version and patch releases of Capistrano
lock "~> 3.17.0"

set :application, "dgidb"
set :repo_url, "https://github.com/dgidb/dgidb-v5.git"

set :deploy_to, '/var/www/dgidb/'

set :rbenv_type, :user

set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads', 'public/data', 'storage')
set :linked_files, fetch(:linked_files, []).push('config/master.key')

set :repo_tree, 'server'

set :migration_role, :web
set :assets_roles, []

