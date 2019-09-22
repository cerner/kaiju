const components = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_COMPONENT':
      return { ...action.components };
    default:
      return state;
  }
};

export default components;
