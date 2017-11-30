import config from './default/preview/webpack.config';
import generateCode from './default/code/generator';

class DefaultTerraPlugin {
  static generateCode(ast, fs, callback) {
    fs.mkdirpSync('/src');
    fs.writeFileSync('/src/derp.jsx', generateCode(ast));
    const manifest = ['/src/derp.jsx'];
    callback(manifest);
  }

  static generatePreview(manifest, webpackconfig, inputFs, rootPath, callback) {
    const modifiedConfig = Object.assign({}, webpackconfig, config(rootPath, '/src/derp.jsx', inputFs));
    callback(modifiedConfig, 'preview.js');
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
