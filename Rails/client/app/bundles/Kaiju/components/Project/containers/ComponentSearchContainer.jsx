import { connect } from 'react-redux';
import ComponentSearch from '../components/ComponentSearch/ComponentSearch';

const mapStateToProps = ({ referenceComponents }) => ({
  components: referenceComponents,
});

export default connect(mapStateToProps)(ComponentSearch);
