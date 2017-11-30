import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import ajax from 'superagent';
import './Delete.scss';

const propTypes = {
  onDelete: PropTypes.func,
  url: PropTypes.string,
  workspaceName: PropTypes.string,
};

class Rename extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false, workspaceName: props.workspaceName };
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleCancel() {
    this.setState({ isOpen: false });
  }

  handleConfirm() {
    ajax
      .delete(this.props.url)
      .set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
      .end(() => {
        this.setState({ isOpen: false });
        this.props.onDelete();
      });
  }

  showModal() {
    this.setState({ isOpen: true });
  }

  render() {
    return (
      <div className="kaiju-DeleteWorkspace" onClick={this.showModal} role="presentation">
        <Icon type="delete" />
        <Modal title="Delete Workspace" visible={this.state.isOpen} cancelText="Cancel" okText="Confirm" onCancel={this.handleCancel} onOk={this.handleConfirm}>
          <div className="kaiju-DeleteWorkspace-message">Are you sure you want to delete this workspace?</div>
        </Modal>
      </div>
    );
  }
}

Rename.propTypes = propTypes;

export default Rename;
