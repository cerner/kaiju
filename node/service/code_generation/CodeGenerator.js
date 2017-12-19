import Promise from 'bluebird';
import MemoryFS from 'memory-fs';
import FsCacheFactory from '../models/FsCacheFactory';
import PluginManager from '../plugin_management/PluginManager';

Promise.promisifyAll(MemoryFS);

class CodeGenerator {
  constructor(projectId, workspaceId, requester) {
    this.projectId = projectId;
    this.workspaceId = workspaceId;
    this.requester = requester;
    this.cache = FsCacheFactory.create(projectId, workspaceId, 'code_cache', requester);
  }

  generate() {
    // if cache exists and is current return that
    return this.cache.isCurrent().then((isCurrent) => {
      if (isCurrent) {
        // console.log('cached data');
        return this.cachedFileSystem();
      }
      // Get AST
      return this.ast().then(ast => this.generatedCode(ast));
    });
  }

  cachedFileSystem() {
    this.cache.renew();
    return Promise.all([
      this.cache.workspaceName(),
      this.cache.manifest(),
      this.cache.fsData().then(data => new MemoryFS(data)),
    ]);
  }

  generatedCode(ast) {
    // Create memory FS
    const fs = new MemoryFS();
    // Retrieve plugin for project
    // Pass AST and FS to Plugin
    // Tell plugin to do it's thing
    return PluginManager.plugin('terra').generateCode(ast, fs).then(([manifest, outputFs]) => {
      this.cache.cacheFs(ast.name, manifest, outputFs.data);
      return Promise.all([ast.name, manifest, outputFs]);
    });
  }

  ast() {
    const url = `/projects/${this.projectId}/workspaces/${this.workspaceId}/ast`;
    return this.requester.request(url);
  }
}

export default CodeGenerator;
