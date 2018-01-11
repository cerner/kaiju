import React from 'react';
import { Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './Spinner.scss';

const cx = classNames.bind(styles);

const Spinner = () => (
  <Spin className={cx('spinner')} size="large" />
);

export default Spinner;
