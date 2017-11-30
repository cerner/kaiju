const searchFilter = (state = '', action) => {
  switch (action.type) {
    case 'SET_SEARCH_FILTER':
      return action.filter;
    default:
      return state;
  }
};

export default searchFilter;
