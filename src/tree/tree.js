/**
 * Provides utilities for interacting with a tree data structure.
 * Each node in a tree is expected to conform to the following structure: { id, parent, type, value }
 */
class Tree {
  /**
   * Appends a node to the root children array.
   * @param {Object} tree - The tree to traverse.
   * @param {Object} node - The node to append to the children array.
   */
  static append(tree, node) {
    return { id: 'root', children: [...tree.children, { ...node, parent: 'root' }] };
  }

  static find(tree, target) {
    let targetNode = null;

    // This is inefficient as it travels the entire tree always, but it allows
    // tree traversal algorithm re-use. If performance becomes noticeable this can be optimized.
    Tree.traverse(tree, (node) => {
      const { id } = node;

      if (id === target) {
        targetNode = node;
      }

      return node;
    });

    return targetNode;
  }

  /**
   * Removes a target node.
   * @param {Object} tree - The tree to traverse.
   * @param {string} target - The unique identifier of the target node to remove.
   */
  static remove(tree, target) {
    if (target === 'root') {
      return { id: 'root', children: [] };
    }

    return Tree.traverse(tree, (node) => {
      const { id } = node;

      if (id === target) {
        return undefined;
      }

      return node;
    });
  }

  /**
   * Replaces a target node.
   * @param {Object} tree - The tree to traverse.
   * @param {string} target - The unique identifier of the target;
   * @param {Object} replacement - The replacement node.
   */
  static replace(tree, target, replacement) {
    return Tree.traverse(tree, (node) => {
      const { id, parent } = node;

      if (id === target) {
        const { type, value } = replacement;

        return { id, parent, type, value };
      }

      return node;
    });
  }

  /**
   * Updates a target node.
   * @param {Object} tree - The tree to traverse.
   * @param {string} target - The unique identifier of the target;
   * @param {Object} value - The replacement value.
   */
  static update(tree, target, value) {
    return Tree.traverse(tree, (node) => {
      const { id } = node;

      if (id === target) {
        return { ...node, value };
      }

      return node;
    });
  }

  /**
   * Travels a node tree.
   * @param {Node} node - The starting node.
   * @param {func} callback - A callback to execute on each node.
   */
  static travel(node, callback) {
    const { type, value } = node;

    if (type === 'element' && value) {
      return Tree.travelElement(node, callback);
    }

    if (type === 'node') {
      return Tree.travelNode(node, callback);
    }

    return callback(node);
  }

  /**
   * Travels an element node tree.
   * @param {Node} node - The starting node.
   * @param {func} callback - A callback to execute on each node.
   */
  static travelElement(node, callback) {
    const { value } = node;
    const { props } = value;

    const properties = {};
    Object.keys(props || {}).forEach((prop) => {
      const property = props[prop];
      const traveledProperty = Tree.travel(property, callback);

      if (traveledProperty) {
        properties[prop] = traveledProperty;
      } else {
        properties[prop] = { ...property, value: undefined };
      }
    });

    return callback({ ...node, value: { ...value, props: properties } });
  }

  /**
   * Travels a node tree.
   * @param {Node} node - The starting node.
   * @param {func} callback - A callback to execute on each node.
   */
  static travelNode(node, callback) {
    const { value } = node;

    const nodes = [];

    for (let index = 0; index < value.length; index += 1) {
      const traveledNode = Tree.travel(value[index], callback);

      if (traveledNode && traveledNode.value !== undefined) {
        nodes.push(traveledNode);
      }
    }

    return callback({ ...node, value: nodes });
  }

  /**
   * Traverses the entire tree. Executing the provided callback for each node.
   * @param {Object} tree - The tree to traverse.
   * @param {func} callback - A callback to execute on each node.
   * @returns {Object} - The resulting tree.
   */
  static traverse(tree, callback) {
    const children = [];

    for (let index = 0; index < tree.children.length; index += 1) {
      const node = Tree.travel(tree.children[index], callback);

      if (node) {
        children.push(node);
      }
    }

    return { id: 'root', children };
  }
}

export default Tree;
