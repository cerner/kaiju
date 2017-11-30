module.exports = {
  cookieKey: '_prod_session_id',
  railsServerUrl: process.env.KAIJU_RAILS_SERVER_URL,
  redisPrefix: 'kaiju:prod:',
  redisUrl: process.env.REDIS_URL,
  disableFsCache: false,
  authRedirectUrl: process.env.KAIJU_AUTH_REDIRECT_URL,
};
