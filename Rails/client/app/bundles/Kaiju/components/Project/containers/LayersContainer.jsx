import { connect } from 'react-redux';
import Layers from '../components/Layers/Layers';

const mapStateToProps = ({ components, root, selectedComponent }) => ({
  components,
  root,
  selectedComponent,
});

export default connect(mapStateToProps)(Layers);
