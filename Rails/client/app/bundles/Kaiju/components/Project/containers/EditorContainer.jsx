import { connect } from 'react-redux';
import Editor from '../components/Editor/Editor';

const mapStateToProps = ({ components, selectedComponent }) => ({
  selectedComponent: components[selectedComponent],
  title: selectedComponent ? components[selectedComponent].display || components[selectedComponent].name : 'Properties',
});

export default connect(mapStateToProps)(Editor);
