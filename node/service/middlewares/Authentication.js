import config from 'config';

export default function fn() {
  return function authMiddleware(req, res, next) {
    req.railsSession.session().then((session) => {
      if (!session || !session.user_id) {
        let redirectUrl = req.fullUrl();
        if (config.has('authRedirectUrl')) {
          redirectUrl = config.get('authRedirectUrl');
        }
        res.redirect(`${redirectUrl}/auth?origin=${req.fullUrl()}`);
      } else {
        next();
      }
    });
  };
}
