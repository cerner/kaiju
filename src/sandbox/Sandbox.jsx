import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import TerraApplication from 'terra-application';
import ApplicationLoadingOverlay from 'terra-application/lib/application-loading-overlay';
import Renderer from '../renderer';
import example from '../example-generator';
import styles from './Sandbox.module.scss';

const cx = classNames.bind(styles);

/**
 * Handles the drag over event.
 * @param {Event} event - The drag over event.
 */
const handleDragOver = (event) => {
  event.preventDefault();
};

/**
 * Handles the drag enter event.
 * @param {Event} event - The drag enter event.
 */
const handleDragEnter = (event) => {
  event.preventDefault();
};

const Sandbox = () => {
  const [state, setState] = useState();

  const { sandbox } = state || {};

  useEffect(() => {
    /**
     * Handle messages sent to the sandbox window.
     * @param {Event} event - The post message event.
     */
    function handleMessage(event) {
      const { data } = event;
      const { message } = data;

      if (message === 'SANDBOX.STATE.UPDATE') {
        setState(data.state);
      }
    }

    window.addEventListener('message', handleMessage);

    // Request a state update on mount to populate the sandbox.
    window.parent.postMessage({ message: 'SANDBOX.STATE.REQUEST' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  /**
   * Handles the drop event.
   * @param {Event} event - The drop event.
   */
  const handleDrop = (event) => {
    if (event.target.id === 'root') {
      const sandboxData = event.dataTransfer.getData('SANDBOX.DATA');

      if (sandboxData) {
        const { identifier } = JSON.parse(sandboxData);

        // Generates an example component for the specified plugin.
        const component = example(identifier);

        window.parent.postMessage({ message: 'SANDBOX.DISPATCH.APPEND', component });
      } else {
        console.log('Invalid element dropped');
      }
    }
  };

  /**
   * Handles the click event.
   */
  const handleClick = (event) => {
    let currentTarget = event.target;

    while (!currentTarget.id || (currentTarget.id.indexOf('terra-sandbox') !== 0 && currentTarget.id !== 'root')) {
      currentTarget = currentTarget.parentNode;
    }

    window.parent.postMessage({ message: 'SANDBOX.DISPATCH.SELECT', id: currentTarget.id });
  };

  return (
    <TerraApplication>
      { /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className={cx('sandbox')}
        id="root"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
      >
        <ApplicationLoadingOverlay isOpen={!state} />
        {sandbox && sandbox.children.map((component) => Renderer.render(component))}
      </div>
    </TerraApplication>
  );
};
export default Sandbox;
