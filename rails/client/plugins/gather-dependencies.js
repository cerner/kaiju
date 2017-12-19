/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const glob = require('glob');

function GatherDependencies() {}

/**
 * Converts a hyphenated string into title case.
 * @param {String} string - A hyphenated string.
 * @return {String} - A titlized string.
 */
const toTitleCase = string => (
  string.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
);

/**
 * Indents a string.
 * @param {String} string - The string to indent.
 * @param {Integer} count - The number of indentations.
 * @return {String} - A string with the specified indentation.
 */
const indent = (string, count) => string.replace(/^(?!\s*$)/mg, (' ').repeat(count));

GatherDependencies.prototype.apply = () => {
  const modules = [];
  const collection = {};
  const aliasSet = new Set();
  const whitelist = JSON.parse(fs.readFileSync('../whitelist.json', 'utf8'));

  // Aggregates available kaiju JSON files.
  whitelist.forEach(({ name }) => {
    const pattern = `./node_modules/${name}/lib/kaiju/**/*.json`;
    glob.sync(pattern).forEach((file) => {
      modules.push(JSON.parse(fs.readFileSync(file, 'utf8')));
    });
  });

  // Creates a mapping for available components and resolves name collisions.
  modules.forEach(({ library, name }) => {
    // Prepend the library to avoid name collisions.
    // Example: Textarea from 'terra-form' and Textarea from terra-form-textarea.
    let alias = name;
    if (aliasSet.has(alias)) {
      alias = toTitleCase(library).replace(alias, alias);
    }
    aliasSet.add(alias);

    // Keep a mapping of the components.
    if (!collection[library]) {
      collection[library] = {};
    }

    // Store the alias.
    collection[library][name] = alias;
  });

  const imports = [
    "import Placeholder from './components/Placeholder/Placeholder';",
    "import KaijuText from './components/Text/Text';",
    "import Workspace from './components/Workspace/Workspace';",
  ];

  const componentMap = [
    "'kaiju::Placeholder': Placeholder,",
    "'kaiju::Workspace': Workspace,",
    "'kaiju::Text': KaijuText,",
  ];

  // This second loop must be done after the initial loop to
  // guarantee all aliases have been assigned.
  modules.forEach(({ library, name, ...component }) => {
    const alias = collection[library][name];
    const mapping = component.import ? `${collection[library][component.import]}.${name}` : alias;
    componentMap.push(`'${library}::${name}': ${mapping},`);

    if (!component.import) {
      imports.push(`import ${alias} from '${component.import_from || library}';`);
    }
  });

  const importString = imports.join('\n');
  const mapString = `\n\nconst componentMap = {\n${indent(componentMap.join('\n'), 2)}\n};`;

  const filePath = './app/bundles/kaiju/components/Component/componentMap.js';
  fs.writeFileSync(filePath, `${importString}${mapString}\n\nexport default componentMap`);
};

module.exports = GatherDependencies;
