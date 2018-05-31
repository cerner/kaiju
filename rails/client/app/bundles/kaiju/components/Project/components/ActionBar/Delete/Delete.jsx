import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import axios from '../../../../../utilities/axios';
import './Delete.scss';

const propTypes = {
  onDelete: PropTypes.func,
  url: PropTypes.string,
};

class Rename extends React.Component {
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
      .delete(this.props.url)
      .then(() => {
        this.setState({ isOpen: false });
        this.props.onDelete();
      });
  }

  showModal() {
    this.setState({ isOpen: true });
  }

  render() {
    return [
      <div key="delete" className="kaiju-DeleteWorkspace" onClick={this.showModal} role="presentation">
        <Icon type="delete" />
      </div>,
      <Modal
        key="delete-modal"
        okText="Confirm"
        cancelText="Cancel"
        title="Delete Workspace"
        onCancel={this.handleCancel}
        onOk={this.handleConfirm}
        visible={this.state.isOpen}
      >
        <div className="kaiju-DeleteWorkspace-message">Are you sure you want to delete this workspace?</div>
      </Modal>,
    ];
  }
}

Rename.propTypes = propTypes;

export default Rename;
