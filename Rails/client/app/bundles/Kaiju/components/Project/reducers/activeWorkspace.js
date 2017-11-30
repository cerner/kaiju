const activeWorkspace = (state = null, action) => {
  switch (action.type) {
    case 'OPEN_TAB':
    case 'ADD_WORKSPACE':
    case 'SET_ACTIVE_WORKSPACE':
      return action.id;
    case 'CLOSE_TAB':
      return state === action.id ? action.next : state;
    case 'REMOVE_WORKSPACE':
      return null;
    default:
      return state;
  }
};

export default activeWorkspace;
