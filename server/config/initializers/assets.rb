Rails.application.config.assets.precompile += [
  'graphiql/rails/application.css',
  'graphiql/rails/application.js'
] if Rails.env.development?
