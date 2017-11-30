/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const glob = require('glob');

function GatherDependencies() {}

GatherDependencies.prototype.apply = () => {
  let imports = '';
  let mapping = '';
  let modules = [];
  const whitelist = JSON.parse(fs.readFileSync('../whitelist.json', 'utf8'));

  whitelist.forEach(({ name }) => {
    modules = modules.concat(glob.sync(`./node_modules/${name}/lib/kaiju/**/*.json`));
  });

  modules.forEach((file) => {
    const { library, name, import: moduleImport, import_from: importFrom } = JSON.parse(fs.readFileSync(file, 'utf8'));
    mapping = mapping.concat(`   '${library}::${name}': ${moduleImport ? `${moduleImport}.${name}` : name},\n`);

    if (!moduleImport) {
      imports = imports.concat(` import ${moduleImport || name} from '${importFrom || library}';\n`);
    }
  });

  fs.writeFileSync('./app/bundles/Kaiju/components/Component/componentMap.js', `
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
