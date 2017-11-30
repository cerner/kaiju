import React from 'react';
import PropTypes from 'prop-types';
import { humanize } from '../../utilities/utilities';

const propTypes = {
  /**
   * The Workspace AST
   */
  ast: PropTypes.object,
};

const Attributes = ({ ast }) => {
  function generateAttributes(object) {
    const listItems = [];

    Object.keys(object).forEach((objectKey) => {
      const { type, value } = object[objectKey];
      if (value === undefined || value == null) {
        // No value was provided
      } else if (type === 'Array' || type === 'Hash') {
        listItems.push(React.createElement('li', {}, humanize(object[objectKey].id)));

        const children = generateAttributes(value);
        if (children.length > 0) {
          listItems.push(React.createElement('ul', {}, ...children));
        }
      } else if (type === 'Component') {
        listItems.push(React.createElement('li', {}, value.name));

        const children = generateAttributes(value.properties);
        if (children.length > 0) {
          listItems.push(React.createElement('ul', {}, ...children));
        }
      } else if (isNaN(objectKey)) {
        listItems.push(React.createElement('li', {}, `${humanize(objectKey)}: ${value}`));
      } else {
        listItems.push(React.createElement('li', {}, `Position: ${objectKey}`));
        listItems.push(React.createElement('ul', {}, React.createElement('li', {}, value)));
      }
    });

    return listItems;
  }

  return React.createElement('ul', {}, ...generateAttributes(ast.properties.children.value));
};

Attributes.propTypes = propTypes;

export default Attributes;
