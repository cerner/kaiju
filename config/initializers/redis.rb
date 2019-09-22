require 'connection_pool'
require 'redis-namespace'

redis_config = HashWithIndifferentAccess.new(::Rails.application.config_for(:redis))

Redis::Objects.redis = ConnectionPool.new(size: 50, timeout: 5) {
  Redis::Namespace.new(
    redis_config[:namespace],
    redis: Redis.new({
      db: 0,
      host: redis_config[:host],
      port: redis_config[:port],
      password: redis_config[:password],
      role: :master,
      url: redis_config[:sentinel_url],
      sentinels: redis_config[:sentinels]
    }.compact)
  )
}
