import React from 'react';
import PropTypes from 'prop-types';
import axios from '../../../../utilities/axios';
import Button from '../../../common/Button/Button';
import ListContainer from '../../containers/ListContainer';
import Logo from '../../../common/Logo/Logo';
import SearchBar from '../../../common/SearchBar/SearchBar';
import GridContainer from '../../containers/GridContainer';
import './LaunchScreen.scss';

const propTypes = {
  /**
   * Callback function triggered on search
   */
  onSearch: PropTypes.func.isRequired,
  /**
   * Inactive projects
   */
  inactiveProjects: PropTypes.array,
  /**
   * All active projects for a specific user
   */
  projects: PropTypes.array,
  /**
   * Projects route
   */
  projectsUrl: PropTypes.string.isRequired,
  /**
   * All recent workspaces for a specific user
   */
  recentWorkspaces: PropTypes.array,
};

/**
 * Redirects to a new Project created for a specific user
 * @param {String} url - The projects route for a specific user
 */
const createNewProject = (url) => {
  axios
    .post(url)
    .then(({ data }) => {
      window.location = data.url;
    });
};

const LaunchScreen = ({ onSearch, projects, projectsUrl, recentWorkspaces, inactiveProjects }) => (
  <div className="kaiju-LaunchScreen">
    <div className="kaiju-LaunchScreen-container">
      <header className="kaiju-LaunchScreen-header">
        <Logo />
        <div className="kaiju-LaunchScreen-searchContainer">
          <SearchBar className="kaiju-LaunchScreen-searchBar" placeholder="Search..." onChange={onSearch} />
        </div>
      </header>
      <div className="kaiju-LaunchScreen-body">
        <div className="kaiju-LaunchScreen-sidebar">
          <ListContainer>
            <span key="recentWorkspaces">Recent Workspaces ({recentWorkspaces.length})</span>
            <span key="projects">My Projects ({projects.length})</span>
            <span key="inactive">Deleted Projects ({inactiveProjects.length})</span>
          </ListContainer>
          <Button type="primary" className="kaiju-LaunchScreen-newProject" onClick={() => createNewProject(projectsUrl)}>New Project</Button>
        </div>
        <div className="kaiju-LaunchScreen-content">
          <GridContainer projects={projects} recentWorkspaces={recentWorkspaces} inactiveProjects={inactiveProjects} />
        </div>
      </div>
    </div>
  </div>
);

LaunchScreen.propTypes = propTypes;

export default LaunchScreen;
