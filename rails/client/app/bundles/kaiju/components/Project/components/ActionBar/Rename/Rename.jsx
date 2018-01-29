import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Input } from 'antd';
import axios from '../../../../../utilities/axios';
import './Rename.scss';

const propTypes = {
  /**
   * Callback function invoked when workspace name has changed
   */
  onRename: PropTypes.func,
  /**
   * The route needed to save name changes to the database
   */
  renameUrl: PropTypes.string,
  /**
   * The current workspace name
   */
  workspaceName: PropTypes.string,
};

class Rename extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      name: props.workspaceName,
    };

    this.showModal = this.showModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillReceiveProps({ workspaceName }) {
    this.setState({ name: workspaceName });
  }

  /**
   * Closes the modal
   */
  handleCancel() {
    this.setState({ isOpen: false });
  }

  /**
   * Records the name changes
   * @param {Event} event - DOM event
   */
  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  /**
   * Saves the name to the database
   */
  handleSave() {
    axios
      .put(this.props.renameUrl, { name: this.state.name })
      .then(() => {
        this.setState({ isOpen: false });
        this.props.onRename(this.state.name);
      });
  }

  /**
   * Shows the rename modal
   */
  showModal() {
    this.setState({ isOpen: true });

    // The input can only be selected when the modal has finished animating
    setTimeout(() => { this.input.refs.input.select(); }, 200);
  }

  render() {
    return (
      <div className="kaiju-RenameWorkspace" onClick={this.showModal} role="presentation">
        <Icon type="edit" />
        <Modal
          title="Rename Workspace"
          cancelText="Cancel"
          okText="Save"
          onCancel={this.handleCancel}
          onOk={this.handleSave}
          visible={this.state.isOpen}
        >
          <div className="kaiju-RenameWorkspace-name">Workspace Name:</div>
          <Input
            value={this.state.name}
            onChange={this.handleNameChange}
            onPressEnter={this.handleSave}
            ref={(input) => { this.input = input; }}
          />
        </Modal>
      </div>
    );
  }
}

Rename.propTypes = propTypes;

export default Rename;
