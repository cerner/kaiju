import drag from '../../../utilities/drag/drag';
import { destroy, postMessage, select } from '../utilities/messenger';

const initializeDrag = () => {
  drag({
    canMove: target => target.hasAttribute('data-kaiju-component-id'),
    isSortable: target => target.hasAttribute('data-kaiju-sortable'),
    onDragStart: (event, target) => {
      select(null);
      destroy(target.getAttribute('data-kaiju-component-id'));
    },
    onDrop: (event, target, sibling) => {
      const data = event.dataTransfer.getData('text');
      const properties = data.length > 0 ? JSON.parse(data) : null;
      const id = (sibling || target).getAttribute('data-kaiju-component-id');
      const message = sibling ? 'kaiju-insert' : 'kaiju-append';
      postMessage({ message, id, properties }, '*');
    },
  });
};

export default initializeDrag;
