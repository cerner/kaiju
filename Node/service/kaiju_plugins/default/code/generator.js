import format from 'prettier-eslint';
import stringEscape from 'js-string-escape';

/**
 * Generates the code for rendering a Component
 * @param {Object} ast - The Component ast
 * @return {String} - The generated code
 */
const generate = (ast) => {
  // A set of unique imports for the Component
  const imports = new Set();

  /**
   * Recursively iterates property structures generating code
   * @param {Object} object - The object to iterate
   * @return {Object} - A hash containing property key value pairing
   */
  const generateProperties = (object) => {
    const parameters = Array.isArray(object) ? [] : {};

    Object.keys(object).forEach((key) => {
      const { type, value } = object[key];
      if (value === undefined || value === null) {
        // No value was provided. Do not generate props
      } else if (key === 'children') {
        parameters[key] = type === 'String' ? value : generateProperties(value).join('');
      } else if (value.type === 'kaiju::Text') {
        // Custom code to convert the Kaiju text component into raw text
        const text = stringEscape(value.properties.text.value);
        parameters[key] = `'${text}'`;
      } else if (type === 'Array') {
        parameters[key] = `[${generateProperties(value).join(', ')}]`;
      } else if (type === 'Hash') {
        const hash = generateProperties(value);
        parameters[key] = `{ ${Object.keys(hash).map(k => `${k}: ${hash[k]}`).join(', ')} }`;
      } else if (type === 'Component') {
        const properties = generateProperties(value.properties);
        imports.add(`import ${value.import} from '${value.import_from}';`);

        let props = '';
        Object.keys(properties).forEach((prop) => {
          if (prop !== 'children') {
            props += ` ${prop}={${properties[prop]}}`;
          }
        });

        parameters[key] = `<${value.code_name}${props}>${properties.children || ''}</${value.code_name}>`;
      } else if (type === 'Number') {
        parameters[key] = Number(value);
      } else if (type === 'String') {
        parameters[key] = `'${stringEscape(value)}'`;
      } else {
        parameters[key] = value;
      }
    });

    return parameters;
  };

  const code = generateProperties(ast.properties).children;

  return format({
    text: `import ReactDOM from 'react-dom';import React from 'react';import Base from 'terra-base';${Array.from(imports).join('\n')}const Workspace = () => (<Base locale='en-US'>${code}</Base>);\n\nReactDOM.render(<Workspace />, document.getElementById('root'));`,
  });
};

export default generate;
