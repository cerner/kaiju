const COLLECT_GARBAGE = 'COLLECT_GARBAGE';
const UPDATE_PROPERTY = 'UPDATE_PROPERTY';
const SELECT_COMPONENT = 'SELECT_COMPONENT';
const REFRESH_STORE = 'REFRESH_STORE';

/**
 * Removes orphan keys from the store
 * @param {String} root - The entry component identifier
 */
const collectGarbage = root => ({
  type: COLLECT_GARBAGE,
  root,
});

/**
 * Refreshes the state of a component
 * @param {String} id - The component identifier
 * @param {Object} store - The serialized component
 */
const refreshStore = (id, store) => ({
  type: REFRESH_STORE,
  id,
  store,
});

/**
 * Sets the selected component
 * @param {String} id - The id of the component to destroy
 */
const selectComponent = id => ({
  type: SELECT_COMPONENT,
  id,
});

/**
 * Updates a Component property
 * @param {String} id - The id of the component to destroy
 * @param {Object} property - The property being updated
 * @param {*} value - The new value of the property
 */
const updateProperty = (id, property, value) => ({
  type: UPDATE_PROPERTY,
  id,
  property,
  value,
});

export {
  COLLECT_GARBAGE,
  REFRESH_STORE,
  SELECT_COMPONENT,
  UPDATE_PROPERTY,
  collectGarbage,
  refreshStore,
  selectComponent,
  updateProperty,
};
