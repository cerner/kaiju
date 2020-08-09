import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import example from '../example-generator';
import styles from './Placeholder.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * A unique identifier.
   */
  id: PropTypes.string.isRequired,
};

/**
 * Handles the drag over event.
 * @param {Event} event - The drag over event.
 */
const handleDragOver = (event) => {
  event.preventDefault();
};

/**
 * Handles the drag enter event.
 * @param {Event} event - The drag enter event.
 */
const handleDragEnter = (event) => {
  event.preventDefault();
};

const Placeholder = (props) => {
  const { id } = props;

  /**
   * Handles the drop event.
   * @param {Event} event - The drop event.
   */
  const handleDrop = (event) => {
    const sandboxData = event.dataTransfer.getData('SANDBOX.DATA');

    if (sandboxData) {
      const { identifier } = JSON.parse(sandboxData);

      // Generates an example component for the specified plugin.
      const replacement = example(identifier);

      window.parent.postMessage({ message: 'SANDBOX.DISPATCH.REPLACE', id, replacement });
    } else {
      console.log('Invalid element dropped');
    }
  };

  return (
    <div
      id={id}
      className={cx('placeholder')}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
    >
      <span>
        Placeholder
      </span>
    </div>
  );
};

Placeholder.propTypes = propTypes;

export default Placeholder;
