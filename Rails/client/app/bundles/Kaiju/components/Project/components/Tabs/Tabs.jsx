import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
};

const Tabs = ({ children, ...customProps }) => (
  <ul {...customProps} className="kaiju-Tabs">
    {children}
  </ul>
);

Tabs.propTypes = propTypes;

export default Tabs;
