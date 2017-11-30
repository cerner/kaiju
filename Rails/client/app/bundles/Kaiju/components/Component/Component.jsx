import React from 'react';
import Base from 'terra-base';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from './store/componentStore';
import ElementContainer from './containers/ElementContainer';
import distpatcher from './utilities/dispatcher';
import initializeDrag from './utilities/drag';

const propTypes = {
  /**
   * The Component Identifer
   */
  id: PropTypes.string.isRequired,
};

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.store = configureStore(this.props);
  }

  componentDidMount() {
    distpatcher(this.store, this.props.id);
    initializeDrag();
  }

  render() {
    return (
      <Provider store={this.store}>
        <Base locale="en-US">
          <ElementContainer id={this.props.id} />
        </Base>
      </Provider>
    );
  }
}

Component.propTypes = propTypes;

export default Component;
