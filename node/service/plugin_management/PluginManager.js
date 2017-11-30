import fs from 'fs';
import glob from 'glob';
import path from 'path';
import config from '../../kaiju.config';

class PluginManager {

  static projectTypes() {
    return Object.keys(config.projectTypes);
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

  static plugin(projectType) {
    return config.projectTypes[projectType];
  }

}

export default PluginManager;
