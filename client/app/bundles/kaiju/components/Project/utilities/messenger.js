/**
 * @return {window} - The component iframe window
 */
const getTargetWindow = () => document.getElementById('kaiju-Sandbox-iframe').contentWindow;

/**
 * Posts a message to the component window
 */
const postMessage = (message) => getTargetWindow().postMessage(message, '*');

/**
 * Deletes a Component
 * @param {String} id - The Component identifier
 */
const destroy = (id) => {
  postMessage({ message: 'kaiju-destroy', id });
};

/**
 * Duplicates a Component
 * @param {String} id - The Component identifier
 */
const duplicate = (id) => {
  postMessage({ message: 'kaiju-duplicate', id });
};

/**
 * Duplicates a Component property
 * @param {String} id - The Component identifier
 */
const duplicateProperty = (id, property) => {
  postMessage({ message: 'kaiju-duplicate-property', id, property });
};

/**
 * Refreshes a Component
 * @param {String} id - The Component identifier
 */
const refresh = (id) => {
  postMessage({ message: 'kaiju-refresh', id });
};

/**
 * Selects a Component
 * @param {String} id - The Component identifier
 */
const select = (id) => {
  postMessage({ message: 'kaiju-select', id });
};

/**
 * Updates a Component property
 * @param {String} id - The Component identifier
 */
const update = (id, property, value) => {
  postMessage({
    message: 'kaiju-update', id, property, value,
  });
};

/**
 * Request highlight for a specific component
 * @param {String} id - The Component identifier
 */
const highlight = (id) => {
  postMessage({ message: 'kaiju-highlight', id });
};

/**
 * Removes a components highlight
 */
const removeHighlight = () => {
  postMessage({ message: 'kaiju-remove-highlight' });
};

/**
 * Replaces a component.
 */
const replace = (target, properties) => {
  postMessage({ message: 'kaiju-replace', target, properties });
};

/**
 * Copies the selected component into the clipboard
 */
const copy = () => {
  postMessage({ message: 'kaiju-copy' });
};

/**
 * Pastes a component into a placeholder
 */
const paste = () => {
  postMessage({ message: 'kaiju-paste' });
};

export {
  copy,
  destroy,
  duplicate,
  duplicateProperty,
  highlight,
  paste,
  postMessage,
  refresh,
  removeHighlight,
  replace,
  select,
  update,
};
