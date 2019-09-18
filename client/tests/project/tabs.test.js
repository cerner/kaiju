import reducer from '../../app/bundles/kaiju/components/Project/reducers/tabs';

describe('tabs reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should handle CLOSE_TAB by removing that tab id from the array', () => {
    const id = '2';
    const tabs = new Set(['1', id, '3']);
    const action = {
      type: 'CLOSE_TAB',
      id,
    };

    const expected = new Set(['1', '3']);
    expect(reducer(tabs, action)).toEqual(expected);
  });

  it('should handle REMOVE_WORKSPACE by removing that tab id from the array', () => {
    const id = '3';
    const tabs = new Set(['1', '2', id]);
    const action = {
      type: 'REMOVE_WORKSPACE',
      id,
    };

    const expected = new Set(['1', '2']);
    expect(reducer(tabs, action)).toEqual(expected);
  });

  it('should handle OPEN_TAB by adding that tab id to the array', () => {
    const id = '3';
    const tabs = new Set(['1', '2']);
    const action = {
      type: 'OPEN_TAB',
      id,
    };

    const expected = new Set(['1', '2', id]);
    expect(reducer(tabs, action)).toEqual(expected);
  });

  it('should handle OPEN_TAB when the tab is already in the array', () => {
    const id = '3';
    const tabs = new Set(['1', '2', id]);
    const action = {
      type: 'OPEN_TAB',
      id,
    };

    const expected = new Set(['1', '2', id]);
    expect(reducer(tabs, action)).toEqual(expected);
  });

  it('should handle ADD_WORKSPACE by adding that tab id to the array', () => {
    const id = '2';
    const tabs = new Set(['1', '3']);
    const action = {
      type: 'ADD_WORKSPACE',
      id,
    };

    const expected = new Set(['1', id, '3']);
    expect(reducer(tabs, action)).toEqual(expected);
  });
});
