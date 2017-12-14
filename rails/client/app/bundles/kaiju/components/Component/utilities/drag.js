import { addParentOverlay, removeOverlay } from './overlay';
import drag from '../../../utilities/drag/drag';

const initializeDrag = () => {
  drag({
    canMove: target => target.hasAttribute('data-kaiju-component-type') && target.getAttribute('data-kaiju-component-type') !== 'kaiju::Workspace',
    isSortable: target => target.hasAttribute('data-kaiju-sortable'),
    stopPropagation: (target) => {
      const stop = target.classList.contains('kaiju-Placeholder');
      if (stop) {
        removeOverlay();
      }
      return stop;
    },
    onDragStart: (event, target) => {
      const id = target.getAttribute('data-kaiju-component-id');
      window.postMessage({ message: 'kaiju-select', id: null }, '*');
      window.postMessage({ message: 'kaiju-destroy', id }, '*');
    },
    onDragOver: (event, target) => {
      addParentOverlay(target);
    },
    onDragLeave: ({ clientX, clientY }) => {
      const clientWidth = document.body.clientWidth;
      const clientHeight = document.body.clientHeight;
      if (clientX <= 5 || clientY <= 5 || clientX >= clientWidth || clientY >= clientHeight) {
        removeOverlay();
      }
    },
    onDrop: (event, target, sibling) => {
      const data = event.dataTransfer.getData('text');
      const properties = data.length > 0 ? JSON.parse(data) : null;
      const id = (sibling || target).getAttribute('data-kaiju-component-id');
      const message = sibling ? 'kaiju-insert' : 'kaiju-append';
      window.postMessage({ message, id, properties }, '*');
    },
  });
};

export default initializeDrag;
