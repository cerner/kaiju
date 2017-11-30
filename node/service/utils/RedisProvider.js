import Redis from 'ioredis';
import config from 'config';

export default function redisProvider() {
  return new Redis(config.get('redisUrl'), {
    keyPrefix: config.get('redisPrefix'),
  });
}
