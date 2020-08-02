import React, { useState, useEffect } from 'react';
import TerraApplication from 'terra-application';
import ApplicationLoadingOverlay from 'terra-application/lib/application-loading-overlay';
import Renderer from '../renderer';
import './Sandbox.module.scss';

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

  return (
    <TerraApplication>
      <ApplicationLoadingOverlay isOpen={!state} />
      {sandbox && sandbox.map((component) => Renderer.render(component))}
    </TerraApplication>
  );
};
export default Sandbox;
