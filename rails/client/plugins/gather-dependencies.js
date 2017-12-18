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

GatherDependencies.prototype.apply = () => {
  let imports = '';
  let mapping = '';
  let modules = [];
  const importSet = new Set();
  const whitelist = JSON.parse(fs.readFileSync('../whitelist.json', 'utf8'));

  whitelist.forEach(({ name }) => {
    modules = modules.concat(glob.sync(`./node_modules/${name}/lib/kaiju/**/*.json`));
  });

  modules.forEach((file) => {
    const { library, name, import: moduleImport, import_from: importFrom } = JSON.parse(fs.readFileSync(file, 'utf8'));

    // Prepend the library to avoid name collisions
    // Example: Textarea from 'terra-form' and Textarea from terra-form-textarea
    let alias = name;
    if (importSet.has(alias)) {
      alias = toTitleCase(library).replace(alias, alias);
    }
    importSet.add(alias);

    mapping = mapping.concat(`   '${library}::${name}': ${moduleImport ? `${moduleImport}.${name}` : alias},\n`);

    if (!moduleImport) {
      imports = imports.concat(` import ${moduleImport || alias} from '${importFrom || library}';\n`);
    }
  });

  fs.writeFileSync('./app/bundles/kaiju/components/Component/componentMap.js', `
 import Placeholder from './components/Placeholder/Placeholder';
 import KaijuText from './components/Text/Text';
 import Workspace from './components/Workspace/Workspace';
${imports}

 const componentMap = {
   'kaiju::Placeholder': Placeholder,
   'kaiju::Workspace': Workspace,
   'kaiju::Text': KaijuText,
${mapping}
  };

  export default componentMap
  `);
};

module.exports = GatherDependencies;
