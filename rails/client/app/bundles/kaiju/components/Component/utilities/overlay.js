import Tether from 'tether';
import classNames from 'classnames';
import './overlay.scss';

/**
 * The Overlay
 */
let overlay;
/**
 * The Tether object bound to the Overlay
 */
let tether;
/**
 * Callback timer to debounce overlay drawing
 */
let resizeTimer;

/**
 * Lazy loads the Overlay node
 * @return {Node} - The Overlay node
 */
const getOverlay = () => {
  if (overlay) {
    return overlay;
  }

  const container = document.createElement('div');
  container.className = 'kaiju-Overlay';

  document.body.append(container);
  overlay = container;

  return overlay;
};

/**
 * Returns the appropriate target label
 * @param {Node} target - The target requesting a label
 * @param {Object} rect - The target rect
 * @return {String} - A Label indicating the Component type or Tag name
 */
const getTargetLabel = (target, rect) => {
  const scrollTop = target.scrollTop;
  const label = target.getAttribute('data-kaiju-component-type') || target.tagName;
  const text = document.createElement('span');
  text.textContent = label.split('::').pop().replace(/([A-Z])/g, ' $1').trim();

  text.className = classNames([
    'kaiju-Overlay-label',
    { 'kaiju-Overlay-label--inset': rect.top < 30 && rect.height > 30 },
  ]);

  if (rect.top < 30 && rect.height <= 30) {
    text.style.top = `${scrollTop + rect.height}px`;
  }

  return text;
};

/**
 * Removes the Overlay
 */
const removeOverlay = () => {
  if (tether) {
    tether.destroy();
    tether = null;
  }
  getOverlay().innerHTML = '';
  getOverlay().style.display = 'none';
};

/**
 * Adds an Overlay for the provided Node
 * @param {String} id - The component identifier to add the overlay to
 * @param {Boolean} preserve - Boolean indicating if the overlay should be preserved
 *                             if the requesting overlay is identical
 */
const addOverlay = (target) => {
  removeOverlay();

  if (!target) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const overlayReference = getOverlay();

  overlayReference.innerHTML = '';
  overlayReference.style.display = '';
  overlayReference.style.height = `${rect.height}px`;
  overlayReference.style.width = `${rect.width}px`;

  overlayReference.appendChild(getTargetLabel(target, rect));

  tether = new Tether({
    element: overlayReference,
    target,
    attachment: 'top left',
    targetAttachment: 'top left',
  });
};

/**
 * Adds an Overlay to the nearest parent component
 * @param {Node} node - The node requesting the Overlay
 */
const addParentOverlay = (node) => {
  let target = node.parentNode;
  while (!target.getAttribute('data-kaiju-component-id') || target === document.body) {
    target = target.parentNode;
  }
  addOverlay(target);
};

// Redraw the Overlay during any window resize events
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  if (tether) {
    addOverlay(tether.target);
  }
  resizeTimer = setTimeout(() => {
    if (tether) {
      addOverlay(tether.target);
    }
  }, 400);
});

export { addOverlay, addParentOverlay, removeOverlay };
