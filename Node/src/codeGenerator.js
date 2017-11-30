const REACT_IMPORT = "import React from 'react';\n";
const PROPTYPES_IMPORT = "import PropTypes from 'prop-types';\n";
const PROPTYPES = 'const propTypes = {\n  // exampleProp: PropTypes.string,\n};\n\n';
const DEFAULT_PROPS = "const defaultProps = {\n  // exampleProp: 'Default prop',\n};\n\n";

const getDefaultExports = (componentName) => {
  const propTypes = `${componentName}.propTypes = propTypes;\n`;
  const defaultProps = `${componentName}.defaultProps = defaultProps;\n\n`;
  const defaultExport = `export default ${componentName};\n`;
  return `${propTypes}${defaultProps}${defaultExport}`;
};

const getSanitizedName = name => name.split('::').pop();

const gatherImports = (object) => {
  const imports = new Set();

  Object.keys(object).forEach((objectKey) => {
    const { type, value } = object[objectKey];
    if (value === undefined) {
      // No value was provided
    } else if (value && (type === 'Array' || type === 'Hash')) {
      gatherImports(value).forEach(item => imports.add(item));
    } else if (value && type === 'Component') {
      const module = value.type.split('::');
      imports.add(`import ${module[1]} from '${module[0]}';\n`);
      gatherImports(value.properties).forEach(item => imports.add(item));
    }
  });

  return imports;
};

const generateChildren = (children) => {
  if (!children || !children.value) {
    return '';
  }

  return children.value.map(({ value }) => generateComponent(value)).join('\n');
};

const generateProps = (object) => {
  const parameters = Array.isArray(object) ? [] : {};

  Object.keys(object).forEach((objectKey) => {
    const { type, value } = object[objectKey];
    if (value === undefined || value === null) {
      // No value was provided
    } else if (type === 'Array') {
      parameters[objectKey] = `[${generateProps(value).join(', ')}]`;
    } else if (type === 'Hash') {
      parameters[objectKey] = generateProps(value);
    } else if (type === 'Component') {
      parameters[objectKey] = generateComponent(value);
    } else if (type === 'String' || type === 'CodifiedList') {
      parameters[objectKey] = `"${value}"`;
    } else {
      parameters[objectKey] = value;
    }
  });

  return parameters;
};

const generateComponent = (component) => {
  const { type, properties } = component;
  const componentName = getSanitizedName(type);
  const children = generateChildren(properties.children);
  const hash = generateProps(properties);
  const props = Object.keys(hash).map(key => (
    properties[key].type === 'String' || properties[key].type === 'CodifiedList' ? `${key}=${hash[key]}` : `${key}={${hash[key]}}`
  )).join(' ');

  return `<${componentName} ${props}>${children}</${componentName}>`;
};

const generateReactComponent = (componentJSON) => {
  const { name: componentName, properties } = componentJSON;
  const imports = `${REACT_IMPORT}${PROPTYPES_IMPORT}${[...gatherImports(properties)].join('')}\n`;
  const defaultExports = getDefaultExports(componentName);
  const children = generateChildren(properties.children);
  const component = `const ${componentName} = props => (\n<div className="kaiju-${componentName}">\n${children}\n</div>\n);\n\n`;
  return `${imports}${PROPTYPES}${DEFAULT_PROPS}${component}${defaultExports}`;
};

export default generateReactComponent;
