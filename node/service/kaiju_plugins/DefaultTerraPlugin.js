import config from './default/preview/webpack.config';
import generateCode from './default/code/generator';
import PluginUtils from './PluginUtils';

class DefaultTerraPlugin {
  static generateCode(ast, fs) {
    fs.mkdirpSync('/src');
    fs.writeFileSync('/src/derp.jsx', generateCode(ast));
    const manifest = ['/src/derp.jsx'];
    return Promise.all([manifest, fs]);
  }

  // returns a virtual fs containing the preview and the entry filename.
  static generatePreview(fs, publicPath) {
    const webpackFs = PluginUtils.webpackFs(fs);
    const modifiedConfig = Object.assign(
      {}, PluginUtils.defaultWebpackConfig(publicPath), config(PluginUtils.rootPath(), '/src/derp.jsx', webpackFs));
    return Promise.all([
      'preview.js',
      PluginUtils.runCompiler(webpackFs, modifiedConfig),
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
