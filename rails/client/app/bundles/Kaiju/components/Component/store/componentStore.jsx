import { createStore } from 'redux';
import { camelizeKeys } from 'humps';
import { flattenComponent } from '../utilities/normalizer';
import reducers from '../reducers/reducers';

const configureStore = (props) => {
  const components = flattenComponent(camelizeKeys(props));
  return createStore(reducers, { components });
};

export default configureStore;
