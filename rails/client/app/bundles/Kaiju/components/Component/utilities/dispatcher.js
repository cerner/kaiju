import Mousetrap from 'mousetrap';
import ajax from 'superagent';
import { camelizeKeys } from 'humps';
import { collectGarbage, refreshStore, selectComponent, updateProperty } from '../actions/actions';
import { flattenComponent, serializeComponent, serializeObject } from './normalizer';
import { addHighlight, removeHighlight } from './highlight';
import { addOverlay } from './overlay';

/**
 * Registers a dispatcher to a store
 * @param {Object} store - The store
 * @param {String} root - The identifier of the root component
 */
const registerDispatcher = (store, root) => {
  /**
   * Debounces service calls
   * Prevents Strings making a service call for every character as a user types
   * @type {Timer}
   */
  let stringDebounce = null;

  /**
   * The last destroyed component
   * @type {Node}
   */
  let lastDestroyed = null;

  /**
   * Posts a message to the parent window
   * @param {Object} message - The message being passed to the parent window
   */
  const post = message => window.parent.postMessage(message, '*');

  /**
   * Fetches a property from the store
   * @param {String} id - The property identifier
   * @return {*} The requsted property from the store
   */
  const fetch = id => store.getState().components[id];

  /**
   * Fetches the selected component
   * @return {String} - The indentifier of the selected component
   */
  const getSelectedComponent = () => store.getState().selectedComponent;

  /**
   * Adds and overlay to the selected component
   */
  const addSelectedOverlay = () => {
    addOverlay(document.querySelectorAll(`[data-kaiju-component-id="${getSelectedComponent()}"]`)[0]);
  };

  /**
   * Serializes a component
   * @param {Object} component - The Component to serialize
   * @return {Object} - A serialized component
   */
  const serialize = object => serializeComponent(store.getState().components, object);

  /**
   * Posts the current state to the parent window
   */
  const postUpdate = () => {
    const { selectedComponent, components } = store.getState();
    post({ message: 'kaiju-component-updated', components, root, selectedComponent }, '*');
  };

  /**
   * Dispatches an action to the redux store
   * @param {Object} action - The action
   */
  const dispatch = (action) => { store.dispatch(action); };

  /**
   * Handles a server error
   */
  const handleError = () => {
    window.parent.location.reload();
  };

  /**
   * Queries the DOM for the csrf-token
   * @return {String} - The csrf-token
   */
  const getToken = () => (
    document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  );

  /**
   * Puts a request
   * @param {String} url - The request URL
   * @param {Object} data - Data to send down with the request
   * @param {Function} callback - Callback function invoked on put completion
   */
  const put = (url, data, callback) => {
    ajax
      .put(url)
      .set('Accept', 'application/json')
      .set('X-CSRF-Token', getToken())
      .send(data)
      .end((error, { text }) => {
        if (error) {
          handleError(error);
        } else if (callback) {
          callback(JSON.parse(text));
        }
      });
  };

  /**
   * Selects a component
   * @param {String} id - The target component identifier
   */
  const select = (id) => {
    dispatch(selectComponent(id));
    postUpdate();
    addSelectedOverlay();
  };

  /**
   * Refreshes a components properties
   * @param {String} id - The component identifier
   * @param {String} target - Optional target identifier to set as selected
   */
  const refresh = (id, target) => {
    ajax
      .get(fetch(id).url)
      .set('Accept', 'application/json')
      .end((error, { text }) => {
        if (error) {
          handleError(error);
        } else {
          dispatch(refreshStore(id, flattenComponent(camelizeKeys(JSON.parse(text)))));
          dispatch(collectGarbage(root));
          if (fetch(target || getSelectedComponent())) {
            select(fetch(target || getSelectedComponent()).id);
          } else {
            select(null);
          }
        }
      });
  };

  /**
   * Replaces a target component with the provided properties
   * @param {String} id - The target identifier
   * @param {Object} properties - The replacement properties
   */
  const replace = (id, properties) => {
    const { parent, url } = fetch(id);
    put(url, { component: properties }, () => refresh(parent, id));
  };

  /**
   * Destroys a Component
   * @param {String} id - The component identifier
   */
  const destroy = (id) => {
    const target = fetch(id);
    const parent = target.parent || root;
    const targetUrl = target.id === root ? target.properties.children.url : target.propertyUrl;
    lastDestroyed = serialize(target);

    ajax
    .delete(targetUrl)
    .set('X-CSRF-Token', getToken())
    .end((error) => {
      if (error) {
        handleError(error);
      } else {
        refresh(parent);
      }
    });
  };

  /**
   * Duplicates a component
   * @param {String} id - The component identifier
   */
  const duplicate = (id) => {
    const target = fetch(id);
    if (target.insertAfterUrl) {
      const properties = serialize(target);
      put(target.insertAfterUrl, { value: properties }, () => refresh(target.parent));
    } else {
      // eslint-disable-next-line no-console
      console.warn('Non-Array Element requested duplication');
    }
  };

  const duplicateProperty = (id, property) => {
    ajax
    .put(property.insertAfterUrl)
    .set('Accept', 'application/json')
    .set('X-CSRF-Token', getToken())
    .send({ value: serializeObject(store.getState().components, property, fetch(id).properties) })
    .end(() => {
      refresh(id);
    });
  };


  /**
   * Inserts a component before a target
   * @param {String} id - The target identifier
   * @param {Object} properties - The component properties
   */
  const insert = (id, properties) => {
    const { insertBeforeUrl, parent } = fetch(id);
    put(insertBeforeUrl, { value: properties }, (response) => {
      refresh(parent, response.value.id);
    });
  };

  /**
   * Appends a component after a target
   * @param {String} id - The target identifier
   * @param {Object} properties - The component properties
   */
  const append = (id, properties) => {
    const { insertAfterUrl, parent } = fetch(id);
    put(insertAfterUrl, { value: properties }, (response) => {
      refresh(parent, response.value.id);
    });
  };

  const putProperty = (url, value) => {
    put(url, { value });
    stringDebounce = null;
  };

  /**
   * Updates a property and saves to the database
   * @param {[type]} id - The component identifier
   * @param {Object} property - The property object
   * @param {*} value - The new value of the property
   */
  const update = (id, property, value) => {
    dispatch(updateProperty(id, property, value));
    if (property.type === 'String' || stringDebounce) {
      clearTimeout(stringDebounce);
      stringDebounce = null;
      stringDebounce = setTimeout(() => putProperty(property.url, value), 250);
    } else {
      putProperty(property.url, value);
    }
    addSelectedOverlay();
  };

  /**
   * Posts a message to the parent window requesting an undo
   */
  const undo = () => {
    post({ message: 'kaiju-undo' });
  };

  /**
   * Posts a message to the parent window requesting a redo
   */
  const redo = () => {
    post({ message: 'kaiju-redo' });
  };

  /**
   * Dispatches messages to the appropriate functions
   * @param {Object} data - The message data
   */
  const dispatchMessage = ({ data }) => {
    const { message, id } = data;
    if (message === 'kaiju-destroy') {
      destroy(id || getSelectedComponent());
    } else if (message === 'kaiju-duplicate') {
      duplicate(id);
    } else if (message === 'kaiju-duplicate-property') {
      duplicateProperty(id, data.property);
    } else if (message === 'kaiju-insert') {
      insert(id, data.properties || lastDestroyed);
    } else if (message === 'kaiju-append') {
      append(id, data.properties || lastDestroyed);
    } else if (message === 'kaiju-select') {
      select(id);
    } else if (message === 'kaiju-highlight') {
      const target = document.querySelectorAll(`[data-kaiju-component-id="${id}"]`)[0];
      addHighlight(target);
    } else if (message === 'kaiju-remove-highlight') {
      removeHighlight();
    } else if (message === 'kaiju-refresh') {
      refresh(id);
    } else if (message === 'kaiju-replace') {
      replace(data.target, data.properties || lastDestroyed);
    } else if (message === 'kaiju-update') {
      update(id, data.property, data.value);
    }
  };

  postUpdate();
  Mousetrap.bind(['esc'], () => select(null));
  Mousetrap.bind(['backspace', 'delete'], () => destroy(getSelectedComponent()));
  Mousetrap.bind(['command+z', 'ctrl+z'], undo);
  Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], redo);
  window.addEventListener('message', dispatchMessage);
};

export default registerDispatcher;
