import React from 'react';
import classNames from 'classnames/bind';
import ComponentSearchContainer from '../../containers/ComponentSearchContainer';
import LayersContainer from '../../containers/LayersContainer';
import SectionHeader from '../SectionHeader/SectionHeader';
import styles from './Sidebar.scss';

const cx = classNames.bind(styles);

class Sidebar extends React.Component {
  constructor() {
    super();

    this.state = {
      vertical: false,
      height: '60%',
      width: '230',
    };

    this.offset = 0;
    this.setTarget = this.setTarget.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleVerticalResize = this.handleVerticalResize.bind(this);
    this.handleHorizontalResize = this.handleHorizontalResize.bind(this);
  }

  /**
   * Sets the target container that will be resized.
   */
  setTarget(target) {
    this.target = target;
  }

  /**
   * Handles the mouse down event.
   */
  handleMouseDown() {
    // Disable user selection and pointer events to prevent interference during resizing.
    document.body.className += cx('inactive');

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Handles the mouse move event.
   * @param {event} event - The event.
   */
  handleMouseMove(event) {
    const { clientX, clientY } = event;

    if (this.state.vertical) {
      const { top } = this.target.getBoundingClientRect();
      // The offset provides a "center-of-gravity" drag interaction.
      this.setState({ height: `${(clientY - top) - this.offset}px` });
    } else {
      this.setState({ width: clientX });
    }
  }

  /**
   * Handles the mouse up event. Restores previous document interactions.
   */
  handleMouseUp() {
    // Re-enable user selection and pointer events.
    document.body.className = '';
    document.documentElement.style.cursor = '';

    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Handles the initiation of horizontally resizing the sidebar.
   */
  handleHorizontalResize(event) {
    // Only accept left mouse clicks.
    if (event.button > 1) {
      return;
    }

    // Persists the horizontal resize cursor for the duration of the action.
    // Without this the cursor will default back to a pointer during a resize action.
    document.documentElement.style.cursor = 'ew-resize';

    this.setState({ vertical: false });
    this.handleMouseDown();
  }

  /**
   * Handles the initiation of vertically resizing the layers.
   */
  handleVerticalResize(event) {
    // Only accept left mouse clicks.
    if (event.button > 1) {
      return;
    }

    const { top } = event.target.getBoundingClientRect();

    // The offset provides a "center-of-gravity" drag interaction.
    this.offset = event.clientY - top;
    document.documentElement.style.cursor = 'ns-resize';

    this.setState({ vertical: true });
    this.handleMouseDown();
  }

  render() {
    return (
      <div className={cx('sidebar')} style={{ flex: `0 0 ${this.state.width}px` }}>
        <div className={cx('components')} ref={this.setTarget} style={{ height: this.state.height }}>
          <ComponentSearchContainer />
        </div>
        <div className={cx('layers')}>
          <div className={cx('layers-header')} onMouseDown={this.handleVerticalResize} role="presentation">
            <SectionHeader title="Layers" />
          </div>
          <LayersContainer />
        </div>
        <div className={cx('resizer')} onMouseDown={this.handleHorizontalResize} role="presentation" />
      </div>
    );
  }
}

export default Sidebar;
