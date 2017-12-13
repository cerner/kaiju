/**
 * Opens a Workspace tab
 * @param {String} id - The id of the Workspace to open in a tab
 */
const openTab = id => ({
  type: 'OPEN_TAB',
  id,
});

/**
 * Closes a Workspace tab
 * @param {String} id - The id of the Workspace to close
 * @param {String} next - The id of the next tab to open as the current one closes
 *                        Usually the tab immediately to the right of the tab requesting to be closed.
 *                        If null the default tab will open displaying the list of available workspaces.
 */
const closeTab = (id, next) => ({
  type: 'CLOSE_TAB',
  id,
  next,
});

/**
 * Adds a Workspace
 * @param {Object} workspace - The properties of the Workspace
 */
const addWorkspace = workspace => ({
  type: 'ADD_WORKSPACE',
  ...workspace,
});

/**
 * Removes a Workspace
 * @param {String} id - The ID of the Workspace to be removed
 */
const removeWorkspace = id => ({
  type: 'REMOVE_WORKSPACE',
  id,
});

/**
 * Renames a Workspace
 * @param {String} id - The ID of the Workspace to be removed
 * @param {String} name - The new Workspace name
 */
const renameWorkspace = (id, name) => ({
  type: 'RENAME_WORKSPACE',
  id,
  name,
});

/**
 * Sets the canvas size
 * @param {String} size - The size of the canvas
 */
const setCanvasSize = size => ({
  type: 'SET_CANVAS_SIZE',
  size,
});

/**
 * Renames the Project
 * @param {String} name - The new Project name
 */
const renameProject = name => ({
  type: 'RENAME_PROJECT',
  name,
});

/**
 * Sets the current active workspace. ( The Workspace that is currently open in a tab )
 * @param {String} id - The ID of the active Workspace
 */
const setActiveWorkspace = id => ({
  type: 'SET_ACTIVE_WORKSPACE',
  id,
});

/**
 * Updates the Component state. ( The properties of the open workspace )
 * @param  {Object} components - A flattened Hash of the components
 * @param  {String} root - The identifier of the root component
 * @param  {String} selectedComponent - The identifier of the selected component
 */
const updateComponent = ({ components, root, selectedComponent }) => ({
  type: 'UPDATE_COMPONENT',
  components,
  root,
  selectedComponent,
});

/**
 * Sets the current active workspace. ( The Workspace that is currently open in a tab )
 * @param {String} id - The ID of the active Workspace
 */
const setReferenceComponents = components => ({
  type: 'SET_REFERENCE_COMPONENTS',
  components,
});

/**
 * Sets the changelog state as viewed / unviewed
 * @param {Boolean} viewed - Whether the changelog has been viewed
 */
const setChangelogViewed = viewed => ({
  type: 'SET_CHANGELOG_VIEWED',
  changelogViewed: viewed,
});

export {
  addWorkspace,
  closeTab,
  openTab,
  removeWorkspace,
  renameWorkspace,
  renameProject,
  setActiveWorkspace,
  setCanvasSize,
  setChangelogViewed,
  setReferenceComponents,
  updateComponent,
};
