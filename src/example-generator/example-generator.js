import { v4 as uuidv4 } from 'uuid';
import plugins from '../plugins';

class ExampleGenerator {
  /**
   * Creates an example for the specified component.
   * @param {string} identifier - The component identifier.
   * @return {Object} - An example component.
   * @param {string} id - The unique identifier of the component.
   */
  static example(identifier, id) {
    const plugin = plugins[identifier];

    if (!plugin) {
      throw Error(`No plugin found for ${identifier}`);
    }

    const uniqueId = id || uuidv4();

    return {
      id: uniqueId,
      type: 'element',
      value: {
        component: identifier,
        props: ExampleGenerator.defaultProps(plugin, uniqueId),
      },
    };
  }

  /**
   * Defaults all props for a provided plugin.
   * @param {Object} plugin - The plugin configuration.
   * @param {string} id - The unique identifier of the component.
   */
  static defaultProps(plugin, id) {
    const { props } = plugin;

    const properties = {};

    Object.keys(props).forEach((property) => {
      properties[property] = ExampleGenerator.determineName(props[property], id);
    });

    return properties;
  }

  /**
   * Creates an example for the property.
   * @param {Object} property - The property configuration.
   * @param {string} parent - The unique identifier of the parent node.
   */
  static determineName(property, parent) {
    const { defaultValue, example, type } = property;

    const id = uuidv4();

    if (defaultValue) {
      return { id, parent, type, value: defaultValue };
    }

    if (example) {
      return { id, parent, type, value: example };
    }

    return { id, parent, type, value: undefined };
  }
}

export default ExampleGenerator.example;
