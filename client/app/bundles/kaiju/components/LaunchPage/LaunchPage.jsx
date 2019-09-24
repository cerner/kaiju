import React from 'react';
import { Provider } from 'react-redux';
import { camelizeKeys } from 'humps';
import configureStore from './store/launchPageStore';
import LaunchContainer from './containers/LaunchContainer';

const LaunchPage = (props) => (
  <Provider store={configureStore()}>
    <LaunchContainer {...camelizeKeys(props)} />
  </Provider>
);

export default LaunchPage;
