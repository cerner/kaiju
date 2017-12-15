import React from 'react';
import PropTypes from 'prop-types';
import './SectionHeader.scss';

const propTypes = {
  /**
   * The header title
   */
  title: PropTypes.node,
};

const SectionHeader = ({ title }) => (
  <div className="kaiju-SectionHeader">
    {title}
  </div>
);

SectionHeader.propTypes = propTypes;

export default SectionHeader;
