import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './SelectableItem.scss';

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
const SelectableItem = ({ children, isSelected, onClick }) => {
  const classes = classNames([
    'kaiju-SelectableItem',
    { 'is-selected': isSelected },
  ]);

  return (
    <li className={classes} onClick={onClick} role="presentation">
      {children}
    </li>
  );
};

SelectableItem.propTypes = propTypes;
SelectableItem.defaultProps = defaultProps;

export default SelectableItem;
