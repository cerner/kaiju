import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const propTypes = {
  /**
   * The default selected size
   */
  selectedSize: PropTypes.string,
  /**
   * A callback function invoked when a size is selected
   */
  onChange: PropTypes.func,
};

const SizeControl = ({ onChange, selectedSize }) => (
  <Select value={selectedSize} style={{ width: 120 }} onChange={value => onChange(value)}>
    <Select.Option value="auto">Auto</Select.Option>
    <Select.Option value="tiny">Tiny</Select.Option>
    <Select.Option value="small">Small</Select.Option>
    <Select.Option value="medium">Medium</Select.Option>
    <Select.Option value="large">Large</Select.Option>
    <Select.Option value="huge">Huge</Select.Option>
  </Select>
);

SizeControl.propTypes = propTypes;

export default SizeControl;
