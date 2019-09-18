import { createStore } from 'redux';
import reducers from '../reducers/reducers';

const configureStore = () => (
  createStore(reducers)
);

export default configureStore;
