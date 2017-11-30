import { connect } from 'react-redux';
import Child from '../components/Form/Child/Child';

const mapStateToProps = ({ components, selectedComponent }, { id }) => ({
  isDuplicable: (typeof components[id].insertBeforeUrl !== 'undefined'),
  isSelected: (id === selectedComponent),
  type: (components[id].display || components[id].name),
});

export default connect(mapStateToProps)(Child);
