import TreeParser from './TreeParser';
import drag from '../../../utilities/drag/drag';

const initializeDrag = (store, root) => {
  drag({
    canMove: (target) => {
      const key = TreeParser.findDOMNodeKey(target);

      if (key) {
        return store.getState().components[key].id !== root;
      }

      return false;
    },
    isSortable: (target) => {
      const key = TreeParser.findDOMNodeKey(target);

      if (key) {
        return !!store.getState().components[key].insertBeforeUrl;
      }

      return false;
    },
    stopPropagation: (target) => {
      const key = TreeParser.findDOMNodeKey(target);

      if (key) {
        return store.getState().components[key].name === 'Placeholder';
      }

      return false;
    },
    onDragStart: (event, target) => {
      window.postMessage({ message: 'kaiju-select', id: null }, '*');
      window.postMessage({ message: 'kaiju-destroy', id: TreeParser.findDOMNodeKey(target) }, '*');
    },
    onDrop: (event, target, sibling) => {
      const data = event.dataTransfer.getData('text');
      const properties = data.length > 0 ? JSON.parse(data) : null;
      const id = TreeParser.findDOMNodeKey(sibling || target);

      if (sibling) {
        window.postMessage({ message: 'kaiju-insert', id, properties }, '*');
      } else {
        window.postMessage({ message: 'kaiju-append', id, properties }, '*');
      }
    },
  });
};

export default initializeDrag;
