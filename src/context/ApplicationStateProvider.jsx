import React from 'react';
import PropTypes from 'prop-types';
import ApplicationStateContext from './ApplicationStateContext';

const propTypes = {
  /**
   * The components to be rendered within the context of the provider.
   */
  children: PropTypes.node.isRequired,
  /**
   * The reducer dispatcher.
   */
  dispatch: PropTypes.func,
  /**
   * The application state.
   */
  state: PropTypes.object,
};

const ApplicationStateProvider = ({ children, dispatch, state }) => (
  // TODO: Circle back on this to determine if memory references are an issue here.
  <ApplicationStateContext.Provider value={{ state, dispatch }}>
    {children}
  </ApplicationStateContext.Provider>
);

ApplicationStateProvider.propTypes = propTypes;

export default ApplicationStateProvider;
