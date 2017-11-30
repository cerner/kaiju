import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';
import './Button.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * Callback function triggered when clicked.
   */
  onClick: PropTypes.func,
  /**
   * The type of button
   */
  type: PropTypes.string,
};

const Button = ({ children, onClick, type, ...customProps }) => {
  const classes = `kaiju-Button kaiju-Button--${type} ${customProps.className}`;
  return <AntButton className={classes} onClick={onClick}>{children}</AntButton>;
};

Button.propTypes = propTypes;

export default Button;
