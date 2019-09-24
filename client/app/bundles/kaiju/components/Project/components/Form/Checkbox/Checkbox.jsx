import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as AntCheckbox } from 'antd';
import './Checkbox.scss';

const propTypes = {
  /**
   * The display
   */
  display: PropTypes.string.isRequired,
  /**
   * Callback function triggered on change
   */
  onChange: PropTypes.func.isRequired,
  /**
   * The default value
   */
  value: PropTypes.bool,
};

const Checkbox = ({ display, onChange, value }) => {
  const handleChange = (event) => onChange(event.target.checked);

  return (
    <AntCheckbox className="kaiju-Checkbox" defaultChecked={value} onChange={handleChange}>
      {display}
    </AntCheckbox>
  );
};

Checkbox.propTypes = propTypes;

export default Checkbox;
