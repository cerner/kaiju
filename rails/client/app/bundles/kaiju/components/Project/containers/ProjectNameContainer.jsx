import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Input } from 'antd';
import { renameProject } from '../actions/actions';
import axios from '../../../utilities/axios';

const propTypes = {
  /**
   * Callback function invoked when save has completed
   */
  onSave: PropTypes.func.isRequired,
  /**
   * The current project name
   */
  name: PropTypes.string.isRequired,
  /**
   * The route needed to save name changes to the database
   */
  renameUrl: PropTypes.string.isRequired,
};

class ProjectName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      name: props.name,
    };

    this.showModal = this.showModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillReceiveProps({ name }) {
    this.setState({ name });
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
        this.props.onSave(this.input.value);
      });
  }

  /**
   * Shows the rename modal
   */
  showModal() {
    this.setState({ isOpen: true });

    // The input can only be selected when the modal has finished animating
    setTimeout(() => { this.input.select(); }, 200);
  }

  render() {
    document.title = this.props.name;

    return [
      <span onClick={this.showModal} role="presentation">
        {this.props.name}
      </span>,
      <Modal
        title="Rename Project"
        cancelText="Cancel"
        okText="Save"
        onCancel={this.handleCancel}
        onOk={this.handleSave}
        visible={this.state.isOpen}
      >
        <Input
          value={this.state.name}
          onChange={this.handleNameChange}
          onPressEnter={this.handleSave}
          ref={(input) => { if (input) { this.input = input.input; } }}
        />
      </Modal>,
    ];
  }
}

ProjectName.propTypes = propTypes;

const mapStateToProps = ({ project }) => ({
  name: project.name,
  renameUrl: project.renameUrl,
});

const mapDispatchToProps = dispatch => ({
  onSave: (name) => {
    dispatch(renameProject(name));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectName);
