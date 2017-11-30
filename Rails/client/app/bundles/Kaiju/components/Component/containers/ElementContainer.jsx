import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SafeRender from '../components/SafeRender/SafeRender';
import componentMap from '../componentMap';

const propTypes = {
  /**
   * The Component Identifer
   */
  id: PropTypes.string.isRequired,
  /**
   * Whether the Component is sortable
   */
  isSortable: PropTypes.bool,
  /**
   * The properties of the Component
   */
  properties: PropTypes.object.isRequired,
  /**
   * The Component type
   */
  type: PropTypes.string.isRequired,
};

class Element extends React.Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.generateProperties = this.generateProperties.bind(this);
  }

  componentDidMount() {
    this.register();
  }

  componentDidUpdate() {
    this.register();
  }

  generateProperties(property, isSortable) {
    const { id, type, value } = property;

    if (value === undefined || value === null) {
      return null;
    } else if (type === 'Array') {
      return value.map(item => this.generateProperties(this.props.properties[item.id], true));
    } else if (type === 'Hash') {
      const hash = {};
      let isEmpty = true;
      Object.keys(value).forEach((key) => {
        const hashValue = this.generateProperties(this.props.properties[value[key].id]);
        if (hashValue !== undefined && hashValue !== null) {
          hash[key] = hashValue;
          isEmpty = false;
        }
      });
      return isEmpty ? {} : hash;
    } else if (type === 'Component') {
      return <ElementContainer id={value.id} key={value.id} isSortable={isSortable} />;
    } else if (type === 'Number') {
      return Number(this.props.properties[id].value);
    }
    return this.props.properties[id].value;
  }

  handleClick(event) {
    event.stopPropagation();
    window.postMessage({ message: 'kaiju-select', id: this.props.id }, '*');
    window.parent.postMessage({ message: 'kaiju-component-selected', id: this.props.id }, '*');
  }

  register() {
    // eslint-disable-next-line react/no-find-dom-node
    const node = ReactDOM.findDOMNode(this);
    const { id, type, isSortable } = this.props;

    node.removeEventListener('click', this.handleClick);
    node.setAttribute('data-kaiju-component-id', id);
    node.setAttribute('data-kaiju-component-type', type);
    node.setAttribute('draggable', type !== 'kaiju::Placeholder' && type !== 'kaiju::Workspace');
    node.addEventListener('click', this.handleClick);

    if (isSortable) {
      node.setAttribute('data-kaiju-sortable', true);
    }
  }

  render() {
    const { type, properties } = this.props;

    const props = {};
    Object.keys(properties).forEach((key) => {
      // Filter top level properties. Any key cotaining :: is a sub property
      if (!key.includes('::')) {
        props[key] = this.generateProperties(properties[key]);
      }
    });

    return <SafeRender type={type}>{React.createElement(componentMap[type], props)}</SafeRender>;
  }
}

Element.propTypes = propTypes;

const mapStateToProps = ({ components }, { id }) => components[id];

const ElementContainer = connect(mapStateToProps)(Element);
export default ElementContainer;
