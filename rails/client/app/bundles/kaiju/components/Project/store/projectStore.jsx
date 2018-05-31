import { createStore } from 'redux';
import reducers from '../reducers/reducers';

const configureStore = ({ project, user, workspace }) => {
  const workspaces = {};
  project.workspaces.forEach((item) => { workspaces[item.id] = item; });

  const activeWorkspace = workspace ? workspace.id : null;
  const tabs = workspace ? new Set([workspace.id]) : new Set();

  return createStore(reducers, {
    activeWorkspace, workspaces, tabs, user, project,
  });
};

export default configureStore;
