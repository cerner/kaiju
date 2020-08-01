import React from 'react';
import TerraApplication from 'terra-application';
import classNames from 'classnames/bind';
import Canvas from '../canvas';
import Catalog from '../catalog';
import Editor from '../editor';
import styles from './Application.module.scss';

const cx = classNames.bind(styles);

const Application = () => (
  <TerraApplication locale="en">
    <div className={(cx('application'))}>
      <Catalog />
      <Canvas />
      <Editor />
    </div>
  </TerraApplication>
);

export default Application;
