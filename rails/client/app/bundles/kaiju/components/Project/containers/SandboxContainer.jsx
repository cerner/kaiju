import { connect } from 'react-redux';
import Sandbox from '../components/Sandbox/Sandbox';

const mapStateToProps = ({ activeWorkspace, canvasSize, workspaces }) => ({
  canvasSize,
  componentUrl: workspaces[activeWorkspace].component.url,
  isReadOnly: !workspaces[activeWorkspace].isEditable,
});

export default connect(mapStateToProps)(Sandbox);
