import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './GridItem.scss';

const propTypes = {
  /**
   * Child Nodes.
   */
  children: PropTypes.node,
  /**
   * Whether or not the List item is selected.
   */
  isSelected: PropTypes.bool,
  /**
   * Callback function triggered when clicked.
   */
  onClick: PropTypes.func,
};

const defaultProps = {
  isSelected: false,
};

// Disabling this is questionable. May need to move the onClick down a level.
/* eslint-disable jsx-a11y/no-static-element-interactions */
const GridItem = ({ children, isSelected, onClick }) => {
  const classes = classNames([
    'kaiju-GridItem',
    { 'is-selected': isSelected },
  ]);

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

GridItem.propTypes = propTypes;
GridItem.defaultProps = defaultProps;

export default GridItem;
