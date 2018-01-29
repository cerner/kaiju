import reducer from '../../app/bundles/kaiju/components/Project/reducers/selectedComponent';

describe('selected component reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('should handle UPDATE_COMPONENT by setting the selected component', () => {
    const selectedComponent = 'selectedComponent';
    const action = {
      type: 'UPDATE_COMPONENT',
      selectedComponent,
    };

    expect(reducer(undefined, action)).toEqual(selectedComponent);
  });

  it('should handle UPDATE_COMPONENT when there is no selected component', () => {
    const action = {
      type: 'UPDATE_COMPONENT',
    };

    expect(reducer(undefined, action)).toEqual(null);
  });
});
