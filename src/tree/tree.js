class Tree {
  // Remove
  // Replace
  // Traverse
  // Insert
  // Append
  // Update
  // Find.

  // Node - id, parent, type, value

  static find(tree, target) {
    const travel = (node) => {
      const { id } = node;

      if (id === target) {
        return node;
      }

      return null;
    };

    for (let index = 0; index < tree.children.length; index += 1) {
      const found = travel(tree.children[index]);

      if (found) {
        return found;
      }
    }

    return null;
  }

  /**
   * Replaces a target node.
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
        const { props = {} } = value;

        Object.keys(props).forEach((property) => {
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
