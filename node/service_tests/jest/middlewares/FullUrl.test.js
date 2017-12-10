import fullUrl from '../../../service/middlewares/FullUrl';

describe('fullUrlMiddleware', () => {
  it('should add a method to get the full url', (done) => {
    const mockReq = {
      protocol: 'http',
      get: () => 'derp.com',
      originalUrl: '/herp',
    };
    const mockRes = undefined;
    fullUrl()(mockReq, mockRes, () => {
      expect(mockReq.fullUrl()).toBe('http://derp.com/herp');
      done();
    });
  });
});
