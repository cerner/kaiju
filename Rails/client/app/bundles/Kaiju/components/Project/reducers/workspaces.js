const workspaces = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_WORKSPACE':
      return { ...state, [action.id]: action };
    case 'REMOVE_WORKSPACE':
      const { [action.id]: omit, ...object } = state;
      return object;
    case 'RENAME_WORKSPACE':
      return { ...state, [action.id]: { ...state[action.id], name: action.name } };
    default:
      return state;
  }
};

export default workspaces;
