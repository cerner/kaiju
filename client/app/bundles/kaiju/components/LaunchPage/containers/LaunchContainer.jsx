import { connect } from 'react-redux';
import { setSearchFilter } from '../actions/actions';
import LaunchScreen from '../components/LaunchScreen/LaunchScreen';

const mapDispatchToProps = (dispatch) => ({
  onSearch: (event) => {
    dispatch(setSearchFilter(event.currentTarget.value.toLowerCase()));
  },
});

export default connect(null, mapDispatchToProps)(LaunchScreen);
