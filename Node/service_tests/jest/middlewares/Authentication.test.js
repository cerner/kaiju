import auth from '../../../service/middlewares/Authentication';

describe('authMiddleware', () => {
  it('should call the next function', (done) => {
    const redirectUrl = 'derp';
    const mockReq = {
      protocol: 'http',
      host: 'derp.com',
      originalUrl: '/herp/',
      railsSession: {
        session: () => Promise.resolve({ user_id: '12345' }),
      },
    };
    const mockRes = undefined;
    auth(redirectUrl)(mockReq, mockRes, () => {
      done();
    });
  });

  it('should redirect if no user id is found in the session', (done) => {
    const redirectUrl = 'derp';
    const mockReq = {
      protocol: 'http',
      originalUrl: '/herp/',
      get: () => 'derp.com',
      railsSession: {
        session: () => Promise.resolve({ some: 'junk' }),
      },
    };
    const mockRes = {
      redirect: (url) => {
        expect(url).toBe('derp?origin=http://derp.com/herp/');
        done();
      },
    };
    auth(redirectUrl)(mockReq, mockRes);
  });

  it('should redirect if there is no session', (done) => {
    const redirectUrl = 'derp';
    const mockReq = {
      protocol: 'http',
      originalUrl: '/herp/',
      get: () => 'derp.com',
      railsSession: {
        session: () => Promise.resolve(undefined),
      },
    };
    const mockRes = {
      redirect: (url) => {
        expect(url).toBe('derp?origin=http://derp.com/herp/');
        done();
      },
    };
    auth(redirectUrl)(mockReq, mockRes);
  });
});

