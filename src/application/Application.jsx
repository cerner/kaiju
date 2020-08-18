import React, { useEffect, useReducer } from 'react';
import TerraApplication from 'terra-application';
import classNames from 'classnames/bind';
import Canvas from '../canvas';
import Catalog from '../catalog';
import Editor from '../editor';
import reducer, { initialState } from '../reducer';
import useStackReducer from '../reducer/useStackReducer';
import { ApplicationStateProvider } from '../context';
import styles from './Application.module.scss';

const cx = classNames.bind(styles);

const Application = () => {
  const [state, dispatch] = useStackReducer(reducer, initialState);

  useEffect(() => {
    function handleMessage(event) {
      const { data } = event;
      const { message } = data;

      switch (message) {
        case 'SANDBOX.DISPATCH.UNDO':
          dispatch({ type: 'UNDO' });
          break;
        case 'SANDBOX.DISPATCH.REDO':
          dispatch({ type: 'REDO' });
          break;
        case 'SANDBOX.DISPATCH.APPEND':
          dispatch({ type: 'APPEND', component: data.component });
          break;
        case 'SANDBOX.DISPATCH.REMOVE':
          dispatch({ type: 'REMOVE', id: data.id });
          break;
        case 'SANDBOX.DISPATCH.REPLACE':
          dispatch({ type: 'REPLACE', id: data.id, replacement: data.replacement });
          break;
        case 'SANDBOX.STATE.REQUEST':
          event.source.postMessage({ message: 'SANDBOX.STATE.UPDATE', state });
          break;
        case 'SANDBOX.DISPATCH.SELECT':
          dispatch({ type: 'SELECT', id: data.id });
          break;
        default:
          console.log(`WARNING: Unsupported message. ${message}`);
      }
    }

    /**
     * Handles the on key down event.
     * @param {Event} event - The on key down event.
     */
    const handleKeyDown = (event) => {
      const { ctrlKey, metaKey, keyCode, shiftKey } = event;

      if ((ctrlKey || metaKey) && shiftKey && keyCode === 90) {
        dispatch({ type: 'REDO' });
      } else if ((ctrlKey || metaKey) && keyCode === 90) {
        dispatch({ type: 'UNDO' });
      }
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();

      // Chrome requires returnValue to be set to present the confirmation dialog.
      event.returnValue = ''; // eslint-disable-line no-param-reassign
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Communicate state updates to the iframe.
    const sandbox = document.getElementById('sandbox');

    if (sandbox) {
      sandbox.contentWindow.postMessage({ message: 'SANDBOX.STATE.UPDATE', state });
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleKeyDown);
    };
  }, [dispatch, state]);

  return (
    <TerraApplication>
      <ApplicationStateProvider state={state} dispatch={dispatch}>
        <div className={(cx('application'))}>
          <Catalog />
          <Canvas />
          <Editor />
        </div>
      </ApplicationStateProvider>
    </TerraApplication>
  );
};

export default Application;
