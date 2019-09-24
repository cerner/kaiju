import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import Overlay from '../components/Overlay/Overlay';

const propTypes = {
  /**
   * The component identifier.
   */
  id: PropTypes.string,
  /**
   * The component display name.
   */
  name: PropTypes.string,
};

const SelectedContainer = ({ id, name }) => (
  <Overlay id={id} key={uniqid()} name={name} />
);

SelectedContainer.propTypes = propTypes;

const mapStateToProps = ({ components, selectedComponent }) => (
  { ...({ ...components[selectedComponent] }) }
);


export default connect(mapStateToProps)(SelectedContainer);
