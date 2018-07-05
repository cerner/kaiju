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

const HighlightContainer = ({ id, name }) => (
  <Overlay id={id} key={id} name={name} isHighlight />
);

HighlightContainer.propTypes = propTypes;

const mapStateToProps = ({ components, highlightedComponent }) => (
  { ...Object.assign({}, components[highlightedComponent]) }
);

export default connect(mapStateToProps)(HighlightContainer);
