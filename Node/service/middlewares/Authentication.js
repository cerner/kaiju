import url from 'url';

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl,
  });
}

export default function fn(redirectUrl) {
  return function authMiddleware(req, res, next) {
    req.railsSession.session().then((session) => {
      if (!session || !session.user_id) {
        res.redirect(`${redirectUrl}?origin=${fullUrl(req)}`);
      } else {
        next();
      }
    });
  };
}
