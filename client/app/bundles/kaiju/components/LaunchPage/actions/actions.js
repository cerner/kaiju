/**
 * Sets the grid search filter
 * @param {String} filter - The current filter
 */
const setSearchFilter = filter => ({
  type: 'SET_SEARCH_FILTER',
  filter,
});

/**
 * Sets the selected list item. ( Recent Workspaces / My Projects )
 * @param {String} selectedListItem - The selected list item
 */
const setSelectedListItem = selectedListItem => ({
  type: 'SET_SELECTED_LIST_ITEM',
  selectedListItem,
});

export { setSearchFilter, setSelectedListItem };
