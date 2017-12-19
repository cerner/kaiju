import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import fileSystem from 'fs';
import fallbackFs from '../utils/FallbackFileSystem';

class PluginUtils {
  static rootPath() {
    return path.join(__dirname, '../..');
  }

  static webpackFs(fs) {
    return fallbackFs(fs.data, fileSystem);
  }

  static defaultWebpackConfig(publicPath) {
    return {
      entry: {
      },

      resolve: {
        extensions: ['.js'],
        modules: [`${PluginUtils.rootPath}/node_modules`],
      },

      output: {
        path: '/build/',
        publicPath,
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

  static runCompiler(memoryFs, config) {
    // plugin returns webpack config + entry path
    // create webpack compiler
    // setup compiler filesystem with memory fs
    const compiler = PluginUtils.webpackCompiler(config, memoryFs);
    // run compiler
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
          // console.log(err);
          // console.log(stats);
          reject('Preview failed to compile');
        }
        resolve(compiler.outputFileSystem);
      });
    });
  }

  static webpackCompiler(config, compilerFs) {
    const compiler = webpack(config);
    // hydrate new fs with data
    compiler.inputFileSystem = compilerFs;
    compiler.resolvers.normal.fileSystem = compiler.inputFileSystem;
    // seperate input and output file systems.
    compiler.outputFileSystem = new MemoryFS();
    return compiler;
  }
}

export default PluginUtils;
