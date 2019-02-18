require 'connection_pool'
require 'redis-namespace'

redis_config = HashWithIndifferentAccess.new(::Rails.application.config_for(:redis))

Redis::Objects.redis = ConnectionPool.new(size: 50, timeout: 5) {
  Redis::Namespace.new(
    redis_config[:namespace], 
    redis: Redis.new({                                          
      db: 0,
      password: redis_config[:password],
      host: (redis_config[:host] unless redis_config[:sentinels].present?),
      port: (redis_config[:port] unless redis_config[:sentinels].present?),
      url: (redis_config[:sentinel_url] if redis_config[:sentinel_url].present?),
      role: ('master' if redis_config[:sentinels].present?),
      sentinels: (redis_config[:sentinels] if redis_config[:sentinels].present?),
    }.compact)
  )
}
