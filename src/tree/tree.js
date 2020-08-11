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
    return { id: 'root', children: [...tree.children, node] };
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
   * Traverses the entire tree. Executing the provided callback for each node.
   * @param {Object} tree - The tree to traverse.
   * @param {func} callback - A callback to execute on each node.
   * @returns {Object} - The resulting tree.
   */
  static traverse(tree, callback) {
    const travel = (node) => {
      const { type, value } = node;

      if (type === 'element') {
        const properties = {};
        const { props } = value;

        Object.keys(props || {}).forEach((property) => {
          properties[property] = callback(props[property]);
        });

        return callback({ ...node, value: { ...value, props: properties } });
      }

      return callback(node);
    };

    const children = [];

    for (let index = 0; index < tree.children.length; index += 1) {
      children.push(travel(tree.children[index]));
    }

    return { id: 'root', children };
  }
}

export default Tree;
