import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IconClose from 'terra-icon/lib/icon/IconClose';
import './Tab.scss';

const propTypes = {
  /**
   * Content to be displayed within the Tab
   */
  children: PropTypes.node,
  /**
   * Whether the tab is selected
   */
  isSelected: PropTypes.bool,
  /**
   * Callback for click events
   */
  onClick: PropTypes.func,
  /**
   * Callback for double click events
   */
  onDoubleClick: PropTypes.func,
  /**
   * Callback for requesting to close
   */
  onRequestClose: PropTypes.func,
};

const Tab = ({ children, isSelected, onClick, onDoubleClick, onRequestClose }) => {
  /**
   * Handler for the close button
   * @param {Object} event - The event invoking the function
   * @return undefined
   */
  const handleClose = (event) => {
    // Prevents the event from bubbling up and invoking onClick
    event.stopPropagation();
    onRequestClose(event);
  };

  const classes = classNames(['kaiju-Tab', { 'is-selected': isSelected }]);
  return (
    <li className={classes} onClick={onClick} onDoubleClick={onDoubleClick} role="tab">
      <span className="kaiju-Tab-content">
        {children}
      </span>
      <div className="kaiju-Tab-closeButton" onClick={handleClose} role="presentation">
        {onRequestClose && <IconClose />}
      </div>
    </li>
  );
};

Tab.propTypes = propTypes;

export default Tab;
