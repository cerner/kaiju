# Be sure to restart your server when you modify this file.

Kaiju::Application.config.session_store :redis_store,
                                        servers: Rails.configuration.x.session_location,
                                        key: Rails.configuration.x.cookie_key,
                                        expires_in: 90.minutes
