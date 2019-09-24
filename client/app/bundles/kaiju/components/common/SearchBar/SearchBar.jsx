import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import './SearchBar.scss';

const propTypes = {
  /**
   * Callback function triggered when clicked.
   */
  onChange: PropTypes.func,
  /**
   * Text to be displayed as a placeholder
   */
  placeholder: PropTypes.string,
};

const SearchBar = ({ onChange, placeholder, ...customProps }) => {
  const classes = `kaiju-SearchBar ${customProps.className}`;
  const handleFocus = (event) => event.target.select();
  return <Input prefix={<Icon type="search" />} type="search" className={classes} onChange={onChange} placeholder={placeholder} onFocus={handleFocus} />;
};

SearchBar.propTypes = propTypes;

export default SearchBar;
