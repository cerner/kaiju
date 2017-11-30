import React from 'react';
import PropTypes from 'prop-types';
import './SubMenu.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
};

const SubMenu = ({ children }) => (
  <ul className="kaiju-SubMenu">
    {children}
  </ul>
);

SubMenu.propTypes = propTypes;

export default SubMenu;
