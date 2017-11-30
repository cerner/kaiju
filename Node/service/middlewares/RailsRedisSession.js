import Promise from 'bluebird';
import Marshal from 'marshal';
import redis from '../utils/RedisProvider';

class RailsSession {
  constructor(id) {
    this.id = id;
    this.cached_session = null;
    this.client = redis;
  }

  session() {
    if (this.cached_session) {
      return Promise.resolve(this.cached_session);
    }

    return this.client().get(`cache:${this.id}`).then((value) => {
      if (value) {
        this.cached_session = new Marshal(value).parsed;
      }
      return this.cached_session;
    });
  }
}

export default function fn(name) {
  return function railsRedisSessionMiddleware(req, res, next) {
    // req.cookies should be available from cookie-parser
    if (req.cookies && req.cookies[name]) {
      req.railsSession = new RailsSession(req.cookies[name]);
    }
    next();
  };
}
