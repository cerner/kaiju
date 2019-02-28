# Be sure to restart your server when you modify this file.

redis_config = HashWithIndifferentAccess.new(::Rails.application.config_for(:redis))

Kaiju::Application.config.session_store :redis_store,
                                        servers: [{
                                          db: 0,
                                          host: redis_config[:host],
                                          port: redis_config[:port],
                                          password: redis_config[:password],
                                          namespace: "#{redis_config[:namespace]}:cache",
                                          role: :master,
                                          url: redis_config[:sentinel_url],
                                          sentinels: redis_config[:sentinels]
                                        }.compact],
                                        key: Rails.configuration.x.cookie_key,
                                        expires_in: 90.minutes
