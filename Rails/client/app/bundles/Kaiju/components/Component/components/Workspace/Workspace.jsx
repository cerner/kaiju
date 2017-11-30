import React from 'react';
import PropTypes from 'prop-types';
import './Workspace.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
};

const Workspace = ({ children }) => (
  <div className="kaiju-Workspace">
    {children}
  </div>
);

Workspace.propTypes = propTypes;

export default Workspace;
