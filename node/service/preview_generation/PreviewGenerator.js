import MemoryFS from 'memory-fs';
import fileSystem from 'fs';
// import webpack from 'webpack';
// import path from 'path';
import CodeGenerator from '../code_generation/CodeGenerator';
import PluginManager from '../plugin_management/PluginManager';
import fallbackFs from '../utils/FallbackFileSystem';
import FsCacheFactory from '../models/FsCacheFactory';

// const rootPath = path.join(__dirname, '../..');

class PreviewGenerator {
  constructor(projectId, workspaceId, requester) {
    this.projectId = projectId;
    this.workspaceId = workspaceId;
    this.requester = requester;
    this.publicPath = `/projects/${this.projectId}/workspaces/${this.workspaceId}/preview_files/`;
    this.cache = FsCacheFactory.create(projectId, workspaceId, 'preview_cache', requester);
  }

  generate() {
    return this.cache.isCurrent().then((isCurrent) => {
      if (isCurrent) {
        return this.cachedFileSystem();
      }
      return this.generatedPreview();
    });
  }

  cachedFileSystem() {
    this.cache.renew();
    return Promise.all([
      this.cache.workspaceName(),
      this.cache.entry(),
      this.cache.fsData().then(data => new MemoryFS(data)),
    ]);
  }

  generatedPreview() {
    const generator = new CodeGenerator(this.projectId, this.workspaceId, this.requester);
    return generator.generate().then(([name,, fs]) => {
      // Move to plugin utils
      const compilerFs = fallbackFs(fs.data, fileSystem);
      // find plugin
      // call plugin with fs and webpack config
      // return Promise.all([memoryFs, PluginManager.plugin('terra').generatePreview(manifest, defaultConfig, rootPath)]);
      return PluginManager.plugin('terra').generatePreview(compilerFs, this.publicPath).then(([entry, outputFileSystem]) => {
        // Cache Preview
        this.cache.cacheFs(name, [], outputFileSystem.data, entry);

        return Promise.all([name, entry, outputFileSystem]);
      });

      // return new Promise((resolve) => {
      //   PluginManager.plugin('terra').generatePreview(compilerFs, (entry, outputFileSystem) => {
      //     this.cache.cacheFs(name, [], outputFileSystem.data, entry);
      //     resolve([name, entry, outputFileSystem]);
      //   });
      // });
    });
  }
}

export default PreviewGenerator;
