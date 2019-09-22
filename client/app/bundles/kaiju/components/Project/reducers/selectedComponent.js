const selectedComponent = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_COMPONENT':
      return action.selectedComponent || null;
    default:
      return state;
  }
};

export default selectedComponent;
