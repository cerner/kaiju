import { connect } from 'react-redux';
import { setCanvasSize, removeWorkspace, renameWorkspace } from '../actions/actions';
import Sandbox from '../components/Sandbox/Sandbox';

const mapStateToProps = ({ activeWorkspace, canvasSize, workspaces }) => ({
  canvasSize,
  workspace: workspaces[activeWorkspace],
});

const mapDispatchToProps = dispatch => ({
  onDelete: (id) => {
    dispatch(removeWorkspace(id));
  },
  onRename: (id, name) => {
    dispatch(renameWorkspace(id, name));
  },
  onResize: (size) => {
    dispatch(setCanvasSize(size));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Sandbox);
