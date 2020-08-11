import Tree from '../tree/tree';

/**
 * Appends a node to the root children array.
 * @param {Object} state - The application state.
 * @param {Object} action - The reducer action.
 * @param {Object} action.component- The component to append to the children array.
 */
const append = (state, action) => {
  const { sandbox } = state;
  const { component } = action;

  return {
    ...state,
    sandbox: Tree.append(sandbox, component),
  };
};

export default append;
