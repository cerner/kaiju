import { combineReducers } from 'redux';
import components from './components';
import highlightedComponent from './highlightedComponent';
import selectedComponent from './selectedComponent';
import refreshedComponent from './refreshedComponent';

const reducers = combineReducers({
  components,
  highlightedComponent,
  selectedComponent,
  refreshedComponent,
});

export default reducers;
