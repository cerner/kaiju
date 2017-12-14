/**
 * Removes a workspace
 * @param {Object} state - An object with the existing workspaces
 * @param {String} id - The id of the workspace to remove
 * @return {Object} - Tbe remaining hash with the workspace removed
 */
const removeWorkspace = (state, id) => {
  const { [id]: omit, ...object } = state;
  return object;
};

const workspaces = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_WORKSPACE':
      return { ...state, [action.id]: action };
    case 'REMOVE_WORKSPACE':
      return removeWorkspace(state, action.id);
    case 'RENAME_WORKSPACE':
      return { ...state, [action.id]: { ...state[action.id], name: action.name } };
    default:
      return state;
  }
};

export default workspaces;
