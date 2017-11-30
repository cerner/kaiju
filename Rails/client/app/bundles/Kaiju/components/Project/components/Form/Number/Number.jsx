import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber as AntINumber } from 'antd';
import './Number.scss';

const propTypes = {
  /**
   * Callback function triggered on change
   */
  onChange: PropTypes.func.isRequired,
  /**
   * The default value
   */
  value: PropTypes.number,
};

const Number = ({ value, onChange }) => (
  <AntINumber className="kaiju-Number" defaultValue={value} onChange={newValue => onChange(newValue)} />
);

Number.propTypes = propTypes;

export default Number;
