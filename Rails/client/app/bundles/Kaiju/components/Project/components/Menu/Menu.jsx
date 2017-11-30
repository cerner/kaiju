import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem/MenuItem';
import NewMenuItem from '../../containers/menu/NewMenuItem';
import OpenMenuItem from '../../containers/menu/OpenMenuItem';
import ShareMenuItem from '../../containers/menu/ShareMenuItem';
import RenameMenuItem from '../../containers/menu/RenameMenuItem';
import DeleteMenuItem from '../../containers/menu/DeleteMenuItem';
import SubMenu from './SubMenu/SubMenu';
import './Menu.scss';

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
};

const Menu = ({ children, ...customProps }) => (
  <ul {...customProps} className="kaiju-Menu">
    <MenuItem>
      Project
      <SubMenu>
        <NewMenuItem />
        <OpenMenuItem />
        <ShareMenuItem />
        <RenameMenuItem />
        <DeleteMenuItem />
      </SubMenu>
    </MenuItem>
    <MenuItem>
      Help
      <SubMenu>
        <MenuItem>
          <a href="https://github.com/cerner/kaiju" target="_blank" rel="noopener noreferrer">
            Contribute
          </a>
        </MenuItem>
        <MenuItem>
          <a href="https://github.com/cerner/kaiju/issues" target="_blank" rel="noopener noreferrer">
            Log an issue
          </a>
        </MenuItem>
        <MenuItem>
          <a href="https://github.com/cerner/kaiju/issues" target="_blank" rel="noopener noreferrer">
            Request an enhancement
          </a>
        </MenuItem>
      </SubMenu>
    </MenuItem>
  </ul>
);

Menu.propTypes = propTypes;

export default Menu;
