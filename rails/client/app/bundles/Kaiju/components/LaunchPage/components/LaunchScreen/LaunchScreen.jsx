import React from 'react';
import PropTypes from 'prop-types';
import ajax from 'superagent';
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
  ajax
    .post(url)
    .set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
    .end((error, { text }) => {
      window.location = JSON.parse(text).url;
    });
};

const LaunchScreen = ({ onSearch, projects, projectsUrl, recentWorkspaces }) => (
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
          </ListContainer>
          <Button type="primary" className="kaiju-LaunchScreen-newProject" onClick={() => createNewProject(projectsUrl)}>New Project</Button>
        </div>
        <div className="kaiju-LaunchScreen-content">
          <GridContainer projects={projects} recentWorkspaces={recentWorkspaces} />
        </div>
      </div>
    </div>
  </div>
);

LaunchScreen.propTypes = propTypes;

export default LaunchScreen;
