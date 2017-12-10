import config from 'config';
import Requester from '../../../service/utils/ServiceRequester';

describe('ServiceRequester', () => {
  describe('constructor', () => {
    it('constructs a requester', () => {
      const cookies = { [config.get('cookieKey')]: 'cookie' };
      const req = {
        fullUrl: () => 'derp',
      };
      const requester = new Requester(cookies, req);
      expect(requester.sessionName).toBe(config.get('cookieKey'));
      expect(requester.sessionId).toBe('cookie');
      expect(requester.requestPromise).toBeDefined();
      expect(requester.baseURL).toBe('http://localhost:3000');
    });

    it('constructs a requester with undefined config', () => {
      const cookies = { [config.get('cookieKey')]: 'cookie' };
      const oldHasFunc = config.has;
      config.has = () => false;
      const req = {
        fullUrl: () => 'derp',
      };
      const requester = new Requester(cookies, req);
      config.has = oldHasFunc;

      expect(requester.sessionName).toBe(config.get('cookieKey'));
      expect(requester.sessionId).toBe('cookie');
      expect(requester.requestPromise).toBeDefined();
      expect(requester.baseURL).toBe('derp');
    });
  });

  describe('request', () => {
    it('calls request with created options', (done) => {
      const cookies = { [config.get('cookieKey')]: 'cookie' };
      const req = {
        fullUrl: () => 'derp',
      };
      const requester = new Requester(cookies, req);

      requester.requestPromise = (options) => {
        expect(options.url.href).toBe('http://localhost:3000/derp');
        expect(options.headers.Cookie).toBe(`${config.get('cookieKey')}=cookie`);
        expect(options.json).toBe(true);

        return Promise.resolve('herp');
      };

      requester.request('/derp').then((response) => {
        expect(response).toBe('herp');
        done();
      });
    });
  });
});
