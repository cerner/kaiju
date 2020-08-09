import Tree from '../tree/tree';

/**
 * Replaces a node with a provided value.
 * @param {Object} state - The application state.
 * @param {Object} action - The reducer action.
 * @param {Object} action.id- The target node.
 * @param {Object} action.replacement- The replacement node.
 */
const replace = (state, action) => {
  const { sandbox } = state;
  const { id, replacement } = action;

  return {
    ...state,
    sandbox: Tree.replace(sandbox, id, replacement),
    selected: id,
  };
};

export default replace;
