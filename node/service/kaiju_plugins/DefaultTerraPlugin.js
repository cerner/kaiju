import config from './default/preview/webpack.config';
import generateCode from './default/code/generator';
import PluginUtils from './PluginUtils';

class DefaultTerraPlugin {
  static generateCode(ast, fs, callback) {
    fs.mkdirpSync('/src');
    fs.writeFileSync('/src/derp.jsx', generateCode(ast));
    const manifest = ['/src/derp.jsx'];
    callback(manifest);
  }

  // returns a virtual fs containing the preview and the entry filename.
  static generatePreview(fs, publicPath) {
    console.log('generatePreview');
    const modifiedConfig = Object.assign(
      {}, PluginUtils.defaultWebpackConfig(publicPath), config(PluginUtils.rootPath(), '/src/derp.jsx', fs));
    return Promise.all([
      'preview.js',
      PluginUtils.runCompiler(fs, modifiedConfig),
    ]);
  }

  static componentModules() {
    return [
      'kaiju-bundle',
    ];
  }

  static projectDescription() {
    return 'The default Terra project';
  }
}

export default DefaultTerraPlugin;
