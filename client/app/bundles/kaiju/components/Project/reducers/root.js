const root = (state = null, action) => {
  switch (action.type) {
    case 'UPDATE_COMPONENT':
      return action.root || null;
    default:
      return state;
  }
};

export default root;
