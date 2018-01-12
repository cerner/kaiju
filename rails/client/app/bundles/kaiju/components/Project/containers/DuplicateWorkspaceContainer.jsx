import { connect } from 'react-redux';
import { camelizeKeys } from 'humps';
import { addWorkspace } from '../actions/actions';
import Duplicate from '../components/ActionBar/Duplicate/Duplicate';

const mapStateToProps = ({ activeWorkspace, components, project, root, user, workspaces }) => ({
  components,
  name: workspaces[activeWorkspace].name,
  projectId: project.id,
  projectsUrl: user.projectsUrl,
  projectType: project.type,
  root,
});

const mapDispatchToProps = dispatch => ({
  addWorkspace: (workspace) => {
    dispatch(addWorkspace(camelizeKeys(workspace)));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Duplicate);
