import reducer from '../../app/bundles/kaiju/components/Project/reducers/project';

describe('project reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle RENAME_PROJECT by setting the project name', () => {
    const name = 'new name';
    const action = {
      type: 'RENAME_PROJECT',
      name,
    };

    const project = {
      name: 'project',
      id: 'id',
    };

    const expected = {
      id: 'id',
      name,
    };

    expect(reducer(project, action)).toEqual(expected);
  });
});
