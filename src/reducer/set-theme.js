/**
 * Sets the canvas theme.
 * @param {Object} state - The application state.
 * @param {Object} action - The reducer action.
 * @param {Object} action.id- The selected node.
 */
const setTheme = (state, action) => {
  const { theme } = action;

  return {
    ...state,
    theme,
  };
};

export default setTheme;
