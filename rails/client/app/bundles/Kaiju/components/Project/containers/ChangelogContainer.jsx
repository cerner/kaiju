import { connect } from 'react-redux';
import Changelog from '../components/Changelog/Changelog';
import { setChangelogViewed } from '../actions/actions';

const mapStateToProps = ({ project, user }) => ({
  viewed: user.changelogViewed,
  changelogViewedUrl: project.changelogViewed,
});

const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch(setChangelogViewed(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Changelog);
