import React from 'react';
import Base from 'terra-base';
import PropTypes from 'prop-types';
import SafeRender from '../Component/components/SafeRender/SafeRender';
import componentMap from '../Component/componentMap';
import './Preview.scss';

const propTypes = {
  ast: PropTypes.object,
};

const Preview = ({ ast }) => {
  function generateProperties(object) {
    const parameters = Array.isArray(object) ? [] : {};

    Object.keys(object).forEach((objectKey) => {
      const { id, type, value } = object[objectKey];
      if (value === undefined || value == null) {
        // No value was provided
      } else if (type === 'Array' || type === 'Hash') {
        parameters[objectKey] = generateProperties(value);
      } else if (type === 'Component') {
        parameters[objectKey] = <SafeRender key={id} type={value.type}>{React.createElement(componentMap[value.type], { ...generateProperties(value.properties) })}</SafeRender>;
      } else if (type === 'Number') {
        parameters[objectKey] = Number(value);
      } else {
        parameters[objectKey] = value;
      }
    });

    return parameters;
  }

  return (
    <Base className="kaiju-Preview" locale="en-US">
      {React.createElement('div', { ...generateProperties(ast.properties), className: `kaiju-${ast.name}` })}
    </Base>
  );
};

Preview.propTypes = propTypes;

export default Preview;
