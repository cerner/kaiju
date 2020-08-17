// eslint-disable-next-line import/no-extraneous-dependencies
const { parse } = require('react-docgen');

/* eslint-disable import/no-extraneous-dependencies, no-console */
const chalk = require('chalk');
const Format = require('./format');

/**
 * Supported react-docgen PropTypes.
 * Maps React Docgen types to project types.
 */
const PropTypes = {
  arrayOf: 'array',
  bool: 'bool',
  element: 'element',
  func: 'func',
  node: 'node',
  number: 'number',
  string: 'string',
};

class Property {
  /**
   * Creates an object representation of the component properties.
   * @param {Object} props - The react-docgen props object.
   * @returns {Object} - An Object representation of the component properties.
   */
  static createProperties(props) {
    const properties = {};

    Object.keys(props).forEach((prop) => {
      properties[prop] = Property.create(prop, props[prop]);
    });

    return properties;
  }

  static print(filePath) {
    const { props } = parse(filePath);

    console.log(JSON.stringify(Property.createProperties(props), null, 2));
  }

  /**
   * Creates a JSON representation of a property.
   * @param {string} prop - The property name.
   * @param {Object} property - The component property.
   * @return {Object|undefined} - A JSON object representing the property.
   */
  static create(prop, property) {
    const { description, required } = property;

    if (description.indexOf('@private') >= 0) {
      return undefined;
    }

    const type = Property.type(property);

    if (!type) {
      console.warn(`${chalk.yellow('WARNING:')} Unable to interpret ${prop}.`);
      return undefined;
    }

    return {
      type,
      required,
      description,
      displayName: Format.humanize(prop),
      defaultValue: Property.defaultValue(property),
      options: Property.options(property),
      schema: Property.schema(property),
    };
  }

  /**
   * Returns the default value of a property.
   * @param {Object} property - The component property.
   * @return {bool|number|string|undefined} - The default value.
   */
  static defaultValue(property) {
    const { type, defaultValue = {} } = property;
    const { name } = type;
    const { value } = defaultValue;

    if (value === undefined || value === 'undefined' || value === 'null') {
      return undefined;
    }

    switch (name) {
      case 'bool':
        return value !== 'false';
      case 'number':
        return parseInt(value, 10);
      case 'string':
        return value.replace(/[']+/g, '');
      case 'enum':
        return value.replace(/[']+/g, '');
      default:
        return undefined;
    }
  }

  /**
   * Returns the enum property type. Null if unable to interpret.
   * @param {Object} property - The component property.
   * @return {string|null} - The property type.
   */
  static enumType(property) {
    const { type } = property;
    const { value, computed } = type;

    // Attempt to find a non-computed option. Computed options cannot be interpreted.
    const enumSample = value.find(option => option.computed === false);

    if (computed || !enumSample) {
      return null;
    }

    if (enumSample.value.toString().indexOf('\'') > -1) {
      return PropTypes.string;
    }

    if (parseInt(enumSample.value, 10)) {
      return PropTypes.number;
    }

    return null;
  }

  /**
   * Returns the list of available options for a given property.
   * @param {Object} property - The component property.
   * @return {array|undefined} - A list of property options.
   */
  static options(property) {
    const { type } = property;
    const { name, value: enums } = type;

    if (name !== 'enum') {
      return undefined;
    }

    const options = [];
    const propertyType = Property.enumType(property);

    enums.forEach(({ value, computed }) => {
      if (!computed) {
        const optionValue = value.replace(/[']+/g, '');
        const displayName = Format.humanize(optionValue);
        options.push({ displayName, value: optionValue, type: propertyType });
      } else {
        console.warn(`${chalk.yellow('WARNING:')} Unable to interpret ${JSON.stringify(property)}.`);
      }
    });

    return options;
  }

  /**
   * Returns the schema for a given property.
   * @param {Object} property - The component property.
   * @return {Object} - The property schema.
   */
  static schema(property) {
    const { type } = property;
    const { name, value = {} } = type;
    const { name: propertyType } = value;

    if (name === 'arrayOf' && propertyType) {
      return { type: PropTypes[propertyType] };
    }

    return undefined;
  }

  /**
   * Determines the property type. Returns null if unable to interpret.
   * @param {Object} property - The component property.
   * @return {string|null} - The property type.
   */
  static type(property) {
    const { type } = property;
    const { name } = type;

    if (PropTypes[name]) {
      return PropTypes[name];
    }

    if (name === 'enum') {
      return Property.enumType(property);
    }

    return null;
  }
}

module.exports = Property;
