import React from 'react';
import PropTypes from 'prop-types';
import './Browser.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * A Tabs component
   */
  tabs: PropTypes.node,
};

const Browser = ({ children, tabs }) => (
  <div className="kaiju-Browser">
    <div className="kaiju-Browser-tabs">
      {tabs}
    </div>
    <div className="kaiju-Browser-frame">
      {children}
    </div>
  </div>
);

Browser.propTypes = propTypes;

export default Browser;
