import React from 'react';
import PropTypes from 'prop-types';
import IconKnurling from 'terra-icon/lib/icon/IconKnurling';
import classNames from 'classnames/bind';
import styles from './DragItem.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The text display of the component.
   */
  display: PropTypes.string.isRequired,
  /**
   * The unique plugin identifier.
   */
  identifier: PropTypes.string.isRequired,
};

const DragItem = (props) => {
  const { display, identifier } = props;

  /**
   * Handles the drag start event. Transfers drop meta data onto the event object.
   * @param {Event} event - The drag start event.
   */
  const handleDragStart = (event) => {
    event.dataTransfer.setData('SANDBOX.DATA', JSON.stringify({ identifier }));
  };

  return (
    <div className={cx('drag-item')} draggable="true" onDragStart={handleDragStart}>
      <IconKnurling />
      <div className={cx('display')}>
        {display}
      </div>
    </div>
  );
};

DragItem.propTypes = propTypes;

export default DragItem;
