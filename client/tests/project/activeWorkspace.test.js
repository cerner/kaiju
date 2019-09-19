import reducer from '../../app/bundles/kaiju/components/Project/reducers/activeWorkspace';

describe('active workspaces reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('should handle OPEN_TAB by setting the new tab as the active workspace', () => {
    const id = 'id';
    const action = {
      type: 'OPEN_TAB',
      id,
    };

    expect(reducer(undefined, action)).toEqual(id);
  });

  it('should handle ADD_WORKSPACE by setting the new workspace as the active workspace', () => {
    const id = 'id';
    const action = {
      type: 'ADD_WORKSPACE',
      id,
    };

    expect(reducer(undefined, action)).toEqual(id);
  });

  it('should handle SET_ACTIVE_WORKSPACE by setting the active workspace', () => {
    const id = 'id';
    const action = {
      type: 'SET_ACTIVE_WORKSPACE',
      id,
    };

    expect(reducer(undefined, action)).toEqual(id);
  });

  it('should handle REMOVE_WORKSPACE by setting the active workspace to nothing', () => {
    const id = 'id';
    const action = {
      type: 'REMOVE_WORKSPACE',
      id,
    };

    expect(reducer(undefined, action)).toEqual(null);
  });

  it('should handle CLOSE_TAB by setting the active workspace to the next tab if the tab being closed is the active tab', () => {
    const id = 'id';
    const next = 'next';
    const action = {
      type: 'CLOSE_TAB',
      id,
      next,
    };

    expect(reducer(id, action)).toEqual(next);
  });

  it('should handle CLOSE_TAB by not changing the active workspace if the tab being closed is not the active tab', () => {
    const id = 'id';
    const next = 'next';
    const action = {
      type: 'CLOSE_TAB',
      id,
      next,
    };

    const active = 'active';
    expect(reducer(active, action)).toEqual(active);
  });
});
