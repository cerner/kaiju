const tabs = (state = [], action) => {
  switch (action.type) {
    case 'CLOSE_TAB':
    case 'REMOVE_WORKSPACE':
      return new Set(Array.from(state).filter((tab) => tab !== action.id));
    case 'OPEN_TAB':
    case 'ADD_WORKSPACE':
      return new Set(state).add(action.id);
    default:
      return state;
  }
};

export default tabs;
