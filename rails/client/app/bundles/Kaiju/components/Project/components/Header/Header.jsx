import React from 'react';
import Menu from '../Menu/Menu';
import Logo from '../../../common/Logo/Logo';
import ProjectName from '../../containers/ProjectNameContainer';
import './Header.scss';

const Header = () => (
  <div className="kaiju-Header">
    <div className="kaiju-Header-left">
      <Logo />
      <Menu />
    </div>
    <div className="kaiju-Header-center">
      <span className="kaiju-Header-projectName">
        <ProjectName />
      </span>
    </div>
    <div className="kaiju-Header-right" />
  </div>
);

export default Header;
