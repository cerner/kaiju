import { combineReducers } from 'redux';
import activeWorkspace from './activeWorkspace';
import canvasSize from './canvasSize';
import components from './components';
import project from './project';
import referenceComponents from './referenceComponents';
import root from './root';
import selectedComponent from './selectedComponent';
import user from './user';
import tabs from './tabs';
import workspaces from './workspaces';

const reducers = combineReducers({
  activeWorkspace,
  canvasSize,
  components,
  project,
  referenceComponents,
  root,
  selectedComponent,
  tabs,
  user,
  workspaces,
});

export default reducers;
