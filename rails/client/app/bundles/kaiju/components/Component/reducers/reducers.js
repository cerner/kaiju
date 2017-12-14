import { combineReducers } from 'redux';
import components from './components';
import selectedComponent from './selectedComponent';

const reducers = combineReducers({
  components,
  selectedComponent,
});

export default reducers;
