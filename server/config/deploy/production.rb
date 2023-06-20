server "52.36.252.244", user: 'ubuntu', roles: %w{web db app}

set :branch, 'deployment-automation'
set :rbenv_ruby, '3.1.4'

set :rails_env, 'production'

set :linked_files, fetch(:linked_files, []).push('config/master.key')

puts ENV['DGIDB_STAGING_KEY']

set :ssh_options, {
    keys: [ENV['DGIDB_PRODUCTION_KEY']],
    forward_agent: false,
    auth_methods: %w(publickey)
}
