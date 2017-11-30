import Tether from 'tether';
import classNames from 'classnames';
import './highlight.scss';

/**
 * The Highlight
 */
let highlight;
/**
 * The Tether object bound to the Highlight
 */
let tether;

/**
 * Lazy loads the Highlight node
 * @return {Node} - The Highlight node
 */
const getHighlight = () => {
  if (highlight) {
    return highlight;
  }

  const container = document.createElement('div');
  container.className = 'kaiju-Highlight';

  document.body.append(container);
  highlight = container;

  return highlight;
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
    'kaiju-Highlight-label',
    { 'kaiju-Highlight-label--inset': rect.top < 30 && rect.height > 30 },
  ]);

  if (rect.top < 30 && rect.height <= 30) {
    text.style.top = `${scrollTop + rect.height}px`;
  }

  return text;
};

/**
 * Removes the Highlight
 */
const removeHighlight = () => {
  if (tether) {
    tether.destroy();
    tether = null;
  }
  getHighlight().innerHTML = '';
  getHighlight().style.display = 'none';
};

/**
 * Adds an Highlight for the provided Node
 * @param {String} id - The component identifier to add the highlight to
 * @param {Boolean} preserve - Boolean indicating if the highlight should be preserved
 *                             if the requesting highlight is identical
 */
const addHighlight = (target) => {
  if (!target) {
    removeHighlight();
    return;
  }

  const rect = target.getBoundingClientRect();
  const highlightReference = getHighlight();

  highlightReference.innerHTML = '';
  highlightReference.style.display = '';
  highlightReference.style.height = `${rect.height}px`;
  highlightReference.style.width = `${rect.width}px`;

  // Uncomment this line to add a label to each highlight
  // highlightReference.appendChild(getTargetLabel(target, rect));

  tether = new Tether({
    element: highlightReference,
    target,
    attachment: 'top left',
    targetAttachment: 'top left',
  });
};

export { addHighlight, removeHighlight };
