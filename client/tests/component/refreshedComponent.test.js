import reducer from '../../app/bundles/kaiju/components/Component/reducers/refreshedComponent';

describe('refreshed component reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('should handle SELECT_COMPONENT by clearing the most recently refreshed component', () => {
    const action = {
      type: 'SELECT_COMPONENT',
    };

    expect(reducer('id', action)).toEqual(null);
  });

  it('should handle REFRESH_STORE by setting the most recent refreshed component', () => {
    const id = 'id';
    const action = {
      type: 'REFRESH_STORE',
      id,
    };

    expect(reducer('mock', action)).toEqual(id);
  });
});
