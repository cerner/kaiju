import React from 'react';
import { connect } from 'react-redux';
import { camelizeKeys } from 'humps';
import { addWorkspace } from '../actions/actions';
import StoryBoard from '../components/StoryBoard/StoryBoard';
import Card from './CardContainer';

const mapStateToProps = ({ project, workspaces }) => ({
  project,
  workspaces: Object.keys(workspaces).sort((a, b) => (
    workspaces[a].name > workspaces[b].name
  )).map(key => <Card key={key} id={key} />),
});

const mapDispatchToProps = dispatch => ({
  addWorkspace: (workspace) => {
    dispatch(addWorkspace(camelizeKeys(workspace)));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StoryBoard);
