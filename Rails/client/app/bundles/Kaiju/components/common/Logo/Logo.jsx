import React from 'react';
import Kaiju from './KaijuSVG/KaijuSVG';
import './Logo.scss';

const Logo = () => (
  <span className="kaiju-Logo" role="presentation" onClick={() => { window.location = '/'; }}>
    <Kaiju />
    <span className="kaiju-Logo-title">
      Kaijū
    </span>
  </span>
);

export default Logo;
