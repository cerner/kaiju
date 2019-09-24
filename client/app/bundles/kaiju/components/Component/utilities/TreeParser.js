class TreeParser {
  /**
   * Returns the associated FiberNode.
   * @param {DOMNode} node - The DOM Node.
   * @return {FiberNode} - The FiberNode.
   */
  static getFiberNode(node) {
    if (node) {
      return node[Object.keys(node).find((key) => key.startsWith('__reactInternalInstance$'))];
    }
    return null;
  }

  /**
   * Finds the fiber node with the associated key.
   * @param {FiberNode} node - The current node.
   * @param {string} key - The query key.
   * @return {FiberNode} - The FiberNode matching the key.
   */
  static findFiberNode(node, key) {
    if (node === null) {
      return node;
    }

    if (TreeParser.match(node.key) === key) {
      return node;
    }

    return TreeParser.findFiberNode(node.child, key) || TreeParser.findFiberNode(node.sibling, key);
  }

  /**
   * Finds the dom node with the associated key.
   * @param {string} key - The query key.
   * @return {DOMNode|null} - The DOM node matching the key. Null if not found.
   */
  static findDOMNode(key) {
    const fiberNode = TreeParser.findFiberNode(TreeParser.findRootFiberNode(), key);

    if (!fiberNode) {
      return null;
    }

    let node = fiberNode;
    while (node && (!node.stateNode || !node.stateNode.nodeType)) {
      node = node.child;
    }

    return node ? node.stateNode : null;
  }

  /**
   * Finds the key of the FiberNode.
   * @param {FiberNode} fiberNode - The FiberNode.
   * @return {string|null} - The key of the FiberNode. Null if not found.
   */
  static findFiberNodeKey(fiberNode) {
    if (!fiberNode || typeof fiberNode.type === 'string') {
      return null;
    }

    return TreeParser.match(fiberNode.key) || TreeParser.findFiberNodeKey(fiberNode.return);
  }

  /**
   * Finds the key of the provided DOMNode.
   * @param {DOMNode} node - The DOMNode.
   * @return {string|null} - The key of the node. Null if not found.
   */
  static findDOMNodeKey(node) {
    const fiberNode = TreeParser.getFiberNode(node);

    if (!fiberNode) {
      return null;
    }

    return TreeParser.findFiberNodeKey(fiberNode.return);
  }

  /**
   * Finds the root FiberNode of the React instance tree.
   * @return {FiberNode} - The root FiberNode.
   */
  static findRootFiberNode() {
    return TreeParser.getFiberNode(document.getElementById('kaiju-root'));
  }

  /**
   * Matches a UUID.
   * @param {string} string - The string to match.
   * @return {string|null} - A UUID. Null if no match is found.
   */
  static match(key) {
    const match = `${key}`.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
    return match ? match[0] : null;
  }
}

export default TreeParser;
