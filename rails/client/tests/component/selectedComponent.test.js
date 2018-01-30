import reducer from '../../app/bundles/kaiju/components/Component/reducers/selectedComponent';

describe('selected component reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('should handle SELECT_COMPONENT by setting the selected component', () => {
    const id = 'id';
    const action = {
      type: 'SELECT_COMPONENT',
      id,
    };

    expect(reducer(undefined, action)).toEqual(id);
  });

  it('should handle SELECT_COMPONENT by setting the selected component to null if there is no id', () => {
    const action = {
      type: 'SELECT_COMPONENT',
    };

    expect(reducer(undefined, action)).toEqual(null);
  });
});
