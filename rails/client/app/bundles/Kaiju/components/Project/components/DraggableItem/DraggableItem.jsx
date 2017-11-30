import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';
import { select } from '../../utilities/messenger';
import './DraggableItem.scss';

const propTypes = {
  /**
   * Description text
   */
  description: PropTypes.string,
  /**
   * Display text
   */
  display: PropTypes.string,
  /**
   * The component library
   */
  library: PropTypes.string,
  /**
   * The component name
   */
  name: PropTypes.string,
};

const DraggableItem = ({ display, description, library, name }) => {
  /**
   * Appends component data to the event
   */
  function handleDragStart(event) {
    select(null);
    event.dataTransfer.setData('text', JSON.stringify({ type: `${library}::${name}` }));
  }

  return (
    <li className="kaiju-DraggableItem" draggable onDragStart={handleDragStart}>
      <span className="kaiju-DraggableItem-text">
        {display}
      </span>
      <span className="kaiju-DraggableItem-description">
        <Tooltip placement="right" title={description}>
          <Icon type="question-circle-o" />
        </Tooltip>
      </span>
    </li>
  );
};

DraggableItem.propTypes = propTypes;

export default DraggableItem;
