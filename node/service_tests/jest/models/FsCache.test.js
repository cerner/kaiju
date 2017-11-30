import FsCache from '../../../service/models/FsCache';

describe('FsCache', () => {
  describe('constructor', () => {
    it('initializes correctely', () => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const requestor = {
        request: () => Promise.resolve('herp'),
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      expect(cache.projectId).toBe(projectId);
      expect(cache.workspaceId).toBe(workspaceId);
      expect(cache.cacheType).toBe(cacheType);
      expect(cache.requestor).toBe(requestor);
      expect(cache.keyBase).toBe('workspace:456:derp:');
      cache.client.disconnect();
    });
  });

  describe('workspace', () => {
    it('returns the workspace name', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const requestor = {
        request: () => Promise.resolve('herp'),
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.client = {
        get: (key) => {
          expect(key).toBe('workspace:456:derp:workspace_name');
          return Promise.resolve('name');
        },
      };
      cache.workspaceName().then((name) => {
        expect(name).toBe('name');
        cache.workspaceName().then((name2) => {
          expect(name2).toBe('name');
          done();
        });
      });
    });
  });

  describe('manifest', () => {
    it('returns the manifest', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const requestor = {
        request: () => Promise.resolve('herp'),
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.client = {
        get: (key) => {
          expect(key).toBe('workspace:456:derp:manifest');
          return Promise.resolve(JSON.stringify('name'));
        },
      };
      cache.manifest().then((name) => {
        expect(name).toBe('name');
        cache.manifest().then((name2) => {
          expect(name2).toBe('name');
          done();
        });
      });
    });
  });

  describe('entry', () => {
    it('returns the entry', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const requestor = {
        request: () => Promise.resolve('herp'),
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.client = {
        get: (key) => {
          expect(key).toBe('workspace:456:derp:entry');
          return Promise.resolve(JSON.stringify('name'));
        },
      };
      cache.entry().then((name) => {
        expect(name).toBe('name');
        cache.entry().then((name2) => {
          expect(name2).toBe('name');
          done();
        });
      });
    });
  });

  describe('timestamp', () => {
    it('returns the timestamp', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const expectedDate = new Date();
      const requestor = {
        request: () => Promise.resolve('herp'),
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.client = {
        get: (key) => {
          expect(key).toBe('workspace:456:derp:timestamp');
          return Promise.resolve(expectedDate.toISOString());
        },
      };
      cache.timestamp().then((date) => {
        expect(date).toEqual(expectedDate);
        cache.timestamp().then((date2) => {
          expect(date2).toEqual(expectedDate);
          done();
        });
      });
    });
  });

  describe('fsData', () => {
    it('returns the fsData', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const requestor = {
        request: () => Promise.resolve('herp'),
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.client = {
        get: (key) => {
          expect(key).toBe('workspace:456:derp:data');
          return Promise.resolve(JSON.stringify('data'));
        },
      };
      cache.fsData().then((data) => {
        expect(data).toEqual('data');
        cache.fsData().then((data2) => {
          expect(data2).toEqual('data');
          done();
        });
      });
    });
  });

  describe('isCurrent', () => {
    it('returns true for a cache newer than the workspace', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const requestor = {
        request: (url) => {
          expect(url).toBe('/projects/123/workspaces/456');
          return Promise.resolve({
            update_date_time: yesterday.toISOString(),
          });
        },
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.exists = () => Promise.resolve(true);
      cache.timestamp = () => Promise.resolve(new Date());
      cache.isCurrentVal = undefined;

      cache.isCurrent().then((current) => {
        expect(current).toBe(true);
        cache.isCurrent().then((current2) => {
          expect(current2).toBe(true);
          done();
        });
      });
    });

    it('returns false for a cache newer than the workspace', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const requestor = {
        request: (url) => {
          expect(url).toBe('/projects/123/workspaces/456');
          return Promise.resolve({
            update_date_time: new Date().toISOString(),
          });
        },
      };
      const cache = new FsCache(projectId, workspaceId, cacheType, requestor);
      cache.client.disconnect();
      cache.exists = () => Promise.resolve(true);
      cache.timestamp = () => Promise.resolve(yesterday);
      cache.isCurrentVal = undefined;

      cache.isCurrent().then((current) => {
        expect(current).toBe(false);
        cache.isCurrent().then((current2) => {
          expect(current2).toBe(false);
          done();
        });
      });
    });

    it('returns false if the cache does not exist', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';

      const cache = new FsCache(projectId, workspaceId, cacheType, undefined);
      cache.client.disconnect();
      cache.exists = () => Promise.resolve(false);
      cache.isCurrentVal = undefined;

      cache.isCurrent().then((current) => {
        expect(current).toBe(false);
        cache.isCurrent().then((current2) => {
          expect(current2).toBe(false);
          done();
        });
      });
    });
  });

  describe('exists', () => {
    it('returns true if the cache exits in the database', (done) => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const cache = new FsCache(projectId, workspaceId, cacheType, undefined);
      cache.client.disconnect();
      cache.client = {
        exists: (key) => {
          expect(key).toBe('workspace:456:derp:timestamp');
          return Promise.resolve(1);
        },
      };
      cache.exists().then((exist) => {
        expect(exist).toEqual(true);
        cache.exists().then((exist2) => {
          expect(exist2).toEqual(true);
          done();
        });
      });
    });
  });

  describe('cacheFs', () => {
    it('calls set for all data passed in', () => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const cache = new FsCache(projectId, workspaceId, cacheType, undefined);
      const mockSet = jest.fn();
      cache.client.disconnect();
      cache.client = {
        set: mockSet,
      };
      cache.cacheFs('name', 'manifest', 'data', 'entry');
      expect(mockSet.mock.calls.length).toBe(5);
    });

    it('does not call set on entry', () => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const cache = new FsCache(projectId, workspaceId, cacheType, undefined);
      const mockSet = jest.fn();
      cache.client.disconnect();
      cache.client = {
        set: mockSet,
      };
      cache.cacheFs('name', 'manifest', 'data');
      expect(mockSet.mock.calls.length).toBe(4);
    });
  });

  describe('renew', () => {
    it('calls set for all data passed in', () => {
      const projectId = '123';
      const workspaceId = '456';
      const cacheType = 'derp';
      const cache = new FsCache(projectId, workspaceId, cacheType, undefined);
      const mockSet = jest.fn();
      cache.client.disconnect();
      cache.client = {
        expire: mockSet,
      };
      cache.renew();
      expect(mockSet.mock.calls.length).toBe(5);
    });
  });
});
