import Tether from 'tether';
import classNames from 'classnames';
import './dropMarker.scss';

/**
 * The drop marker
 */
let dropMarker;
/**
 * The tether binding the drop marker and target
 */
let tether;

/**
 * Returns a drop marker
 * @return {Node} The dedicated drop marker
 */
const getDropMarker = () => {
  if (dropMarker) {
    return dropMarker;
  }

  const container = document.createElement('div');

  document.body.append(container);
  dropMarker = container;

  return dropMarker;
};

/**
 * Determines if a target is displayed inline
 * @param {Node} target - The node being analyzed
 * @return {Boolean} Whether the target is displayed inline
 */
const isInline = (target) => {
  switch (window.getComputedStyle(target).display) {
    case 'inline':
    case 'inline-block':
    case 'inline-flex':
    case 'table-cell':
      return true;
    default:
      return false;
  }
};

/**
 * Removes the drop marker
 */
const removeDropMarker = () => {
  if (tether) {
    tether.destroy();
  }
  getDropMarker().classList = 'kaiju-DropMarker--hidden';
};

/**
 * Tethers a drop marker to a target
 * @param {Node} target - The initial target
 * @param {Node || null} sibling - The sibling of the target
 * @param {Boolean} isInline - Whether the target is displayed inline
 */
const addDropMarker = (target, sibling) => {
  removeDropMarker();
  const inlineTarget = isInline(target);
  const inlineSibling = sibling ? isInline(sibling) : null;
  const dropTarget = (sibling && inlineTarget === inlineSibling) ? sibling : target;
  const inlineDropMarker = (dropTarget === sibling) ? inlineSibling : inlineTarget;

  const marker = getDropMarker();
  marker.style.width = inlineDropMarker ? '0px' : `${dropTarget.offsetWidth}px`;
  marker.style.height = inlineDropMarker ? `${dropTarget.offsetHeight}px` : '0px';
  marker.className = classNames([
    'kaiju-DropMarker',
    { 'kaiju-DropMarker--inline': inlineDropMarker },
  ]);

  let attachment;
  if (inlineDropMarker) {
    attachment = (dropTarget === sibling) ? 'middle left' : 'middle right';
  } else {
    attachment = 'bottom middle';
  }

  let targetAttachment;
  if (inlineDropMarker) {
    targetAttachment = (dropTarget === sibling) ? 'middle left' : 'middle right';
  } else {
    targetAttachment = (dropTarget === sibling) ? 'top middle' : 'bottom middle';
  }

  tether = new Tether({
    element: getDropMarker(),
    target: dropTarget,
    attachment,
    targetAttachment,
  });
};

export { addDropMarker, removeDropMarker };
