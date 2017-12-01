import config from 'config';
import redis from '../utils/RedisProvider';

function reviveBuffer(key, value) {
  if (
    value !== null &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'Buffer' &&
    'data' in value &&
    Array.isArray(value.data)) {
    return new Buffer(value.data);
  }
  return value;
}

function setupVal(klass, key, options) {
  let value;
  return () => {
    if (value === undefined) {
      let prefixedKey = key;

      if (options.keyPrefix) {
        prefixedKey = `${options.keyPrefix}${key}`;
      }
      return klass.client.get(prefixedKey).then((result) => {
        if (options.json) {
          return JSON.parse(result, reviveBuffer);
        }
        return result;
      }).then((result) => {
        if (options.parse) {
          return options.parse(result);
        }
        return result;
      }).then((result) => {
        value = result;
        return value;
      });
    }
    return Promise.resolve(value);
  };
}

const expireation = 302400; // 24 hours in seconds

class FsCache {
  constructor(projectId, workspaceId, cacheType, requestor) {
    this.projectId = projectId;
    this.workspaceId = workspaceId;
    this.cacheType = cacheType;
    this.keyBase = `workspace:${this.workspaceId}:${this.cacheType}:`;
    this.client = redis();
    this.requestor = requestor;

    this.existsVal = undefined;
    this.isCurrentVal = undefined;
    this.workspaceName = setupVal(this, 'workspace_name', {
      keyPrefix: this.keyBase,
    });
    this.manifest = setupVal(this, 'manifest', {
      json: true,
      keyPrefix: this.keyBase,
    });
    this.entry = setupVal(this, 'entry', {
      json: true,
      keyPrefix: this.keyBase,
    });
    this.timestamp = setupVal(this, 'timestamp', {
      parse: result => new Date(result),
      keyPrefix: this.keyBase,
    });
    this.fsData = setupVal(this, 'data', {
      json: true,
      keyPrefix: this.keyBase,
    });
    if (config.get('disableFsCache')) {
      this.isCurrentVal = false;
    }
  }

  isCurrent() {
    // TODO isCurrent should be cleaned up
    if (this.isCurrentVal === undefined) {
      return this.exists().then((exists) => {
        if (exists) {
          const url = `/projects/${this.projectId}/workspaces/${this.workspaceId}`;
          return Promise.all([
            this.requestor.request(url),
            this.timestamp(),
          ]).then(([workspace, fsTimestamp]) => {
            const workspaceUpdateDateTime = new Date(workspace.update_date_time);
            this.isCurrentVal = fsTimestamp > workspaceUpdateDateTime;
            return this.isCurrentVal;
          });
        }
        return false;
      });
    }
    return Promise.resolve(this.isCurrentVal);
  }

  exists() {
    // TODO exists should be cleaned up.
    if (this.existsVal === undefined || this.existsVal === false) {
      return this.client.exists(`${this.keyBase}timestamp`).then((exists) => {
        this.existsVal = exists === 1;
        return this.existsVal;
      });
    }
    return Promise.resolve(this.existsVal);
  }

  cacheFs(workspaceName, manifest, data, entry = null) {
    // TODO: Pipeline this redis work
    this.client.set(`${this.keyBase}workspace_name`, workspaceName, 'EX', expireation);
    this.client.set(`${this.keyBase}data`, JSON.stringify(data), 'EX', expireation);
    this.client.set(`${this.keyBase}manifest`, JSON.stringify(manifest), 'EX', expireation);
    if (entry !== null) {
      this.client.set(`${this.keyBase}entry`, JSON.stringify(entry), 'EX', expireation);
    }
    this.client.set(`${this.keyBase}timestamp`, new Date().toISOString(), 'EX', expireation);
  }

  renew() {
    this.client.expire(`${this.keyBase}workspace_name`, expireation);
    this.client.expire(`${this.keyBase}data`, expireation);
    this.client.expire(`${this.keyBase}manifest`, expireation);
    this.client.expire(`${this.keyBase}entry`, expireation);
    this.client.expire(`${this.keyBase}timestamp`, expireation);
  }
}

export default FsCache;
