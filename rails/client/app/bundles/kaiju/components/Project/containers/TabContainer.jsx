import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Input } from 'antd';
import { closeTab, renameWorkspace, setActiveWorkspace } from '../actions/actions';
import Tab from '../components/Tabs/Tab/Tab';
import axios from '../../../utilities/axios';

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
  name: PropTypes.string,
};

class TabContainer extends React.Component {
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
        this.props.onRename(this.state.name);
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
    const { name, renameUrl, ...tabProperties } = this.props;

    // Storyboard tab
    if (renameUrl === null) {
      return <Tab {...tabProperties} role="presentation">{name}</Tab>;
    }

    return (
      <Tab
        onDoubleClick={this.showModal}
        role="presentation"
        {...tabProperties}
      >
        {name}
        <Modal
          title="Rename Workspace"
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
            ref={(input) => { if (input) { this.input = input.refs.input; } }}
          />
        </Modal>
      </Tab>
    );
  }
}

TabContainer.propTypes = propTypes;

const mapStateToProps = ({ activeWorkspace, workspaces }, { id }) => ({
  name: id ? workspaces[id].name : '+',
  isSelected: activeWorkspace === id,
  renameUrl: id ? workspaces[id].rename : null,
  title: id ? workspaces[id].name : null,
});

const mapDispatchToProps = (dispatch, { id, next }) => ({
  onClick: () => {
    dispatch(setActiveWorkspace(id));
  },
  onRename: (name) => {
    dispatch(renameWorkspace(id, name));
  },
  onRequestClose: !id ? null : () => {
    dispatch(closeTab(id, next));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TabContainer);
