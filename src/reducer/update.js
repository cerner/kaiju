import Tree from '../tree/tree';

/**
 * Updates a node with a provided value.
 * @param {Object} state - The application state.
 * @param {Object} action - The reducer action.
 * @param {Object} action.id- The target node.
 * @param {Object} action.value- The replacement value.
 */
const update = (state, action) => {
  const { sandbox } = state;
  const { id, value } = action;

  return {
    ...state,
    sandbox: Tree.update(sandbox, id, value),
  };
};

export default update;
