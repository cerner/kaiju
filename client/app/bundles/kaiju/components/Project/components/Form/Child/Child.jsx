import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from 'antd';
import {
  destroy, duplicate, highlight, removeHighlight, select,
} from '../../../utilities/messenger';
import './Child.scss';

const propTypes = {
  /**
   * Whether or not the component can be duplicated
   */
  isDuplicable: PropTypes.bool,
  /**
   * Whether or not the component is currently selected
   */
  isSelected: PropTypes.bool,
  /**
   * The Component identifier
   */
  id: PropTypes.string.isRequired,
  /**
   * The Component type
   */
  type: PropTypes.string.isRequired,
};

const Child = ({
  id, isDuplicable, isSelected, type,
}) => {
  const handleMouseEnter = () => { highlight(id); };
  const handleMouseLeave = () => { removeHighlight(); };
  const handleSelect = (event) => { event.stopPropagation(); removeHighlight(); select(id); };
  const handleDelete = (event) => { event.stopPropagation(); removeHighlight(); destroy(id); };
  const handleDuplicate = (event) => { event.stopPropagation(); duplicate(id); };

  return (
    <div className="kaiju-Child" role="presentation" onClick={handleSelect} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className={classNames(['kaiju-Child-type', { 'is-selected': isSelected }])}>
        {type}
      </span>
      <div className="kaiju-Child-actions">
        { isDuplicable
          && (
          <div className="kaiju-Child-action" role="presentation" onClick={handleDuplicate}>
            <Icon type="copy" />
          </div>
          )}
        <div className="kaiju-Child-action" role="presentation" onClick={handleDelete}>
          <Icon type="delete" />
        </div>
      </div>
    </div>
  );
};

Child.propTypes = propTypes;

export default Child;
