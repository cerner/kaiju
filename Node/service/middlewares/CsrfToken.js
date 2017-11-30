import crypto from 'crypto';

/* eslint no-underscore-dangle: ["error", { "allow": ["_csrf_token"] }] */
/* eslint no-bitwise: ["error", { "allow": ["^="] }] */

export default function fn() {
  return function csrfMiddleware(req, res, next) {
    // req.railsSession should be available from railsRedisSession
    req.railsSession.session().then((session) => {
      const secret = session._csrf_token;

      let token = null;

      req.csrfToken = function csrfToken() {
        if (token) {
          return token;
        }

        if (secret == null) {
          return null;
        }

        const buffer = crypto.randomBytes(32);

        const bytes = new Buffer(secret, 'base64');
        for (let i = 0, len = buffer.length; i < len; i += 1) {
          bytes[i] ^= buffer[i];
        }

        const newBuffer = Buffer.concat([buffer, bytes]);
        token = newBuffer.toString('base64');

        return token;
      };
      next();
    });
  };
}
