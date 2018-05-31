/* eslint import/no-unresolved: [2, { ignore: ['../componentMap'] }] */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/extensions
import componentMap from '../../componentMap';

const propTypes = {
  /**
   * The Component Identifer
   */
  kaijuId: PropTypes.string.isRequired,
  /**
   * Whether the Component is sortable
   */
  kaijuSortable: PropTypes.bool,
  /**
   * The Component type
   */
  kaijuType: PropTypes.string.isRequired,
};

class Element extends React.Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
  }

  componentDidMount() {
    this.register();
  }

  componentDidUpdate() {
    this.register();
  }

  register() {
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);

    // Some components are conditionally rendered into the dom.
    if (!node) {
      return;
    }

    const { kaijuId, kaijuType, kaijuSortable } = this.props;

    node.setAttribute('data-kaiju-component-id', kaijuId);
    node.setAttribute('data-kaiju-component-type', kaijuType);
    node.setAttribute('draggable', kaijuType !== 'kaiju::Placeholder' && kaijuType !== 'kaiju::Workspace');

    if (kaijuSortable) {
      node.setAttribute('data-kaiju-sortable', true);
    }
  }

  render() {
    const {
      kaijuId, kaijuType, kaijuSortable, ...props
    } = this.props;
    return React.createElement(componentMap[kaijuType], props);
  }
}

Element.propTypes = propTypes;

export default Element;
