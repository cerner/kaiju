const selectedListItem = (state = 'recentWorkspaces', action) => {
  switch (action.type) {
    case 'SET_SELECTED_LIST_ITEM':
      return action.selectedListItem;
    default:
      return state;
  }
};

export default selectedListItem;
