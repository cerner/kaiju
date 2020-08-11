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

  const tree = Tree.append(sandbox, component);

  return {
    ...state,
    sandbox: Tree.append(sandbox, component),
    selected: tree.children[tree.children.length - 1].id,
  };
};

export default append;
