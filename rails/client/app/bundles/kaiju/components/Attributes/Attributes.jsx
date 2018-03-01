import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { humanize } from '../../utilities/utilities';
import styles from './Attributes.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The Component AST
   */
  ast: PropTypes.object,
};

const Attributes = ({ ast }) => {
  /**
   * Generates the attributes for a Component.
   * @param {Object} object - The object to generate attributes for.
   * @return {Array} - Generated attributes.
   */
  const generateAttributes = (object) => {
    const attributes = [];

    Object.keys(object).forEach((key) => {
      const { id, type, value } = object[key];
      if (value === undefined || value == null) {
        // No value was provided
      } else if (type === 'Array' || type === 'Hash') {
        attributes.push(<li>{humanize(id)}</li>);
        attributes.push(<ul>{generateAttributes(value)}</ul>);
      } else if (type === 'Component') {
        const { name, properties } = value;
        attributes.push(<li>{humanize(id)}</li>);
        attributes.push(
          <ul>
            <li className={cx({ bold: (value.code_name === value.import && value.import_from !== 'kaiju') })}>
              {humanize(name)}
            </li>
            <ul>{generateAttributes(properties)}</ul>
          </ul>,
        );
      } else if (isNaN(key) === false) {
        attributes.push(<li>{`Position: ${key}`}</li>);
        attributes.push(<ul><li>{value}</li></ul>);
      } else {
        attributes.push(<li>{`${humanize(key)}: ${value}`}</li>);
      }
    });

    return attributes;
  };

  return (
    <ul>
      <li className={cx({ bold: ast.code_name === ast.import })}>
        {ast.name}
      </li>
      <ul>
        {generateAttributes(ast.properties)}
      </ul>
    </ul>
  );
};

Attributes.propTypes = propTypes;

export default Attributes;
