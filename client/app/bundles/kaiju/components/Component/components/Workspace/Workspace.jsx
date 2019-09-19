import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Workspace.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Child nodes.
   */
  children: PropTypes.node,
};

const Workspace = ({ children }) => (
  <div className={cx('workspace')}>
    {children}
  </div>
);

Workspace.propTypes = propTypes;

export default Workspace;
