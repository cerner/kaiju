import reducer from '../../app/bundles/kaiju/components/LaunchPage/reducers/searchFilter';

describe('search filter reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual('');
  });

  it('should handle SET_SEARCH_FILTER by setting the search filter', () => {
    const filter = 'filter';
    const action = {
      type: 'SET_SEARCH_FILTER',
      filter,
    };

    expect(reducer(undefined, action)).toEqual(filter);
  });
});
