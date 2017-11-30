import React from 'react';
import PropTypes from 'prop-types';
import ajax from 'superagent';
import Button from '../../../common/Button/Button';
import SearchBar from '../../../common/SearchBar/SearchBar';
import SelectableGrid from '../../../common/SelectableGrid/SelectableGrid';
import './StoryBoard.scss';

const propTypes = {
  addWorkspace: PropTypes.func,
  project: PropTypes.object,
  workspaces: PropTypes.array,
};

const StoryBoard = ({ project, addWorkspace, workspaces }) => {
  function createNewWorkspace() {
    ajax
     .post(project.workspacesUrl)
     .set('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'))
     .end((error, { text }) => {
       addWorkspace(JSON.parse(text));
     });
  }

  return (
    <div className="kaiju-StoryBoard">
      <div className="kaiju-StoryBoard-header">
        <Button type="primary" onClick={createNewWorkspace}>New Workspace</Button>
        <div className="kaiju-StoryBoard-searchBar">
          <SearchBar placeholder="Search workspaces" />
        </div>
      </div>
      <div className="kaiju-StoryBoard-content">
        <SelectableGrid>
          {workspaces}
        </SelectableGrid>
      </div>
    </div>
  );
};

StoryBoard.propTypes = propTypes;

export default StoryBoard;
