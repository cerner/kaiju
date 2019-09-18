import reducer from '../../app/bundles/kaiju/components/Project/reducers/root';

describe('root reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('should handle UPDATE_COMPONENT by setting the root component', () => {
    const root = 'root';
    const action = {
      type: 'UPDATE_COMPONENT',
      root,
    };

    expect(reducer(undefined, action)).toEqual(root);
  });
});
