import React from 'react';
import PropTypes from 'prop-types';
import './GroupHeader.scss';

const propTypes = {
  /**
   * Display text
   */
  text: PropTypes.string,
};

const GroupHeader = ({ text }) => (
  <div className="kaiju-GroupHeader">
    {text}
  </div>
);

GroupHeader.propTypes = propTypes;

export default GroupHeader;
