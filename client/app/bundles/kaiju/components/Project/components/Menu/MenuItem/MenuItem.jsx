import React from 'react';
import PropTypes from 'prop-types';
import './MenuItem.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * The menu item title
   */
  title: PropTypes.node,
};

const MenuItem = ({ children, title, ...customProps }) => (
  <li {...customProps} className="kaiju-MenuItem">
    <span className="kaiju-MenuItem-title">
      {title}
    </span>
    {children}
  </li>
);

MenuItem.propTypes = propTypes;

export default MenuItem;
