import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import Overlay from '../components/Overlay/Overlay';

const propTypes = {
  /**
   * The highlighted component.
   */
  highlightedComponent: PropTypes.object,
};

const HighlightContainer = ({ highlightedComponent }) => (
  <Overlay {...highlightedComponent} isHighlight key={uniqid()} />
);

HighlightContainer.propTypes = propTypes;

const mapStateToProps = ({ components, highlightedComponent }) => (
  { highlightedComponent: components[highlightedComponent] }
);

export default connect(mapStateToProps)(HighlightContainer);
