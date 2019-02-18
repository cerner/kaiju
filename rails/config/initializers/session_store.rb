# Be sure to restart your server when you modify this file.

redis_config = HashWithIndifferentAccess.new(::Rails.application.config_for(:redis))

Kaiju::Application.config.session_store :redis_store,
                                        servers: [{
                                          db: 0,
                                          password: redis_config[:password],
                                          namespace: "#{redis_config[:namespace]}:cache",
                                          host: (redis_config[:host] unless redis_config[:sentinels].present?),
                                          port: (redis_config[:port] unless redis_config[:sentinels].present?),
                                          url: (redis_config[:sentinel_url] if redis_config[:sentinel_url].present?),
                                          role: ('master' if redis_config[:sentinels].present?),
                                          sentinels: (redis_config[:sentinels] if redis_config[:sentinels].present?),
                                        }.compact],
                                        key: Rails.configuration.x.cookie_key,
                                        expires_in: 90.minutes
