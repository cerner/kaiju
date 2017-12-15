import React from 'react';
import { connect } from 'react-redux';
import Browser from '../components/Browser/Browser';
import SandboxContainer from './SandboxContainer';
import StoryBoardContainer from './StoryBoardContainer';
import TabContainer from './TabContainer';
import Tabs from '../components/Tabs/Tabs';

const getTabs = (activeWorkspace, project, workspaces, workspaceTabs) => {
  history.pushState({}, '', activeWorkspace ? workspaces[activeWorkspace].url : project.url);

  const tabs = Array.from(workspaceTabs).map((id, index, array) => (
    <TabContainer key={id} id={id} next={array[index + 1] || null} />
  ));

  return <Tabs>{tabs}<TabContainer key="storyboard" id={null} /></Tabs>;
};

const mapStateToProps = ({ activeWorkspace, project, workspaces, tabs }) => ({
  children: (activeWorkspace ? <SandboxContainer /> : <StoryBoardContainer />),
  tabs: getTabs(activeWorkspace, project, workspaces, tabs),
});

export default connect(mapStateToProps)(Browser);
