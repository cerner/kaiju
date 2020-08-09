import React from 'react';
import classNames from 'classnames/bind';
import styles from './Catalog.module.scss';

const cx = classNames.bind(styles);

const Catalog = () => (
  <div className={cx('catalog')}>
    <div
      draggable="true"
      onDragStart={(event) => {
        event.dataTransfer.setData('SANDBOX.DATA', JSON.stringify({ identifier: 'terra-button:button' }));
      }}
    >
      Terra Button
    </div>
  </div>
);

export default Catalog;
