set :puma_roles, -> { :web }
set :puma_systemd_unit_name, 'puma'

namespace :puma do

  desc 'Stop puma'
  task :stop do
    on roles fetch(:puma_roles) do
      execute :sudo, :systemctl, 'stop', fetch(:puma_systemd_unit_name)
    end
  end

  desc 'Start puma'
  task :start do
    on roles fetch(:puma_roles) do
      execute :sudo, :systemctl, 'start', fetch(:puma_systemd_unit_name)
    end
  end

  desc 'Restart puma'
  task :restart do
    on roles fetch(:puma_roles) do
      execute :sudo, :systemctl, 'restart', fetch(:puma_systemd_unit_name)
    end
  end
end

after 'deploy:finished', 'puma:restart'

