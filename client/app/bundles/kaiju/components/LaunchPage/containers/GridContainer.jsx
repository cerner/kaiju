import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from '../../../utilities/axios';
import Card from '../../common/Card/Card';
import Magician from '../../common/Magician/Magician';
import SelectableGrid from '../../common/SelectableGrid/SelectableGrid';

/**
 * Creates a Card with the appropriate details
 * @param {String} name - The primary display name
 * @param {String} author - The author of the object
 * @param {String} updateDateTime - The last edit timestamp of the object
 * @param {String} project - The project the object is contained within
 * @param {String} url - The url to navigate to
 * @return {ReactNode} - A Card representing the workspace or project
 */
const createCard = (id, name, author, updateDateTime, url, project) => (
  <Card
    key={id}
    name={name}
    author={author}
    updateDateTime={updateDateTime}
    project={project}
    onClick={() => { window.location = url; }}
  />
);

/**
 * Filters the user workspaces
 * @param {Array} workspaces - An Array of recent workspaces
 * @param {String} filter - The search filter
 * @return {Array} - An Array of filtered Cards
 */
const getRecentWorkspaceCards = (workspaces, filter) => {
  const items = workspaces.filter(({ workspace }) => workspace.name.toLowerCase().includes(filter));
  return items.map(({ project, workspace }) => (
    createCard(workspace.id, workspace.name, workspace.author.name, workspace.updateDateTime, workspace.url, project.name)
  ));
};

/**
 * Filters the user projects
 * @param {Array} projects - An Array of projects
 * @param {String} filter - The search filter
 * @return {Array} - An Array of filtered Cards
 */
const getProjectCards = (projects, filter) => {
  const items = projects.filter(({ name }) => name.toLowerCase().includes(filter));
  return items.map(({
    id, name, owner, updateDateTime, url, workspaceCount,
  }) => (
    createCard(id, `${name} (${workspaceCount})`, owner.name, updateDateTime, url)
  ));
};

/**
 * Filters the user's inactive projects
 * @param {Array} inactiveProjects - An Array of inactive projects
 * @param {String} filter - The search filter
 * @return {Array} - An Array of filtered Cards
 */
const getInactiveProjectCards = (inactiveProjects, filter) => {
  const items = inactiveProjects.filter(({ name }) => name.toLowerCase().includes(filter));
  return items.map(({
    activateUrl, id, name, owner, updateDateTime, url, workspaceCount,
  }) => {
    const activate = () => {
      axios
        .put(activateUrl)
        .then(() => {
          window.location = url;
        });
    };

    return (
      <Card
        key={id}
        name={`${name} (${workspaceCount})`}
        author={owner.name}
        updateDateTime={updateDateTime}
        onClick={activate}
      />
    );
  });
};

/**
 * Returns an Array of filtered Cards
 * @param {String} listItem - The current selected list item ( Projects / Recent Workspaces )
 * @param {String} filter - The filter string
 * @param {Array} projects - An Array of projects
 * @param {Array} workspaces - An Array of recent workspaces
 * @param {Array} inactiveProjects - An Array of inactive projects
 * @return {Array} - An Array of filtered Cards
 */
const getChildren = (listItem, filter, projects, workspaces, inactiveProjects) => {
  if (listItem === 'recentWorkspaces') {
    return getRecentWorkspaceCards(workspaces, filter);
  } else if (listItem === 'projects') {
    return getProjectCards(projects, filter);
  } else if (listItem === 'inactive') {
    return getInactiveProjectCards(inactiveProjects, filter);
  }
  return null;
};

const mapStateToProps = ({ selectedListItem, searchFilter }, { projects, recentWorkspaces, inactiveProjects }) => ({
  key: selectedListItem, // A key is required for the Magician to recognize content changes and animate
  children: getChildren(selectedListItem, searchFilter, projects, recentWorkspaces, inactiveProjects),
});

const propTypes = {
  /**
   * Child nodes
   */
  children: PropTypes.node,
};

const SelectionGrid = ({ children }) => (
  <Magician>
    <SelectableGrid>
      {children}
    </SelectableGrid>
  </Magician>
);

SelectionGrid.propTypes = propTypes;

export default connect(mapStateToProps)(SelectionGrid);
