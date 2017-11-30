require 'rails_helper'

describe 'Redisdb' do
  context 'RedisDb' do
    it 'should have no leaked data in the database' do
      expect(Redis::Objects.redis.keys('*')).to eq([])
    end
  end
end
