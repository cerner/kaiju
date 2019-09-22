import reducer from '../../app/bundles/kaiju/components/Project/reducers/components';

describe('components reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle UPDATE_COMPONENT by setting the components', () => {
    const components = { one: 'one', two: 'two' };
    const action = {
      type: 'UPDATE_COMPONENT',
      components,
    };

    expect(reducer(undefined, action)).toEqual(components);
  });
});
