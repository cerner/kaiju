import React from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import IconUndo from 'terra-icon/lib/icon/IconReply';
import IconRedo from 'terra-icon/lib/icon/IconForward';
import axios from '../../../../utilities/axios';
import { copy, duplicate, destroy, paste, refresh, select } from '../../utilities/messenger';
import ActionItem from './ActionItem/ActionItem';
import Delete from './Delete/Delete';
import Duplicate from '../../containers/DuplicateWorkspaceContainer';
import Rename from './Rename/Rename';
import Share from './Share/Share';
import SizeControl from '../SizeControl/SizeControl';
import './ActionBar.scss';

const propTypes = {
  /**
   * The canvas size
   */
  canvasSize: PropTypes.string,
  /**
   * Callback function triggered when a workspace is deleted
   */
  onDelete: PropTypes.func,
  /**
   * Callback function triggered when a workspace is renamed
   */
  onRename: PropTypes.func,
  /**
   * Callback function triggered when the canvas is resized
   */
  onResize: PropTypes.func,
  /**
   * The currently selected component
   */
  selectedComponent: PropTypes.object,
  /**
   * The current workspace
   */
  workspace: PropTypes.object,
};

class ActionBar extends React.Component {
  static deselect() {
    select(null);
  }

  static destroy() {
    destroy();
  }

  constructor() {
    super();
    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.duplicate = this.duplicate.bind(this);
    this.handleShortcuts = this.handleShortcuts.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind(['command+c', 'ctrl+c'], copy);
    Mousetrap.bind(['command+v', 'ctrl+v'], paste);
    Mousetrap.bind(['command+z', 'ctrl+z'], this.undo);
    Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], this.redo);
    Mousetrap.bind(['backspace', 'delete'], ActionBar.destroy);
    Mousetrap.bind(['esc'], ActionBar.deselect);
    Mousetrap.bind(['command+d', 'ctrl+d'], this.duplicate);
    window.addEventListener('message', this.handleShortcuts);
  }

  componentWillUnmount() {
    Mousetrap.unbind(['command+c', 'ctrl+c'], copy);
    Mousetrap.unbind(['command+v', 'ctrl+v'], paste);
    Mousetrap.unbind(['command+z', 'ctrl+z'], this.undo);
    Mousetrap.unbind(['command+shift+z', 'ctrl+shift+z'], this.redo);
    Mousetrap.unbind(['backspace', 'delete'], ActionBar.destroy);
    Mousetrap.unbind(['esc'], ActionBar.deselect);
    Mousetrap.unbind(['command+d', 'ctrl+d'], this.duplicate);
    window.removeEventListener('message', this.handleShortcuts);
  }

  /**
   * Sends a request to duplicate the selected item.
   * @return {Boolean} - False if the default action should be prevented, otherwise true.
   */
  duplicate() {
    const { selectedComponent } = this.props;

    if (selectedComponent) {
      duplicate(selectedComponent.id);

      // Returning false is a feature of mousetrap to prevent default actions.
      return false;
    }

    return true;
  }

  handleShortcuts({ data }) {
    if (data.message === 'kaiju-undo') {
      this.undo();
    } else if (data.message === 'kaiju-redo') {
      this.redo();
    }
  }

  undo() {
    axios
     .put(this.props.workspace.undoUrl)
     .then(({ status, data }) => {
       if (status === 200 || status === 201) {
         const componentId = data.component_id;
         if (componentId) {
           refresh(componentId);
         }
       }
     });
  }

  redo() {
    axios
     .put(this.props.workspace.redoUrl)
     .then(({ status, data }) => {
       if (status === 200 || status === 201) {
         const componentId = data.component_id;
         if (componentId) {
           refresh(componentId);
         }
       }
     });
  }

  render() {
    const { canvasSize, onRename, onDelete, onResize, selectedComponent, workspace } = this.props;
    const { codeUrl, component, collaborationInvitation, id, name, previewUrl, rename, url } = workspace;
    const navigateToCode = () => window.open(codeUrl, '_blank');
    const navigateToPreview = () => window.open(previewUrl, '_blank');
    const navigateToAttributes = () => window.open(`${selectedComponent ? selectedComponent.url : component.url}/attributes`, '_blank');

    return (
      <div className="kaiju-ActionBar">
        <div className="kaiju-ActionBar-actions">
          <ActionItem title="Undo" onClick={this.undo}>
            <IconUndo />
          </ActionItem>
          <ActionItem title="Redo" onClick={this.redo}>
            <IconRedo />
          </ActionItem>
          <ActionItem title="Rename">
            <Rename onRename={newName => onRename(id, newName)} renameUrl={rename} workspaceName={name} />
          </ActionItem>
          <ActionItem title="Duplicate">
            <Duplicate />
          </ActionItem>
          <ActionItem title="Delete">
            <Delete url={url} workspaceName={name} onDelete={() => onDelete(id)} />
          </ActionItem>
          <ActionItem iconType="code-o" onClick={navigateToCode} title="Code" />
          <ActionItem iconType="bars" onClick={navigateToAttributes} title="Attributes" />
          <ActionItem title="Share">
            <Share collaborationInvitation={collaborationInvitation} />
          </ActionItem>
          <ActionItem iconType="eye-o" onClick={navigateToPreview} title="Preview" />
          <SizeControl onChange={onResize} selectedSize={canvasSize} />
        </div>
      </div>
    );
  }
}

ActionBar.propTypes = propTypes;

export default ActionBar;
