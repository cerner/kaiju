/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import plugins from '../plugins';

class Renderer {
  static props(props) {
    const properties = {};

    Object.keys(props).forEach((property) => {
      const { type, value } = props[property];

      let propertyValue;

      if (type === 'string') {
        propertyValue = value;
      } else if (type === 'element') {
        propertyValue = Renderer.render(props[property]);
      }

      if (propertyValue !== undefined && propertyValue !== null) {
        properties[property] = propertyValue;
      }
    });

    return properties;
  }

  /**
   * Dynamically renders a component from a properties object.
   * @param {Object} data - The properties object.
   */
  static render(data) {
    const { id, value } = data;
    const { component } = value;

    const plugin = plugins[component];

    if (plugin) {
      const { componentType } = plugin;
      const { props = {} } = value;

      return React.createElement(componentType, { key: id, id, ...Renderer.props(props) });
    }

    return <div key={id}>Whoops, bad component</div>;
  }
}

export default Renderer;
