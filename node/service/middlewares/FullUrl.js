import url from 'url';

export default function fn() {
  return function fullUrlMiddleware(req, res, next) {
    req.fullUrl = function fullUrl() {
      return url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl,
      });
    }
    next();
  }
}
