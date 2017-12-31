import NodeCache from 'node-cache';
import PreviewCache from './PreviewCache';
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

  static createPreviewCache(projectId, workspaceId, requestor) {
    const cacheKey = `${workspaceId}:preview_cache`;
    let cache = nodeCache.get(cacheKey);

    if (cache === undefined) {
      cache = new PreviewCache(projectId, workspaceId, requestor);
      nodeCache.set(cacheKey, cache);
    }
    return cache;
  }
}

export default FsCacheFactory;
