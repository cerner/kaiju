import railsSession from '../../../service/middlewares/RailsRedisSession';

describe('railsRedisSession', () => {
  it('fails to set the session retreiver because cookie name is not found', (done) => {
    const req = {
      cookies: {},
    };
    railsSession('derp')(req, undefined, () => done());
    expect(req.railsSession).toBeUndefined();
  });

  it('fails to set the session retirever because the cookie is not found', (done) => {
    const req = {};
    railsSession('derp')(req, undefined, () => done());
    expect(req.railsSession).toBeUndefined();
  });

  it('it retreives the session twice once from marshal and once from cache', (done) => {
    const id = 'id';
    const rawSession = '\x04\b{\x06:\fuser_idI"E0032182337462b330fd01fa1d9f344c3fc65a0546f04ee8c5471de2f758fc93a\x06:\x06ET';

    const req = {
      cookies: { derp: id },
    };

    railsSession('derp')(req, undefined, () => done());
    expect(req.railsSession).toBeDefined();
    req.railsSession.client = () => ({ get: () => Promise.resolve(rawSession) });

    req.railsSession.session().then((session) => {
      expect(session.user_id).toBe('0032182337462b330fd01fa1d9f344c3fc65a0546f04ee8c5471de2f758fc93a');
      req.railsSession.session().then((session2) => {
        expect(session2.user_id).toBe('0032182337462b330fd01fa1d9f344c3fc65a0546f04ee8c5471de2f758fc93a');
        done();
      });
    });
  });
});
