import FsCacheFactory from '../../../service/models/FsCacheFactory';

describe('FsCacheFactory', () => {
  it('creates a fs and returns the cached fs', () => {
    const fsCache = FsCacheFactory.create('123', '456', 'derp', undefined);
    expect(fsCache).toBeDefined;
    fsCache.workspaceNameVal = 'name';
    const fsCache2 = FsCacheFactory.create('123', '456', 'derp', undefined);
    expect(fsCache2.workspaceNameVal).toBe('name');

    fsCache.client.disconnect();
  });
});
