import React from 'react';
import PropTypes from 'prop-types';
import ajax from 'superagent';
import classNames from 'classnames/bind';
import { camelizeKeys } from 'humps';
import { Icon, Input, Modal, Select } from 'antd';
import { serializeComponent } from '../../../../Component/utilities/normalizer';
import Magician from '../../../../common/Magician/Magician';
import Spinner from '../../../../common/Spinner/Spinner';
import styles from './Duplicate.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Callback to add a Workspace to the existing project.
   */
  addWorkspace: PropTypes.func,
  /**
   * Flattened components.
   */
  components: PropTypes.object,
  /**
   * The name of the currently open workspace.
   */
  name: PropTypes.string,
  /**
   * Url to retrieve a users projects.
   */
  projectsUrl: PropTypes.string,
  /**
   * The project type.
   */
  projectType: PropTypes.string,
  /**
   * The identifier of the currently open project.
   */
  projectId: PropTypes.string,
  /**
   * The root component identifier.
   */
  root: PropTypes.string,
};

class Duplicate extends React.Component {
  /**
   * Returns the CSRF Token.
   * @return {String} - CSRF Token.
   */
  static getToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      projects: null,
      name: props.name,
      selectedProject: null,
    };

    this.duplicate = this.duplicate.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.createProject = this.createProject.bind(this);
    this.filterProjects = this.filterProjects.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleProjectChange = this.handleProjectChange.bind(this);
  }

  /**
   * Updates the workspace name when it changes.
   * @param {String} name - The workspace name.
   */
  componentWillReceiveProps({ name }) {
    if (name !== this.state.name) {
      this.setState({ name });
    }
  }

  /**
   * Creates a new project.
   */
  createProject() {
    ajax
      .post(this.props.projectsUrl)
      .set('X-CSRF-Token', Duplicate.getToken())
      .end((error, { text }) => {
        const workspacesUrl = JSON.parse(text).workspaces_url;
        this.duplicate(workspacesUrl);
      });
  }

  /**
   * Duplicates a workspace into a specified project.
   * @param {String} url - The project workspaces url.
   */
  duplicate(url) {
    const { components, name, projectId, root } = this.props;

    const duplicateWorkspace = serializeComponent(components, components[root]);

    ajax
     .post(url)
     .set('X-CSRF-Token', Duplicate.getToken())
     .send({ workspace: { name: this.state.name, component: duplicateWorkspace } })
     .end((error, { text }) => {
       const workspace = JSON.parse(text);

       // Add a workspace to the already open project.
       if (workspace.url.includes(projectId)) {
         this.props.addWorkspace(workspace);
         this.setState({ isOpen: false, projects: null, name });
       } else {
         // Redirect to the new workspace if it was placed in a different project.
         window.location = workspace.url;
       }
     });
  }

  /**
   * Filters the list of available projects.
   * @param {String} input - The text input of the filter.
   * @param {Node} option - The select option.
   * @return {Boolean} - True if the option matches the filter criteria.
   */
  filterProjects(input, option) {
    const value = option.props.value;
    const display = this.state.projects[value] ? this.state.projects[value].name : 'new-project';
    return display.toLowerCase().includes(input.toLowerCase());
  }

  /**
   * Closes the modal and resets data.
   */
  handleCancel() {
    this.setState({ isOpen: false, projects: null, name: this.props.name });
  }

  /**
   * Handles the workspace duplication confirmation.
   */
  handleConfirm() {
    if (this.state.selectedProject === 'new-project') {
      this.createProject();
      return;
    }

    const { projects, selectedProject } = this.state;
    this.duplicate(projects[selectedProject].workspacesUrl);
  }

  /**
   * Handles changes to the workspace name.
   * @param {Event} event - The on change event.
   */
  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  /**
   * Handles changes to the selected project.
   * @param {String} selectedProject - The identifier of the selected project.
   */
  handleProjectChange(selectedProject) {
    this.setState({ selectedProject });
  }

  /**
   * Opens the modal and fetches data.
   */
  showModal() {
    this.setState({ isOpen: true, projects: null, name: `${this.state.name} Copy` });

    // The input can only be selected when the modal has finished animating.
    setTimeout(() => { this.input.refs.input.select(); }, 200);

    ajax
     .get(this.props.projectsUrl)
     .set('Accept', 'application/json')
     .end((error, { text }) => {
       const { projectId, projectType } = this.props;
       const projects = camelizeKeys(JSON.parse(text))
         .filter(({ type }) => type === projectType)
         .reduce((object, project) => (
           { ...object, [project.id]: project }
         ), {});

       const selectedProject = projects[projectId] ? projectId : 'new-project';

       this.setState({ projects, selectedProject });
     });
  }

  render() {
    const { isOpen, projects, selectedProject } = this.state;

    // Default the content to a loading indicator
    let content = <div className={cx('spinner')}><Spinner /></div>;

    if (projects) {
      const options = Object.keys(projects).map(key => (
        <Select.Option key={projects[key].id} value={projects[key].id}>
          {`${projects[key].name} (${projects[key].workspaceCount})`}
        </Select.Option>
      ));

      content = (
        <Magician>
          <Select
            className={cx('select')}
            value={selectedProject}
            onChange={this.handleProjectChange}
            notFoundContent="Not found"
            showSearch
            filterOption={this.filterProjects}
          >
            {options}
            <Select.Option key="new-project" value="new-project">
              <Icon type="plus" /> New Project
            </Select.Option>
          </Select>
        </Magician>
      );
    }

    return (
      <div onClick={this.showModal} role="presentation">
        <Icon type="copy" />
        <Modal
          width="725px"
          title="Duplicate"
          visible={isOpen}
          onCancel={this.handleCancel}
          onOk={this.handleConfirm}
          okText="Confirm"
          cancelText="Cancel"
        >
          <div className={cx('description')}>Workspace Name:</div>
          <Input value={this.state.name} onChange={this.handleNameChange} ref={(input) => { this.input = input; }} />
          <div className={cx('description')}>Select a project to move this workspace into:</div>
          {content}
        </Modal>
      </div>
    );
  }
}

Duplicate.propTypes = propTypes;

export default Duplicate;
