import MemoryFS from 'memory-fs';
import fileSystem from 'fs';
import webpack from 'webpack';
import path from 'path';
import CodeGenerator from '../code_generation/CodeGenerator';
import PluginManager from '../plugin_management/PluginManager';
import fallbackFs from '../utils/FallbackFileSystem';
import FsCacheFactory from '../models/FsCacheFactory';

const rootPath = path.join(__dirname, '../..');

class PreviewGenerator {
  constructor(projectId, workspaceId, requester) {
    this.projectId = projectId;
    this.workspaceId = workspaceId;
    this.requester = requester;
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
    // console.log('cached preview');
    this.cache.renew();
    return Promise.all([
      this.cache.workspaceName(),
      this.cache.entry(),
      this.cache.fsData().then(data => new MemoryFS(data)),
    ]);
  }

  generatedPreview() {
    return this.retrivePluginConfig().then(([name, memoryFs, config, entryLocation]) => this.runCompiler(name, memoryFs, config, entryLocation));
  }

  retrivePluginConfig() {
    const generator = new CodeGenerator(this.projectId, this.workspaceId, this.requester);
    return generator.generate().then(([name, manifest, fs]) => {
      // hydrate new fs with data

      const defaultConfig = this.defaultWebpackConfig();
      const compilerFs = fallbackFs(fs.data, fileSystem);
      // find plugin
      // call plugin with fs and webpack config
      // return Promise.all([memoryFs, PluginManager.plugin('terra').generatePreview(manifest, defaultConfig, rootPath)]);
      return new Promise((resolve) => {
        PluginManager.plugin('terra').generatePreview(manifest, defaultConfig, compilerFs, rootPath, (config, entryLocation) => {
          resolve([name, compilerFs, config, entryLocation]);
        });
      });
    });
  }

  runCompiler(name, memoryFs, config, entry) {
    // plugin returns webpack config + entry path
    // create webpack compiler
    // setup compiler filesystem with memory fs
    const compiler = PreviewGenerator.webpackCompiler(config, memoryFs);
    // run compiler
    const run = new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          // console.log(err);
          // console.log(stats);
          reject('Preview failed to compile');
        }
        this.cache.cacheFs(name, [], compiler.outputFileSystem.data, entry);
        resolve(compiler.outputFileSystem);
      });
    });
    return Promise.all([
      name,
      entry,
      run,
    ]);
  }

  defaultWebpackConfig() {
    return {
      entry: {
      },

      resolve: {
        extensions: ['.js'],
        modules: [`${rootPath}/node_modules`],
      },

      output: {
        path: '/build/',
        publicPath: `/projects/${this.projectId}/workspaces/${this.workspaceId}/preview_files/`,
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
      ],
    };
  }

  static webpackCompiler(config, compilerFs) {
    const compiler = webpack(config);
    // hydrate new fs with data
    compiler.inputFileSystem = fallbackFs(compilerFs.data, compiler.inputFileSystem);
    compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
    // seperate input and output file systems.
    compiler.outputFileSystem = new MemoryFS();
    return compiler;
  }
}

export default PreviewGenerator;
