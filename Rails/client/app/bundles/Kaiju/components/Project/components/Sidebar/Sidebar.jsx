import React from 'react';
import ComponentSearchContainer from '../../containers/ComponentSearchContainer';
import LayersContainer from '../../containers/LayersContainer';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import './Sidebar.scss';

const Sidebar = () => (
  <div className="kaiju-Sidebar">
    <div className="kaiju-Sidebar-components">
      <ComponentSearchContainer />
    </div>
    <div className="kaiju-Sidebar-layers">
      <SectionHeader title="Layers" />
      <LayersContainer />
    </div>
  </div>
);

export default Sidebar;
