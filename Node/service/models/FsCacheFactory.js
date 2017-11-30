import NodeCache from 'node-cache';
import FsCache from '../models/FsCache';

const nodeCache = new NodeCache({ stdTTL: 2, checkperiod: 120, useClones: false });

class FsCacheFactory {
  static create(projectId, workspaceId, cacheType, requestor) {
    const cacheKey = `${workspaceId}:${cacheType}`;
    let fsCache = nodeCache.get(cacheKey);

    if (fsCache === undefined) {
      fsCache = new FsCache(projectId, workspaceId, cacheType, requestor);
      nodeCache.set(cacheKey, fsCache);
    }
    return fsCache;
  }
}

export default FsCacheFactory;
