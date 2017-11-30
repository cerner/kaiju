import { COLLECT_GARBAGE, REFRESH_STORE, UPDATE_PROPERTY } from '../actions/actions';

/**
 * Traverses the component state tree collecting attached nodes
 * @param {Object} state - The current state object
 * @param {String} id - The current node identifier
 * @return {Array} - An Array of keys connected to the original state tree
 */
const collectValidKeys = (state, id) => {
  let validKeys = [];

  const properties = state[id].properties;
  Object.keys(properties).forEach((key) => {
    const { type, value } = properties[key];
    if (type === 'Component' && value) {
      validKeys.push(value.id);
      validKeys = validKeys.concat(collectValidKeys(state, value.id));
    }
  });

  return validKeys;
};

/**
 * Removes all keys no longer connected to the state tree
 * @param {Object} state - The current state tree
 * @param {String} root - The root tree node identifier
 * @return {Object} - A new state object with orphan keys removed
 */
const destroyGarbage = (state, root) => {
  const newStore = { [root]: state[root] };
  const selectedComponent = state.selectedComponent;
  const validKeys = collectValidKeys(state, root);

  for (let index = 0; index < validKeys.length; index += 1) {
    newStore[validKeys[index]] = state[validKeys[index]];
  }

  if (newStore[selectedComponent]) {
    newStore.selectedComponent = selectedComponent;
  }

  return newStore;
};

const reducers = (state = {}, action) => {
  switch (action.type) {
    case COLLECT_GARBAGE:
      return destroyGarbage(state, action.root);
    case REFRESH_STORE:
      return {
        ...state,
        ...action.store,
        [action.id]: {
          ...action.store[action.id],
          insertAfterUrl: state[action.id].insertAfterUrl,
          insertBeforeUrl: state[action.id].insertBeforeUrl,
          propertyUrl: state[action.id].propertyUrl,
        },
      };
    case UPDATE_PROPERTY:
      return {
        ...state,
        [state[action.id].id]: {
          ...state[action.id],
          properties: {
            ...state[action.id].properties,
            [state[action.id].properties[action.property.id].id]: {
              ...state[action.id].properties[action.property.id],
              value: action.value,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default reducers;
