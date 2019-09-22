import { connect } from 'react-redux';
import { setCanvasSize, removeWorkspace, renameWorkspace } from '../actions/actions';
import ActionBar from '../components/ActionBar/ActionBar';

const mapStateToProps = ({
  activeWorkspace, canvasSize, components, selectedComponent, workspaces,
}) => ({
  canvasSize,
  isEditable: workspaces[activeWorkspace].isEditable,
  selectedComponent: components[selectedComponent],
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

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
