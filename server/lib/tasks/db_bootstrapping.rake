require 'rbconfig'
require_relative '../utils/snapshot_helpers'

include Utils::SnapshotHelpers

namespace :dgidb do
  if Rails.env.production?
    data_submodule_path = File.join(Rails.root, 'public', 'data')
  else
    data_submodule_path = File.join(Rails.root, 'data')
  end
  data_file = File.join(data_submodule_path, 'dgidb_v5_latest.sql')
  database_name = Rails.configuration.database_configuration[Rails.env]['database']
  host = Rails.configuration.database_configuration[Rails.env]['host']
  username = Rails.configuration.database_configuration[Rails.env]['username']

  desc 'Remove a source from the database given the source_db_name'
  task :remove_source, [:source_db_name] => :environment do |_, args|
    Utils::Database.delete_source(args[:source_db_name])
  end

  desc 'set up path for macs running Postgres.app'
  task :setup_path do
    if RbConfig::CONFIG['host_os'] =~ /darwin/
      if File.exist?( '/Applications/Postgres.app' )
        puts 'Using Postgres.app'
        ENV['PATH'] = "/Applications/Postgres.app/Contents/Versions/latest/bin:#{ENV['PATH']}"
        return
      elsif File.exist?('/opt/homebrew/bin/psql')
        puts 'Using Hombrew-installed psql'
        ENV['PATH'] = "/opt/homebrew/bin/:#{ENV['PATH']}"
        return
      end
    end
    puts 'Warning: unable to ensure psql is available on $PATH'
  end

  desc 'create a dump of the current local database'
  task dump_local: ['setup_path'] do
    if username.blank?
      system "pg_dump -T \"schema_migrations|ar_internal_metadata\" -E UTF8 -a -f #{data_file} -h #{host} #{database_name}"
    else
      system "pg_dump -T \"schema_migrations|ar_internal_metadata\" -E UTF8 -a -f #{data_file} -U #{username} -h #{host} #{database_name}"
    end
  end

  desc 'load a local db dump and schema into the local db, blowing away what is currently there'
  task :load_from_local, [:db_dump] => ['setup_path', 'db:drop', 'db:create', 'db:structure:load'] do |_t, args|
    raise 'You must supply a path to a DB dump' unless args[:db_dump]

    system "psql -h #{host} -d #{database_name} -f #{args[:db_dump]}"
    Rails.cache.clear
  end

  desc 'load the latest available remote db dump and schema into the local db, blowing away what is currently there'
  task load_from_remote: ['setup_path', 'db:drop', 'db:create', 'db:structure:load'] do
    download_data_dump(data_file)
    system "psql -h #{host} -d #{database_name} -f #{data_file}"
    Rails.cache.clear
  end
end
