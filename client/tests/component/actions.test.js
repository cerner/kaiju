import * as actions from '../../app/bundles/kaiju/components/Component/actions/actions';

describe('actions', () => {
  it('should create an action to collect orphaned keys', () => {
    const root = 'root';
    const expectedAction = {
      type: 'COLLECT_GARBAGE',
      root,
    };
    expect(actions.collectGarbage(root)).toEqual(expectedAction);
  });

  it('should create an action to refresh the store', () => {
    const id = 'root';
    const store = {};
    const expectedAction = {
      type: 'REFRESH_STORE',
      id,
      store,
    };
    expect(actions.refreshStore(id, store)).toEqual(expectedAction);
  });

  it('should create an action to select a component', () => {
    const id = 'id';
    const expectedAction = {
      type: 'SELECT_COMPONENT',
      id,
    };
    expect(actions.selectComponent(id)).toEqual(expectedAction);
  });

  it('should create an action to update a property', () => {
    const id = 'id';
    const value = 'value';
    const property = 'property';
    const expectedAction = {
      type: 'UPDATE_PROPERTY',
      id,
      property,
      value,
    };
    expect(actions.updateProperty(id, property, value)).toEqual(expectedAction);
  });
});
