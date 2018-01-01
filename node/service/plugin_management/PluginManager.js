import config from '../../kaiju-plugin.config';
import ComponentInformation from './ComponentInformation';

class PluginManager {

  static projectTypes() {
    return Object.keys(config);
  }

  static projectType(projectTypeKey) {
    const projectTypeConfig = PluginManager.projectConfig(projectTypeKey);
    const projectType = { name: projectTypeConfig.name };

    projectType.components = ComponentInformation.retrieve(projectTypeKey, projectTypeConfig.plugin);

    return projectType;
  }

  static projectConfig(projectTypeKey) {
    return config[projectTypeKey];
  }

  static plugin(projectTypeKey) {
    return PluginManager.projectConfig(projectTypeKey).plugin;
  }

}

export default PluginManager;
