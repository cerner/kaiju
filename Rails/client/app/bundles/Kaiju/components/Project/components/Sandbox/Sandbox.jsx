import React from 'react';
import PropTypes from 'prop-types';
import ActionBar from '../ActionBar/ActionBar';
import './Sandbox.scss';

const propTypes = {
  /**
   * The current canvas size
   */
  canvasSize: PropTypes.string,
  /**
   * Callback function triggered when the Workpsace is deleted
   */
  onDelete: PropTypes.func,
  /**
   * Callback function triggered when the Workpsace is renamed
   */
  onRename: PropTypes.func,
  /**
   * Callback function triggered when the canvas is resized
   */
  onResize: PropTypes.func,
  /**
   * The current open Workspace
   */
  workspace: PropTypes.object,
};

class Sandbox extends React.Component {
  componentWillUnmount() {
    window.postMessage({ message: 'kaiju-component-updated' }, '*');
  }

  render() {
    const { canvasSize, onDelete, onRename, onResize, workspace } = this.props;
    const classes = `kaiju-Sandbox-iframe kaiju-Sandbox--${canvasSize}`;
    return (
      <div className="kaiju-Sandbox">
        <iframe id="kaiju-Sandbox-iframe" className={classes} src={workspace.component.url} title="sandbox" />
        <ActionBar canvasSize={canvasSize} onDelete={onDelete} onRename={onRename} onResize={onResize} workspace={workspace} />
      </div>
    );
  }
}

Sandbox.propTypes = propTypes;

export default Sandbox;
