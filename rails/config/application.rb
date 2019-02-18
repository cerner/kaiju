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

    redis_config = HashWithIndifferentAccess.new(::Rails.application.config_for(:redis))

    config.cache_store = :redis_store, {
      db: 0,
      password: redis_config[:password],
      namespace: "#{redis_config[:namespace]}:cache",
      host: (redis_config[:host] unless redis_config[:sentinels].present?),
      port: (redis_config[:port] unless redis_config[:sentinels].present?),
      url: (redis_config[:sentinel_url] if redis_config[:sentinel_url].present?),
      role: ('master' if redis_config[:sentinels].present?),
      sentinels: (redis_config[:sentinels] if redis_config[:sentinels].present?),
    }.compact, {
      expires_in: 90.minutes
    }

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
