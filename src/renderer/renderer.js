/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import plugins from '../plugins';

class Renderer {
  static render(data) {
    const { component, id } = data;

    const plugin = plugins[component];

    if (plugin) {
      const { componentType } = plugin;

      return React.createElement(componentType, { key: id });
    }

    return <div key={id}>Whoops, bad component</div>;
  }
}

export default Renderer;
