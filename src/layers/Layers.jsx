import React, { useContext } from 'react';
import ContentContainer from 'terra-content-container';
import classNames from 'classnames/bind';
import LayersTree from '../layers-tree';
import { ApplicationStateContext } from '../context';
import styles from './Layers.module.scss';

const cx = classNames.bind(styles);

const Layers = () => {
  const { dispatch, state } = useContext(ApplicationStateContext);
  const { sandbox } = state;
  const { children } = sandbox;

  /**
   * Handles the click event.
   * @param {Event} event - The click event.
   */
  const handleClick = (event) => {
    let currentTarget = event.target;

    while (!currentTarget.id || (currentTarget.id.indexOf('terra-sandbox') !== 0 && currentTarget.id !== 'root')) {
      currentTarget = currentTarget.parentNode;
    }

    if (currentTarget && currentTarget.id) {
      dispatch({ type: 'SELECT', id: currentTarget.id });
    }
  };

  return (
    <ContentContainer
      fill
      header={(
        <div className={cx('header')}>
          Layers
        </div>
       )}
    >
      <div className={cx('content')} onClick={handleClick}>
        {children.map((child) => <LayersTree key={child.id} node={child} />)}
      </div>
    </ContentContainer>
  );
};

export default Layers;
