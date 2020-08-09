import React, { useContext, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Canvas.module.scss';

const cx = classNames.bind(styles);

const Canvas = () => (
  <iframe
    className={cx('canvas')}
    id="sandbox"
    src="sandbox.html"
    title="sandbox"
  />
);

export default Canvas;
