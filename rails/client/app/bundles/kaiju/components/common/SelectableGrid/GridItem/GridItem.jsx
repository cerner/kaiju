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

const GridItem = ({ children, isSelected, onClick }) => {
  const classes = classNames([
    'kaiju-GridItem',
    { 'is-selected': isSelected },
  ]);

  return (
    <div className={classes} onClick={onClick} role="presentation">
      {children}
    </div>
  );
};

GridItem.propTypes = propTypes;
GridItem.defaultProps = defaultProps;

export default GridItem;
