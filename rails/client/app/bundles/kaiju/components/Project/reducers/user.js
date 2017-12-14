const user = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CHANGELOG_VIEWED':
      return { ...state, changelogViewed: action.changelogViewed };
    default:
      return state;
  }
};

export default user;
