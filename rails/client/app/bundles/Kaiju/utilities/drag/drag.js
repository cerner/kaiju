import { addDropMarker, removeDropMarker } from './dropMarker';

const drag = ({
  canMove,
  isSortable,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  stopPropagation,
}) => {
  /**
   * Timeout for throttling events
   */
  let timeout;

  /**
   * Finds the nearest node that matches the callback criteria
   * @param {Node} start - The starting node
   * @param {Function} callback - Criteria callback function
   * @return {Node || Null} - The nearest accepted node. Null if not found
   */
  const find = (start, callback) => {
    let target = start;
    while (callback(target) === false) {
      if (target === null || target === document.body || (stopPropagation && stopPropagation(target))) {
        return null;
      }
      target = target.parentNode;
    }
    return target;
  };

  /**
   * Calculates the closest distance between the target and coordinate
   * @param {Node} target - The Node target
   * @param {Number} clientX - Source X coordinate
   * @param {Number} clientY - Source Y coordinate
   * @return {Number} - The calculated distance between the closest point of
   *                    the target and ( clientX, clientY )
   */
  const findDistance = (target, clientX, clientY) => {
    let targetX = null;
    let targetY = null;
    const { left, right, top, bottom } = target.getBoundingClientRect();

    if (right < clientX) {
      targetX = right;
    } else if (left > clientX) {
      targetX = left;
    } else {
      targetX = clientX;
    }

    if (top > clientY) {
      targetY = top;
    } else if (bottom < clientY) {
      targetY = bottom;
    } else {
      targetY = clientY;
    }

    // eslint-disable-next-line
    return Math.sqrt(Math.pow((clientX - targetX), 2) + Math.pow((clientY - targetY), 2));
  };

  /**
   * Finds the nearest sortable node
   * @param {Node} target - The starting node
   * @param {Number} clientX - The event x coordinate
   * @param {Number} clientY - The event y coordinate
   * @return {Node || Null} - The nearest sortable node. Null if not found
   */
  const findSortable = ({ target, clientX, clientY }) => {
    if (!isSortable || (stopPropagation && stopPropagation(target))) {
      return null;
    } else if (isSortable(target)) {
      return target;
    }

    let closestTarget = null;
    let closestDistance = null;
    for (let index = 0; index < target.children.length; index += 1) {
      if (isSortable(target.children[index])) {
        const distance = findDistance(target.children[index], clientX, clientY);
        if (closestDistance === null || distance < closestDistance) {
          closestDistance = distance;
          closestTarget = target.children[index];
        }
      }
    }

    return closestTarget || find(target, isSortable);
  };

  /**
   * Determines the node to insert before based on a given screen coordinate
   * @param {Node} target - The node located at the given coordinate
   * @param {Number} clientX - X coordinate
   * @param {Number} clientY - Y coordinate
   * @return {Object} Placement data for the provided target
   */
  const findNextSibling = (target, clientX, clientY) => {
    const { left, right, top, bottom } = target.getBoundingClientRect();

    switch (window.getComputedStyle(target).display) {
      case 'inline':
      case 'inline-block':
      case 'inline-flex':
      case 'table-cell':
        return clientX <= ((left + right) / 2) ? target : target.nextSibling;
      default:
        return clientY <= ((top + bottom) / 2) ? target : target.nextSibling;
    }
  };

  /**
   * Stages the nearest movable element for drag events
   * @param {Event} event - The original mouse down event
   */
  const handleMouseDown = (event) => {
    if (!canMove) { return; }

    const target = find(event.target, canMove);
    if (target) {
      target.setAttribute('draggable', true);
    }
  };

  /**
   * Callback function invoked on drag start
   * @param {Event} event - DOM Event
   */
  const handleDragStart = (event) => {
    if (onDragStart && isSortable && canMove(event.target)) {
      event.dataTransfer.setData('text', '');
      onDragStart(event, event.target);
    }
  };

  /**
   * Callback function invoked on drag enter
   * @param {Event} event - DOM Event
   */
  const handleDragEnter = (event) => {
    clearTimeout(timeout);
    timeout = null;

    if (onDragEnter) {
      onDragEnter(event);
    }
  };

  /**
   * Callback function invoked on drag over
   * @param {Event} event - DOM Event
   */
  const handleDragOver = (event) => {
    event.preventDefault();

    if (timeout) { return; }
    timeout = setTimeout(() => { timeout = null; }, 300);

    const sortable = findSortable(event);
    if (!sortable) { return; }

    const nextSibling = findNextSibling(sortable, event.clientX, event.clientY);
    addDropMarker(sortable, nextSibling);

    if (onDragOver) {
      onDragOver(event, sortable, nextSibling);
    }
  };

  /**
   * Callback function invoked on drag leave
   * @param {Event} event - DOM Event
   */
  const handleDragLeave = (event) => {
    removeDropMarker();

    if (onDragLeave) {
      onDragLeave(event);
    }
    /** TODO: Increase performance by commenting out unused code * */
    // if (onDragLeave && isSortable && isSortable(event.target)) {
    //   onDragLeave(event, event.target, event.target.parentNode);
    // }
  };

  /**
   * Callback function invoked on drop
   * @param {Event} event - DOM Event
   */
  const handleDrop = (event) => {
    event.preventDefault(); // Required for firefox
    removeDropMarker();
    if (!onDrop) { return; }

    const sortable = findSortable(event);
    if (!sortable) { return; }

    const nextSibling = findNextSibling(sortable, event.clientX, event.clientY);
    onDrop(event, sortable, nextSibling);
  };

  document.addEventListener('drop', handleDrop);
  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('dragenter', handleDragEnter);
  document.addEventListener('dragleave', handleDragLeave);
  document.addEventListener('dragstart', handleDragStart);
  document.addEventListener('mousedown', handleMouseDown);
};

export default drag;
