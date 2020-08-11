/**
 * Selects the provided node.
 * @param {Object} state - The application state.
 * @param {Object} action - The reducer action.
 * @param {Object} action.id- The selected node.
 */
const select = (state, action) => {
  const { id } = action;

  return {
    ...state,
    selected: id,
  };
};

export default select;
