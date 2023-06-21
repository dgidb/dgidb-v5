server "100.21.172.112", user: 'ubuntu', roles: %w{web db app}

set :branch, 'staging'
set :rbenv_ruby, '3.1.2'

set :rails_env, 'production'

set :linked_files, fetch(:linked_files, []).push('config/master.key')

set :ssh_options, {
    keys: [ENV['DGIDB_STAGING_KEY']].compact,
    forward_agent: false,
    auth_methods: %w(publickey)
}

