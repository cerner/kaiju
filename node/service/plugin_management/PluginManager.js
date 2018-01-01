import fs from 'fs';
import glob from 'glob';
import path from 'path';
import config from '../../kaiju-plugin.config';

class PluginManager {

  static projectTypes() {
    return Object.keys(config);
  }

  static projectType(projectType, callback) {
    PluginManager.plugin(projectType).componentModules().forEach((item) => {
      const modulePath = path.join(__dirname, `../../node_modules/${item}/lib/kaiju`);
      const components = {};
      glob('**/*.json', { cwd: modulePath, absolute: true }, (er, paths) => {
        paths.forEach((componentPath) => {
          const component = JSON.parse(fs.readFileSync(componentPath));
          components[component.library] = { [component.name]: component };
        });
        callback(components);
      });
    });
  }

  static projectConfig(projectType) {
    return config[projectType];
  }

  static plugin(projectType) {
    return PluginManager.projectConfig(projectType).plugin;
  }

}

export default PluginManager;
