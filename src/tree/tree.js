class Tree {
  // Remove
  // Replace
  // Traverse
  // Insert
  // Append
  // Update

  // Node - id, parent, type, value

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

  static traverse(tree, callback) {
    const travel = (node) => callback(node);

    const children = [];

    for (let index = 0; index < tree.children.length; index += 1) {
      children.push(travel(tree.children[index]));
    }

    return { id: 'root', children };
  }
}

export default Tree;
