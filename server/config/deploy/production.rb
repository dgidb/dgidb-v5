server "52.36.252.244", user: 'ubuntu', roles: %w{web db app}

set :branch, 'main'
set :rbenv_ruby, '3.1.4'

set :rails_env, 'production'

set :linked_files, fetch(:linked_files, []).push('config/master.key')

if !ENV['CI']
  set :ssh_options, {
      keys: [ENV['DGIDB_PROD_KEY']].compact,
      forward_agent: false,
      auth_methods: %w(publickey)
  }
end
