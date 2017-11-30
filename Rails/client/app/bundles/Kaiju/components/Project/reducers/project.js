const project = (state = {}, action) => {
  switch (action.type) {
    case 'RENAME_PROJECT':
      return { ...state, name: action.name };
    default:
      return state;
  }
};

export default project;
