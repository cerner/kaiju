import { combineReducers } from 'redux';
import components from './components';
import selectedComponent from './selectedComponent';
import refreshedComponent from './refreshedComponent';

const reducers = combineReducers({
  components,
  selectedComponent,
  refreshedComponent,
});

export default reducers;
