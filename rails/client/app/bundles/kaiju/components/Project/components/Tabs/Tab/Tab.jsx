import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import IconClose from 'terra-icon/lib/icon/IconClose';
import styles from './Tab.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Content to be displayed within the Tab.
   */
  children: PropTypes.node,
  /**
   * Whether the tab is selected.
   */
  isSelected: PropTypes.bool,
  /**
   * Callback for click events.
   */
  onClick: PropTypes.func,
  /**
   * Callback for double click events.
   */
  onDoubleClick: PropTypes.func,
  /**
   * Callback for requesting to close.
   */
  onRequestClose: PropTypes.func,
  /**
   * Title of the tab.
   */
  title: PropTypes.string,
};

const Tab = ({ children, isSelected, onClick, onDoubleClick, onRequestClose, title }) => {
  /**
   * Handler for the close button.
   * @param {event} event - The event invoking the function.
   */
  const handleClose = (event) => {
    // Prevents the event from bubbling up and invoking onClick.
    event.stopPropagation();
    onRequestClose(event);
  };

  const classes = cx('tab', { 'is-selected': isSelected });
  return (
    <li className={classes} onClick={onClick} onDoubleClick={onDoubleClick} role="tab" title={title}>
      <span className={cx('content')}>
        {children}
      </span>
      <div className={cx('close')} onClick={handleClose} role="presentation" title="Close">
        {onRequestClose && <IconClose />}
      </div>
    </li>
  );
};

Tab.propTypes = propTypes;

export default Tab;
