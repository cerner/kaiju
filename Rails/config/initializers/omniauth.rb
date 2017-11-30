# Monkey patch an active strategies array on the OmniAuth class
active_strategies = []
OmniAuth.instance_variable_set(:@active_strategies, active_strategies)
OmniAuth.define_singleton_method(:active_strategies) do
  OmniAuth.instance_variable_get(:@active_strategies)
end

Rails.application.config.middleware.use OmniAuth::Builder do
  # include the open id provider only if an identifier is provided.
  if Rails.application.secrets.open_id_identifier
    # register the provider strategy
    active_strategies << 'open_id'
    provider :openid, identifier: Rails.application.secrets.open_id_identifier
  end

  # if no auth strategies are provided, and the app is launched in dev or specifically overriden, use the mock provider
  if (!Rails.env.production? ||
     ENV['KAIJU_ALLOW_NO_AUTH'] == 'i_accept_the_risk_of_running_with_no_authentication') &&
     OmniAuth.active_strategies.count.zero?
    # register the provider strategy
    active_strategies << 'developer'
    provider :developer
  end
end
