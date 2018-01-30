import * as actions from '../../app/bundles/kaiju/components/LaunchPage/actions/actions';

describe('actions', () => {
  it('should create an action to set the search filter', () => {
    const filter = 'filter';
    const expectedAction = {
      type: 'SET_SEARCH_FILTER',
      filter,
    };
    expect(actions.setSearchFilter(filter)).toEqual(expectedAction);
  });

  it('should create an action to set the selected list item', () => {
    const selectedListItem = 'filter';
    const expectedAction = {
      type: 'SET_SELECTED_LIST_ITEM',
      selectedListItem,
    };
    expect(actions.setSelectedListItem(selectedListItem)).toEqual(expectedAction);
  });
});
