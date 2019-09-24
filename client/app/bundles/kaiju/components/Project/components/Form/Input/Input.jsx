import React from 'react';
import PropTypes from 'prop-types';
import { Input as AntInput } from 'antd';
import './Input.scss';

const propTypes = {
  /**
   * Whether to debounce onChange callback events
   * Strings such as URLs, height, and width need to be fully typed before they are valid
   */
  isDelayed: PropTypes.bool,
  /**
   * Callback function triggered on change
   */
  onChange: PropTypes.func.isRequired,
  /**
   * The default value
   */
  value: PropTypes.string,
};

const Input = ({ isDelayed, value, onChange }) => {
  /**
   * Timer for debouncing onChange callbacks
   */
  let debounce = null;
  /**
   * The current value of the input
   */
  let currentValue = value;

  /**
   * Handler for input change events
   * @param {Event} event - The event invoking the callback
   */
  const handleChange = (event) => {
    clearTimeout(debounce);
    currentValue = event.target.value;

    debounce = setTimeout(() => {
      onChange(currentValue);
    }, isDelayed ? 500 : 0);
  };

  return (
    <AntInput
      className="kaiju-Input"
      defaultValue={value}
      onChange={handleChange}
      onFocus={(event) => event.target.select()}
    />
  );
};

Input.propTypes = propTypes;

export default Input;
