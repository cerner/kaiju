import React from 'react';
import PropTypes from 'prop-types';
import { Select as AntSelect } from 'antd';
import './Select.scss';

const propTypes = {
  /**
   * Callback function triggered on change
   */
  onChange: PropTypes.func.isRequired,
  /**
   * An array of options
   */
  options: PropTypes.array,
  /**
   * The default value
   */
  value: PropTypes.string,
};

const Select = ({
  onChange, options, value, ...customProps
}) => {
  const selectOptions = options.map(({ display, value: optionValue }) => (
    <AntSelect.Option key={optionValue} value={optionValue}>{display}</AntSelect.Option>
  ));

  return (
    <AntSelect className="kaiju-Select" defaultValue={value || customProps.default} onChange={newValue => onChange(newValue)}>
      {selectOptions}
    </AntSelect>
  );
};

Select.propTypes = propTypes;

export default Select;
