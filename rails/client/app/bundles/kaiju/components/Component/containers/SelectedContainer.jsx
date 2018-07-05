import React from 'react';
import PropTypes from 'prop-types';
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
  <Overlay id={id} key={id} name={name} />
);

SelectedContainer.propTypes = propTypes;

const mapStateToProps = ({ components, selectedComponent }) => (
  { ...Object.assign({}, components[selectedComponent]) }
);


export default connect(mapStateToProps)(SelectedContainer);
