import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from 'antd';
import axios from '../../../../utilities/axios';
import MenuItem from '../../components/Menu/MenuItem/MenuItem';
import Magician from '../../../common/Magician/Magician';
import Card from '../../../common/Card/Card';
import SelectableGrid from '../../../common/SelectableGrid/SelectableGrid';

const formatDate = date => new Date(date).toString();

const propTypes = {
  resourceUrl: PropTypes.string,
};

class OpenMenuItem extends React.Component {
  constructor() {
    super();
    this.state = { content: 'Loading...', isOpen: false };
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
    this.setState({ isOpen: false });
  }

  showModal() {
    this.setState({ isOpen: true });

    axios
     .get(this.props.resourceUrl)
     .then(({ data }) => {
       const { projects } = data;
       const cards = projects.map((project) => {
         const { name: author } = project.owner;
         const { name, workspace_count: count, update_date_time: lastEditDate, id, url } = project;
         const props = { updateDateTime: formatDate(lastEditDate), author, name: `${name} (${count})` };
         return <Card {...props} key={id} onClick={() => { window.location = url; }} />;
       });

       const content = (
         <Magician>
           <SelectableGrid key={'projects'}>
             {cards}
           </SelectableGrid>
         </Magician>
       );
       this.setState({ content });
     });
  }

  render() {
    return [
      <MenuItem key="open" title="Open..." onClick={this.showModal} />,
      <Modal
        key="open-modal"
        width="745px"
        title="Open..."
        visible={this.state.isOpen}
        onCancel={this.handleCancel}
        footer={null}
      >
        {this.state.content}
      </Modal>,
    ];
  }
}

OpenMenuItem.propTypes = propTypes;

const mapStateToProps = ({ user }) => ({
  resourceUrl: user.url,
});

export default connect(mapStateToProps)(OpenMenuItem);
