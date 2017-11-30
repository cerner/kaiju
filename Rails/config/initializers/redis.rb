require 'connection_pool'
require 'redis-namespace'

Redis::Objects.redis = ConnectionPool.new(size: 5, timeout: 5) {
  Redis::Namespace.new(Rails.configuration.x.redis_prefix, redis: Redis.new)
}
