import * as actions from '../../app/bundles/kaiju/components/Project/actions/actions';

describe('actions', () => {
  it('should create an action to open a tab', () => {
    const id = 'id';
    const expectedAction = {
      type: 'OPEN_TAB',
      id,
    };
    expect(actions.openTab(id)).toEqual(expectedAction);
  });

  it('should create an action to close a tab', () => {
    const id = 'id';
    const next = 'next';
    const expectedAction = {
      type: 'CLOSE_TAB',
      id,
      next,
    };
    expect(actions.closeTab(id, next)).toEqual(expectedAction);
  });

  it('should create an action to add a workspace', () => {
    const workspace = {
      id: 'id',
      url: 'url',
      name: 'name',
    };
    const expectedAction = {
      type: 'ADD_WORKSPACE',
      ...workspace,
    };
    expect(actions.addWorkspace(workspace)).toEqual(expectedAction);
  });

  it('should create an action to remove a workspace', () => {
    const id = 'id';
    const expectedAction = {
      type: 'REMOVE_WORKSPACE',
      id,
    };
    expect(actions.removeWorkspace(id)).toEqual(expectedAction);
  });

  it('should create an action to rename a workspace', () => {
    const id = 'id';
    const name = 'name';
    const expectedAction = {
      type: 'RENAME_WORKSPACE',
      id,
      name,
    };
    expect(actions.renameWorkspace(id, name)).toEqual(expectedAction);
  });

  it('should create an action to set the canvas size', () => {
    const size = 'size';
    const expectedAction = {
      type: 'SET_CANVAS_SIZE',
      size,
    };
    expect(actions.setCanvasSize(size)).toEqual(expectedAction);
  });

  it('should create an action to rename a project', () => {
    const name = 'name';
    const expectedAction = {
      type: 'RENAME_PROJECT',
      name,
    };
    expect(actions.renameProject(name)).toEqual(expectedAction);
  });

  it('should create an action to set the active workspace', () => {
    const id = 'id';
    const expectedAction = {
      type: 'SET_ACTIVE_WORKSPACE',
      id,
    };
    expect(actions.setActiveWorkspace(id)).toEqual(expectedAction);
  });

  it('should create an action to update a component', () => {
    const component = {
      root: 'root',
      components: {},
      selectedComponent: null,
    };
    const expectedAction = {
      type: 'UPDATE_COMPONENT',
      ...component,
    };
    expect(actions.updateComponent(component)).toEqual(expectedAction);
  });

  it('should create an action to set the reference components', () => {
    const components = [];
    const expectedAction = {
      type: 'SET_REFERENCE_COMPONENTS',
      components,
    };
    expect(actions.setReferenceComponents(components)).toEqual(expectedAction);
  });

  it('should create an action to set the changelog as viewed', () => {
    const changelogViewed = true;
    const expectedAction = {
      type: 'SET_CHANGELOG_VIEWED',
      changelogViewed,
    };
    expect(actions.setChangelogViewed(changelogViewed)).toEqual(expectedAction);
  });
});
