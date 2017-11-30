import redis from '../../../service/utils/RedisProvider';

describe('RedisProvider', () => {
  it('creates a redis provider', () => {
    const client = redis();
    expect(client.options.keyPrefix).toBe('kaiju:test:');
    expect(client.options.db).toBe(0);
    expect(client.options.host).toBe('localhost');
    expect(client.options.port).toBe(6379);

    client.disconnect();
  });
});
