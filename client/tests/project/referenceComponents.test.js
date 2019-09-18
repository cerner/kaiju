import reducer from '../../app/bundles/kaiju/components/Project/reducers/referenceComponents';

describe('reference components reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle SET_REFERENCE_COMPONENTS by setting the reference components', () => {
    const components = ['component1', 'component2'];
    const action = {
      type: 'SET_REFERENCE_COMPONENTS',
      components,
    };

    expect(reducer([], action)).toEqual(components);
  });
});
