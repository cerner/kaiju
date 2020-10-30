import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { ApplicationStateContext } from '../context';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

const Header = () => {
  const { state, dispatch } = useContext(ApplicationStateContext);

  const { theme } = state;

  return (
    <div className={cx('header')}>
      <select
        className={cx('select')}
        value={theme}
        onChange={(event) => dispatch({ type: 'SET_THEME', theme: event.target.value })}
      >
        <option value="terra-default-theme">Default</option>
        <option value="clinical-lowlight-theme">Lowlight</option>
        <option value="orion-fusion-theme">Fusion</option>
      </select>
    </div>
  );
};

export default Header;
