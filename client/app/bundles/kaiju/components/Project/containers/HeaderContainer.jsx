import { connect } from 'react-redux';
import Header from '../components/Header/Header';

const mapStateToProps = ({ project }) => ({
  projectName: project.name,
});

export default connect(mapStateToProps)(Header);
