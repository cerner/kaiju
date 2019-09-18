import reducer from '../../app/bundles/kaiju/components/Project/reducers/user';

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle SET_CHANGELOG_VIEWED by setting the changelog as viewed', () => {
    const changelogViewed = true;
    const action = {
      type: 'SET_CHANGELOG_VIEWED',
      changelogViewed,
    };

    const user = {
      id: 'id',
      name: 'name',
      changelogViewed: false,
    };

    const expected = {
      id: 'id',
      name: 'name',
      changelogViewed: true,
    };

    expect(reducer(user, action)).toEqual(expected);
  });
});
