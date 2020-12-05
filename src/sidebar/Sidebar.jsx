import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import Catalog from '../catalog';
import Layers from '../layers';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = () => {
  const sidebar = useRef();
  const topSection = useRef();
  const bottomSection = useRef();
  const verticalResizer = useRef();

  /**
   * Modifies the sidebar width as the mouse moves horizontally.
   * @param {event} event - The mouse move event.
   */
  const handleMouseMoveHorizontal = (event) => {
    const { clientX } = event;

    sidebar.current.style.width = `${clientX}px`;
  };

  /**
   * Modifies the layers height as the mouse moves vertically.
   * @param {event} event - The mouse move event.
   */
  const handleMouseMoveVertical = (event) => {
    const resizerHeight = verticalResizer.current.clientHeight;
    const sidebarHeight = sidebar.current.clientHeight;

    const height = Math.max(event.clientY - sidebar.current.offsetTop, 75);
    const topSectionHeight = Math.min(sidebarHeight - resizerHeight - 75, height);
    const bottomSectionHeight = sidebarHeight - topSectionHeight - resizerHeight - 5;

    topSection.current.style.height = `${topSectionHeight}px`;
    bottomSection.current.style.height = `${bottomSectionHeight}px`;
  };

  /**
   * Restores the window state on mouse up.
   */
  const handleMouseUp = () => {
    // Re-enable user selection and pointer events.
    document.body.classList.remove(cx('inactive'));
    document.documentElement.style.cursor = '';

    window.removeEventListener('mousemove', handleMouseMoveHorizontal);
    window.removeEventListener('mousemove', handleMouseMoveVertical);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  /**
   * Initializes listeners for resizing the sidebar.
   * @param {event} event - The mouse down event.
   */
  const handleMouseDownHorizontal = (event) => {
    // Only accept left mouse clicks.
    if (event.button > 1) {
      return;
    }

    // Persists the horizontal resize cursor for the duration of the action.
    // Without this the cursor will default back to a pointer during a resize action.
    document.documentElement.style.cursor = 'ew-resize';

    // Disable user selection and pointer events to prevent interference during resizing.
    document.body.className += cx('inactive');

    window.addEventListener('mousemove', handleMouseMoveHorizontal);
    window.addEventListener('mouseup', handleMouseUp);
  };

  /**
   * Initializes listeners for resizing the bottom section vertically.
   * @param {event} event - The mouse down event.
   */
  const handleMouseDownVertical = (event) => {
    // Only accept left mouse clicks.
    if (event.button > 1) {
      return;
    }

    document.documentElement.style.cursor = 'ns-resize';

    // Disable user selection and pointer events to prevent interference during resizing.
    document.body.className += cx('inactive');

    window.addEventListener('mousemove', handleMouseMoveVertical);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    // eslint-disable-next-line react/forbid-dom-props
    <div className={cx('sidebar')} ref={sidebar}>
      <div className={cx('content')}>
        <div className={cx('top-section')} ref={topSection}>
          <Catalog />
        </div>
        <div className={cx('vertical-resizer')} onMouseDown={handleMouseDownVertical} role="presentation" ref={verticalResizer} />
        <div className={(cx('bottom-section'))} ref={bottomSection}>
          <Layers />
        </div>
      </div>
      <div className={cx('horizontal-resizer')} onMouseDown={handleMouseDownHorizontal} role="presentation" />
    </div>
  );
};

export default Sidebar;
