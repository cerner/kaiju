import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import Overlay from '../components/Overlay/Overlay';

const propTypes = {
  /**
   * The selected component.
   */
  selectedComponent: PropTypes.object,
};

const SelectedContainer = ({ selectedComponent }) => (
  <Overlay {...selectedComponent} key={uniqid()} />
);

SelectedContainer.propTypes = propTypes;

const mapStateToProps = ({ components, selectedComponent }) => (
  { selectedComponent: components[selectedComponent] }
);


export default connect(mapStateToProps)(SelectedContainer);
