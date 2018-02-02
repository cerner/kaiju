import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ActionBar from '../ActionBar/ActionBar';
import Alert from '../../../common/Alert/Alert';
import styles from './Sandbox.scss';

const cx = classNames.bind(styles);

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
   * The currently selected component
   */
  selectedComponent: PropTypes.object,
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
    const {
      canvasSize,
      onDelete,
      onRename,
      onResize,
      selectedComponent,
      workspace,
    } = this.props;

    return (
      <div className={cx('sandbox')}>
        { !workspace.isEditable && <Alert title="Read-only view." description="You are not authorized to edit this workspace." /> }
        <div className={cx('content')}>
          <div className={cx('container')}>
            <iframe
              id="kaiju-Sandbox-iframe"
              className={cx('iframe', canvasSize)}
              src={workspace.component.url}
              title="sandbox"
            />
          </div>
          <ActionBar
            canvasSize={canvasSize}
            onDelete={onDelete}
            onRename={onRename}
            onResize={onResize}
            workspace={workspace}
            selectedComponent={selectedComponent}
          />
        </div>
      </div>
    );
  }
}

Sandbox.propTypes = propTypes;

export default Sandbox;
