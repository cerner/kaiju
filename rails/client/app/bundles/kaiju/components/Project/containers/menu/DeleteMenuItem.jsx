import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import MenuItem from '../../components/Menu/MenuItem/MenuItem';
import axios from '../../../../utilities/axios';

const propTypes = {
  projectUrl: PropTypes.string,
};

class DeleteMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleCancel() {
    this.setState({ isOpen: false });
  }

  handleConfirm() {
    axios
      .delete(this.props.projectUrl)
      .then(() => {
        window.location = '/';
      });
  }

  showModal() {
    this.setState({ isOpen: true });
  }

  render() {
    return (
      <MenuItem title="Delete" onClick={this.showModal}>
        <Modal title="Delete Project" visible={this.state.isOpen} cancelText="Cancel" okText="Confirm" onCancel={this.handleCancel} onOk={this.handleConfirm}>
          <div className="kaiju-DeleteProject-message">Are you sure you want to delete this project?</div>
        </Modal>
      </MenuItem>
    );
  }
}

DeleteMenuItem.propTypes = propTypes;

const mapStateToProps = ({ project }) => ({
  projectUrl: project.url,
});

export default connect(mapStateToProps)(DeleteMenuItem);
