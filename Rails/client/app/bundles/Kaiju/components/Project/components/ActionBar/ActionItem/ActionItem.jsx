import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip } from 'antd';
import './ActionItem.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
  /**
   * An optional icon type from ant design library
   */
  iconType: PropTypes.string,
  /**
   * Callback function triggered when clicked.
   */
  onClick: PropTypes.func,
  /**
   * Title displayed within a tooltip on hover
   */
  title: PropTypes.string,
};

const ActionItem = ({ children, iconType, onClick, title }) => (
  <Tooltip placement="top" title={title}>
    <div className="kaiju-ActionItem" role="presentation" onClick={onClick}>
      {iconType && <Icon type={iconType} />}
      {children}
    </div>
  </Tooltip>
);

ActionItem.propTypes = propTypes;

export default ActionItem;
