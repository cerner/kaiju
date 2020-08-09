import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { ApplicationStateContext } from '../context';
import styles from './Editor.module.scss';

const cx = classNames.bind(styles);

const Editor = () => {
  const { state } = useContext(ApplicationStateContext);
  const { selected } = state;

  return (
    <div className={cx('editor')}>
      Editor
    </div>
  );
};

export default Editor;
