import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  text: PropTypes.string,
};

const Text = ({ text }) => (
  <span>
    {text}
  </span>
);

Text.propTypes = propTypes;

export default Text;
