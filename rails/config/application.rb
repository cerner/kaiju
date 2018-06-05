require_relative 'boot'

# require 'rails/all'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'sprockets/railtie'
require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Kaiju
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.x.redis_url = ENV['REDIS_URL'] || 'redis://localhost:6379/0'
    config.cache_store = :redis_store, Rails.configuration.x.session_location, { expires_in: 90.minutes }
    config.autoload_paths << Rails.root.join('lib')
    config.eager_load_paths << Rails.root.join('lib')
    # Disabling to prevent the stack logs from filling up disk space.
    # config.middleware.use(StackProf::Middleware, enabled: true, mode: :wall, interval: 1000, save_every: 5)
    config.after_initialize do
      Time.include CoreExtensions::Time::TimeExtensions
      ComponentInformation.components('terra')
    end
  end
end
