import React from 'react';
import classNames from 'classnames/bind';
import styles from './Catalog.module.scss';

const cx = classNames.bind(styles);

const Catalog = () => (
  <div className={cx('catalog')}>
    <div>
      Terra Button
    </div>
  </div>
);

export default Catalog;
