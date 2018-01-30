import reducer from '../../app/bundles/kaiju/components/Project/reducers/workspaces';

describe('workspaces reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle ADD_WORKSPACE by adding a workspace', () => {
    const workspace = {
      id: 1,
      name: '1',
    };

    const action = {
      type: 'ADD_WORKSPACE',
      ...workspace,
    };
    expect(reducer({}, action)).toHaveProperty('1', action);
  });

  it('should handle REMOVE_WORKSPACE by removing a workspace', () => {
    const workspaces = {
      0: {
        id: '0',
        name: '0',
      },
      1: {
        id: '1',
        name: '1',
      },
    };

    const id = '1';
    const action = {
      type: 'REMOVE_WORKSPACE',
      id,
    };

    const expected = {
      0: {
        id: '0',
        name: '0',
      },
    };

    expect(reducer(workspaces, action)).toEqual(expected);
  });

  it('should handle RENAME_WORKSPACE by renaming a workspace', () => {
    const workspaces = {
      0: {
        id: '0',
        name: '0',
      },
      1: {
        id: '1',
        name: '1',
      },
    };

    const id = '1';
    const name = 'new name';
    const action = {
      type: 'RENAME_WORKSPACE',
      id,
      name,
    };
    expect(reducer(workspaces, action)).toHaveProperty('1.name', name);
  });
});
