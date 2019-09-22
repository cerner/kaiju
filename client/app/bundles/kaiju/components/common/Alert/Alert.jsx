import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Icon } from 'antd';
import styles from './Alert.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Additional message information.
   */
  description: PropTypes.string,
  /**
   * Emphasised message title.
   */
  title: PropTypes.string,
};

const Alert = ({ description, title }) => (
  <div className={cx('alert')}>
    <div className={cx('indicator')}>
      <Icon className={cx('icon')} type="info-circle-o" />
    </div>
    <div className={cx('message')}>
      <strong className={cx('title')}>
        {title}
      </strong>
      <span className={cx('description')}>
        {description}
      </span>
    </div>
  </div>
);

Alert.propTypes = propTypes;

export default Alert;
