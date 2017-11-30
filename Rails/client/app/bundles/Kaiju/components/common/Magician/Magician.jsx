import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './Magician.scss';

const propTypes = {
  /**
   * Child nodes, the child nodes must have a key to be animated
   */
  children: PropTypes.node,
};

/* eslint-disable react/jsx-boolean-value */
const Magician = ({ children }) => (
  <ReactCSSTransitionGroup
    transitionName="kaiju-Magician"
    transitionAppear={true}
    transitionAppearTimeout={500}
    transitionEnterTimeout={500}
    transitionEnter={true}
    transitionLeave={false}
  >
    {children}
  </ReactCSSTransitionGroup>
);

Magician.propTypes = propTypes;

export default Magician;
