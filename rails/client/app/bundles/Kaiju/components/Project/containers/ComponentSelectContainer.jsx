import { connect } from 'react-redux';
import ComponentSelect from '../components/Form/ComponentSelect/ComponentSelect';

const mapStateToProps = ({ referenceComponents }) => ({
  components: referenceComponents,
});

export default connect(mapStateToProps)(ComponentSelect);
