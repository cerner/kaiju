import uuidv4 from 'uuid/v4';
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

    const uniqueId = id || `terra-sandbox-${uuidv4()}`;

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

    Object.keys(props || {}).forEach((property) => {
      properties[property] = ExampleGenerator.prop(props[property], id);
    });

    return properties;
  }

  /**
   * Creates an example for the property.
   * @param {Object} property - The property configuration.
   * @param {string} parent - The unique identifier of the parent node.
   */
  static prop(property, parent) {
    const { defaultValue, example, type, placeholder } = property;

    const id = `terra-sandbox-${uuidv4()}`;

    if (defaultValue) {
      return { id, parent, type, value: defaultValue };
    }

    if (example) {
      return { id, parent, type, value: example };
    }

    if (type === 'element' && placeholder !== false) {
      return { id, parent, type, value: { component: 'terra-sandbox:placeholder', props: {} } };
    }

    if (type === 'node') {
      const nodeId = `terra-sandbox-${uuidv4()}`;
      return { id, parent, type, value: [{ id: nodeId, parent: id, type: 'element', value: { component: 'terra-sandbox:placeholder', props: {} } }] };
    }

    // String, Bool
    return { id, parent, type, value: undefined };
  }
}

export default ExampleGenerator.example;
