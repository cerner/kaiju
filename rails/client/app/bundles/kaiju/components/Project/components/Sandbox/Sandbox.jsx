import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ActionBarContainer from '../../containers/ActionBarContainer';
import Alert from '../../../common/Alert/Alert';
import styles from './Sandbox.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The current canvas size.
   */
  canvasSize: PropTypes.string,
  /**
   * The component URL.
   */
  componentUrl: PropTypes.string,
  /**
   * Whether the workspace is read-nly.
   */
  isReadOnly: PropTypes.bool,
};

class Sandbox extends React.Component {
  componentWillUnmount() {
    window.postMessage({ message: 'kaiju-component-updated' }, '*');
  }

  render() {
    const { canvasSize, componentUrl, isReadOnly } = this.props;

    return (
      <div className={cx('sandbox')}>
        {
          isReadOnly &&
          <Alert
            title="Read-only view."
            description="You are not authorized to edit this workspace."
          />
        }
        <div className={cx('content')}>
          <div className={cx('container')}>
            <iframe
              id="kaiju-Sandbox-iframe"
              className={cx('iframe', canvasSize)}
              src={componentUrl}
              title="sandbox"
            />
          </div>
          <ActionBarContainer />
        </div>
      </div>
    );
  }
}

Sandbox.propTypes = propTypes;

export default Sandbox;
