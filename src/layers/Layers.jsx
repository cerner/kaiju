import React, { useContext } from 'react';
import ContentContainer from 'terra-content-container';
import classNames from 'classnames/bind';
import LayersTree from '../layers-tree';
import { ApplicationStateContext } from '../context';
import styles from './Layers.module.scss';

const cx = classNames.bind(styles);

const Layers = () => {
  const { state } = useContext(ApplicationStateContext);
  const { sandbox } = state;
  const { children } = sandbox;

  return (
    <ContentContainer
      fill
      header={(
        <div className={cx('header')}>
          Layers
        </div>
       )}
    >
      <div className={cx('content')}>
        {children.map((child) => <LayersTree key={child.id} node={child} />)}
      </div>
    </ContentContainer>
  );
};

export default Layers;
