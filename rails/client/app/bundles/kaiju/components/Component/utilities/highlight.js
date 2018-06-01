import Tether from 'tether';
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
  highlightReference.style.height = `${rect.height - 2}px`;
  highlightReference.style.width = `${rect.width - 2}px`;

  tether = new Tether({
    element: highlightReference,
    target,
    attachment: 'top left',
    targetAttachment: 'top left',
  });
};

export { addHighlight, removeHighlight };
