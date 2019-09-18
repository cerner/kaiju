/**
 * Flattens a component
 * @param {Object} component - The component to flatten
 * @return {Object} - A flat hash representation of the component
 */
const flattenComponent = (component) => {
  const store = {};

  /**
   * Flattens an object into a single level hash
   * @param {Object} object - The object to flatten
   * @return {Object} - A flat hash representation of the object
   */
  const flatten = (object) => {
    let properties = {};

    Object.keys(object).forEach((objectKey) => {
      const property = object[objectKey];
      const {
        id, type, url, value,
      } = property;
      if (type === 'Array' || type === 'Hash') {
        properties = { ...properties, ...flatten(value), [id]: { ...property } };
      } else if (type === 'Component' && value) {
        properties[id] = { ...property, value: { id: value.id } };
        store[value.id] = {
          ...property, ...value, propertyUrl: url, properties: flatten(value.properties),
        };
      } else {
        properties[id] = property;
      }
    });

    return properties;
  };

  const { id, properties } = component;
  return { ...store, [id]: { ...component, properties: flatten(properties) } };
};

/**
 * Serializes a component into a data hash
 * @param {Object} store - The component store
 * @param {Object} component - The component to serialize
 * @return {Object} - A data hash representation of the component
 */
const serializeComponent = (store, component) => {
  const { properties, type } = component;

  const props = {};
  Object.keys(properties).forEach((key) => {
    if (!key.includes('::')) {
      // eslint-disable-next-line
      props[key] = serializeObject(store, properties[key], properties);
    }
  });

  return { type, props };
};

/**
 * Serializes an object into a data hash
 * @param {Object} store - The component store
 * @param {Object} object - The object to serialize
 * @param {Object} properties - The properties of the component the object belongs to
 * @return {Object} - A raw value representation of the object
 */
const serializeObject = (store, object, properties) => {
  const { type, value } = object;
  if (value === undefined || value == null) {
    // No value was provided
  } else if (type === 'Array') {
    return value.map(({ id }) => serializeObject(store, properties[id], properties));
  } else if (type === 'Component') {
    return serializeComponent(store, store[value.id]);
  } else if (type === 'Hash') {
    const props = {};
    Object.keys(value).forEach((key) => {
      props[key] = serializeObject(store, properties[value[key].id], properties);
    });
    return props;
  }
  return value;
};

export {
  flattenComponent,
  serializeComponent,
  serializeObject,
};
