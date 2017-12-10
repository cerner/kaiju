import path from 'path';
import cookieParser from 'cookie-parser';
import config from 'config';
import code from './service/controllers/code';
import preview from './service/controllers/preview';
import projectTypes from './service/controllers/projectTypes';
import railsSession from './service/middlewares/RailsRedisSession';
import auth from './service/middlewares/Authentication';
import csrfToken from './service/middlewares/CsrfToken';
import fullUrl from './service/middlewares/FullUrl';

export default function configure(app) {
  app.use(cookieParser());
  app.use(fullUrl());
  app.use(railsSession(config.get('cookieKey')));
  app.use(auth());
  app.use(csrfToken());

  app.set('view engine', 'pug');
  app.set('views', path.join(__dirname, '/service/views'));
  app.use('/', code);
  app.use('/', preview);
  app.use('/', projectTypes);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}
