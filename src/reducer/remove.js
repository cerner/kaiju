import Tree from '../tree/tree';

/**
 * Removes a node from the tree.
 * @param {Object} state - The application state.
 * @param {Object} action - The reducer action.
 * @param {Object} action.id- The target node.
 */
const remove = (state, action) => {
  const { sandbox, selected } = state;
  const { id, value } = action;

  return {
    ...state,
    sandbox: Tree.remove(sandbox, id, value),
    selected: selected === id ? undefined : selected,
  };
};

export default remove;
