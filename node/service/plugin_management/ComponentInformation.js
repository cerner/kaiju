import appRoot from 'app-root-path';
import fs from 'fs';
import glob from 'glob';
import NodeCache from 'node-cache';
import path from 'path';

const componentsCache = new NodeCache({ checkperiod: 0 });

class ComponentInformation {

  static retrieve(projectTypeKey, plugin) {
    let components = componentsCache.get(projectTypeKey);

    if (components === undefined) {
      components = {};
      plugin.componentModules().forEach((item) => {
        const modulePath = path.join(appRoot.toString(), `/node_modules/${item}/lib/kaiju`);
        glob.sync('**/*.json', { cwd: modulePath, absolute: true }).forEach((componentPath) => {
          const component = JSON.parse(fs.readFileSync(componentPath));
          components[component.library] = { [component.name]: component };
        });
      });

      componentsCache.set(projectTypeKey, components);
    }

    return components;
  }

}

export default ComponentInformation;
