import MemoryFS from 'memory-fs';
import CodeGenerator from '../code_generation/CodeGenerator';
import PluginManager from '../plugin_management/PluginManager';
import FsCacheFactory from '../models/FsCacheFactory';

class PreviewGenerator {
  constructor(projectId, workspaceId, requester) {
    this.projectId = projectId;
    this.workspaceId = workspaceId;
    this.requester = requester;
    this.publicPath = `/projects/${this.projectId}/workspaces/${this.workspaceId}/preview_files/`;
    this.cache = FsCacheFactory.createPreviewCache(projectId, workspaceId, requester);
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
      this.cache.outputPath(),
      this.cache.fsData().then(data => new MemoryFS(data)),
    ]);
  }

  generatedPreview() {
    const generator = new CodeGenerator(this.projectId, this.workspaceId, this.requester);
    return generator.generate().then(([name,, fs]) =>
      // call plugin with fs and public path
      PluginManager.plugin('terra').generatePreview(fs, this.publicPath).then(([entry, outputPath, outputFileSystem]) => {
        // Cache Preview
        this.cache.cache(name, entry, outputPath, outputFileSystem.data);
        return Promise.all([name, entry, outputPath, outputFileSystem]);
      }));
  }
}

export default PreviewGenerator;
