import config from 'config';
import Requester from '../../../service/utils/ServiceRequester';

describe('ServiceRequester', () => {
  it('constructs a requester', () => {
    const cookies = { [config.get('cookieKey')]: 'cookie' };
    const req = new Requester(cookies);
    expect(req.sessionName).toBe(config.get('cookieKey'));
    expect(req.sessionId).toBe('cookie');
    expect(req.requestPromise).toBeDefined();
  });

  it('calls request with created options', (done) => {
    const cookies = { [config.get('cookieKey')]: 'cookie' };
    const req = new Requester(cookies);

    req.requestPromise = (options) => {
      expect(options.url.href).toBe('http://localhost:3000/derp');
      expect(options.headers.Cookie).toBe(`${config.get('cookieKey')}=cookie`);
      expect(options.json).toBe(true);

      return Promise.resolve('herp');
    };

    req.request('/derp').then((response) => {
      expect(response).toBe('herp');
      done();
    });
  });
});
