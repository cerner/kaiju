import config from 'config';
import auth from '../../../service/middlewares/Authentication';

describe('authMiddleware', () => {
  it('should call the next function', (done) => {
    const mockReq = {
      fullUrl: () => 'http://derp.com/herp/',
      railsSession: {
        session: () => Promise.resolve({ user_id: '12345' }),
      },
    };
    const mockRes = undefined;
    auth()(mockReq, mockRes, () => {
      done();
    });
  });

  it('should redirect if no user id is found in the session', (done) => {
    const oldHasFunc = config.has;
    config.has = () => false;
    const mockReq = {
      fullUrl: () => 'http://derp.com/herp',
      railsSession: {
        session: () => Promise.resolve({ some: 'junk' }),
      },
    };
    const mockRes = {
      redirect: (url) => {
        expect(url).toBe('http://derp.com/herp/auth?origin=http://derp.com/herp');
        config.has = oldHasFunc;
        done();
      },
    };
    auth()(mockReq, mockRes);
  });

  it('should redirect if there is no session', (done) => {
    const oldHasFunc = config.has;
    config.has = () => false;
    const mockReq = {
      fullUrl: () => 'http://derp.com/herp',
      railsSession: {
        session: () => Promise.resolve(undefined),
      },
    };
    const mockRes = {
      redirect: (url) => {
        expect(url).toBe('http://derp.com/herp/auth?origin=http://derp.com/herp');
        config.has = oldHasFunc;
        done();
      },
    };
    auth()(mockReq, mockRes);
  });

  it('should use the config if present', (done) => {
    const mockReq = {
      fullUrl: () => 'http://derp.com/herp',
      railsSession: {
        session: () => Promise.resolve(undefined),
      },
    };
    const mockRes = {
      redirect: (url) => {
        expect(url).toBe('http://localhost:3000/auth?origin=http://derp.com/herp');
        done();
      },
    };
    auth()(mockReq, mockRes);
  });
});

