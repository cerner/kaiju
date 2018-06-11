import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import iconMap from 'terra-kaiju-plugin/iconMap';
import { Icon, Tooltip } from 'antd';
import { select } from '../../utilities/messenger';
import styles from './DraggableItem.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Description text.
   */
  description: PropTypes.string,
  /**
   * Display text.
   */
  display: PropTypes.string,
  /**
   * A resource URL to official component documentation.
   */
  documentation: PropTypes.string,
  /**
   * The component library.
   */
  library: PropTypes.string,
  /**
   * The component name.
   */
  name: PropTypes.string,
};

const DraggableItem = ({
  display, description, documentation, library, name,
}) => {
  /**
   * Appends component data to the event
   */
  function handleDragStart(event) {
    select(null);
    event.dataTransfer.setData('text', JSON.stringify({ type: `${library}::${name}` }));
  }

  const IconType = iconMap[name];
  const resource = <a className={cx('link')} href={documentation} target="_blank" rel="noopener noreferrer">See more</a>;
  const info = documentation ? <span>{description}. {resource}</span> : description;

  return (
    <li className={cx('item')} draggable onDragStart={handleDragStart}>
      <span className={cx('display')}>
        {IconType && <IconType className={cx('icon')} />}{display}
      </span>
      <span className={cx('description')}>
        <Tooltip placement="right" title={info}>
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>
    </li>
  );
};

DraggableItem.propTypes = propTypes;

export default DraggableItem;
