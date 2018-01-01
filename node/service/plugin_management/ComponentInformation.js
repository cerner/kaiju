import fs from 'fs';
import glob from 'glob';
import path from 'path';
import appRoot from 'app-root-path';

const componentsCache = {};

class ComponentInformation {

  static retrieve(projectTypeKey, plugin) {
    let components = componentsCache[projectTypeKey];

    if (components === undefined) {
      components = {};
      plugin.componentModules().forEach((item) => {
        const modulePath = path.join(appRoot.toString(), `/node_modules/${item}/lib/kaiju`);
        glob.sync('**/*.json', { cwd: modulePath, absolute: true }).forEach((componentPath) => {
          const component = JSON.parse(fs.readFileSync(componentPath));
          components[component.library] = { [component.name]: component };
        });
      });

      componentsCache[projectTypeKey] = components;
    }

    return components;
  }

}

export default ComponentInformation;
