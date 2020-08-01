import React from 'react';
import classNames from 'classnames/bind';
import styles from './Editor.module.scss';

const cx = classNames.bind(styles);

const Editor = () => (
  <div className={cx('editor')}>
    Editor
  </div>
);

export default Editor;
