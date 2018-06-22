/* eslint import/no-unresolved: [2, { ignore: ['../componentMap'] }] */
import React from 'react';
import PropTypes from 'prop-types';
import uniqid from 'uniqid';
import { connect } from 'react-redux';
import SafeRender from '../components/SafeRender/SafeRender';
// eslint-disable-next-line import/extensions
import componentMap from '../componentMap';

const propTypes = {
  /**
   * The component tree.
   */
  components: PropTypes.object.isRequired,
  /**
   * The refreshed component.
   */
  refreshedComponent: PropTypes.string,
  /**
   * The root component identifier.
   */
  root: PropTypes.string.isRequired,
};

class ComponentContainer extends React.Component {
  constructor(props) {
    super(props);

    this.generateComponent = this.generateComponent.bind(this);
    this.generateProperty = this.generateProperty.bind(this);
  }

  /**
   * Generates a component wrapper
   * @param {String} component - The component identifier
   * @return {Node} - A kaiju component wrapper
   */
  generateComponent(component) {
    const { components, refreshedComponent } = this.props;
    const { id, properties, type } = components[component];
    const key = id === refreshedComponent ? `kaiju$${uniqid()}$${id}` : id;

    const props = { key };

    Object.keys(properties).forEach((property) => {
      // Filter top level properties. Any key containing :: is a sub property
      if (!property.includes('::')) {
        const value = this.generateProperty(properties, property);
        if (value !== undefined && value !== null) {
          props[property] = value;
        }
      }
    });

    return React.createElement(componentMap[type], props);
  }

  /**
   * Transforms a property value into a React prop
   * @param {Object} properties - Flattened property store
   * @param {[type]} property - The property key
   * @return {Object} - React syntax compliant prop value
   */
  generateProperty(properties, property) {
    const { type, value } = properties[property];

    if (value === undefined || value === null) {
      return null;
    } else if (type === 'Array') {
      const array = [];
      value.forEach(({ id }) => {
        const item = this.generateProperty(properties, id);
        if (item !== undefined && item !== null) {
          array.push(item);
        }
      });
      return (array.length > 0) ? array : null;
    } else if (type === 'Hash') {
      const hash = {};
      Object.keys(value).forEach((key) => {
        const { id } = value[key];
        const val = this.generateProperty(properties, id);
        if (val !== undefined && val !== null) {
          hash[key] = val;
        }
      });
      // Do not return empty objects
      return Object.keys(hash).length > 0 ? hash : null;
    } else if (type === 'Component') {
      return this.generateComponent(value.id);
    } else if (type === 'Number') {
      return Number(value);
    }
    return value;
  }

  render() {
    return <SafeRender>{this.generateComponent(this.props.root)}</SafeRender>;
  }
}

ComponentContainer.propTypes = propTypes;

const mapStateToProps = ({ components, refreshedComponent }, { root }) => (
  { components, root, refreshedComponent }
);

export default connect(mapStateToProps)(ComponentContainer);
