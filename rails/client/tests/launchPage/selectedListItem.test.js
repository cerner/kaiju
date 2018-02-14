import reducer from '../../app/bundles/kaiju/components/LaunchPage/reducers/selectedListItem';

describe('selected list item reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual('projects');
  });

  it('should handle SET_SELECTED_LIST_ITEM by setting the selected list item', () => {
    const selectedListItem = 'selectedListItem';
    const action = {
      type: 'SET_SELECTED_LIST_ITEM',
      selectedListItem,
    };

    expect(reducer(undefined, action)).toEqual(selectedListItem);
  });
});
