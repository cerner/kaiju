import { connect } from 'react-redux';
import { openTab } from '../actions/actions';
import Card from '../../common/Card/Card';

const mapStateToProps = ({ tabs, workspaces }, { id }) => ({
  author: workspaces[id].author.name,
  isOpen: tabs.has(id),
  updateDateTime: workspaces[id].updateDateTime,
  name: workspaces[id].name,
});

const mapDispatchToProps = (dispatch, { id }) => ({
  onClick: () => {
    dispatch(openTab(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
