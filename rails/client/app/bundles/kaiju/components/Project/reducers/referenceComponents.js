const referenceComponents = (state = [], action) => {
  switch (action.type) {
    case 'SET_REFERENCE_COMPONENTS':
      return action.components;
    default:
      return state;
  }
};

export default referenceComponents;
