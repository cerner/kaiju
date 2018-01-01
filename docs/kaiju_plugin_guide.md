# Kaiju Plugin Guide Beta


Kaiju plugins provide server owners the ability to add additional project types to Kaiju. These plugins control the components available in the project, the code that is generated and the generated preview.

## Usage

To add a new plugin to kaiju, modify the kaiju-plugin.config.js in the node server.
```js
import TerraPlugin from 'terra-kaiju-plugin';
import NewPlugin from 'new-plugin';

const config = {
  terra: {
    name: 'Terra',
    plugin: TerraPlugin,
  },
  newPlugin: {
    name: 'New Plugin',
    plugin: NewPlugin,
  },
};

export default config;
```

The config object should be built in the following format:

```js
const config = {
  // Required: The key is used to uniquely identify kaiju projects created using this plugin.
  key: {
    // Required: The name shown to the user when picking a project.
    name: 'My awesome project type',
    // Required: The plugin is the required plugin object.
    plugin: MyAwesomePlugin,
  },
};
```

You can alias plugins if required.
```js
import TerraPlugin from 'terra-kaiju-plugin';

const config = {
  terra: {
    name: 'Terra',
    plugin: TerraPlugin,
  },
  terraAlias: {
    name: 'Terra Alias',
    plugin: TerraPlugin,
  },
};

export default config;
```
Removing a plugin from Kaiju should be considered a non passive event and users will loose access to projects created using a no longer available plugin.

## Development

Creating a new Kaiju plugin is reasonably straight forward. There are four required methods that any plugin is required to implement and an optional helper module that can be used for common methods. See [terra-kaiju-plugin](https://github.com/cerner/terra-kaiju-plugin) as an example.

### projectDescription
Project description simply returns a string containing the description of your project. This is used in Kaiju to provide a project description to users in the project type selection modal.

**Arguments:** None

**Return values:** String

**Example:**
```js
static projectDescription() {
  return 'My Amazing Kaiju Project';
}
```

### componentModules
Component Modules offers up an array of names of modules. Kaiju searches the listed modules for a ```kaiju``` directory containing ```**/*.json``` files (using glob). The ```*.json``` files should be ```kaiju.json``` files representing the components to be added to the project. ```kaiju.json``` files can either be kept in the plugin or alongside the component the file represents. Changes to component modules can be non-passive and removing components is non-passive. Kaiju workspaces adjust to non-passive changes and will remove components that are not found from the workspaces, but users work may be lost.

**Arguments:** None

**Return values:** Array of Strings

**Example:**
```js
static componentModules() {
  return [
    'random-component',
    'this-plugin',
  ];
}
```

### generateCode
**This API will most likely change as we develop clickable prototypes and project code generation**

This method takes the abstract syntax tree passed in and turn it into files that are then stored (in most cases) in the provided in memory file system. This code will also be used to generate the preview, the same data from the returned in memory file system will be passed to the ```generatePreivew``` method. Code can be generated into any file format as long as the generatePreview method can transform the output into files acceptable to a web browser. The rootId should be used to render into. A manifest should be returned identifying the paths of the files that should be shown to the user by kaiju. Since the generated code is also used to generate the preview there may be files included that are undesirable to show users as generated code. The output of the ```generateCode``` method will be cached and ```generateCode``` will not be called again until the user makes changes to their workspace.

**Arguments:**
* ast - A Kaiju flavor abstract syntax tree. (This input may need to change into a list of AST's) See the "Understanding the Kaiju AST" section for more info.
* rootId - The id of the container on the dom to render into.
* fs - A [memory-fs](https://www.npmjs.com/package/memory-fs) instance. It's recommended to use this file system to store generated files.

**Return values:** An array of Promises containing:
* manifest - A list of the files that should be displayed to the user.
* fs - A [memory-fs](https://www.npmjs.com/package/memory-fs) instance, probably the same as was passed in.

**Example:**
```js
static generateCode(ast, rootId, fs) {
  fs.mkdirpSync('/src');
  fs.writeFileSync('/src/code.jsx', <Use AST here to make a sweet code file>);
  const manifest = ['/src/code.jsx'];
  return Promise.all([manifest, fs]);
}
```

### generatePreview
This method takes the in-memory file system output from ```generateCode``` and transform them into file consumable by a web browser. In the [terra-kaiju-plugin](https://github.com/cerner/terra-kaiju-plugin) example, webpack is used to transform the es6 jsx generated code into a single entry. The output of the ```generatePreview``` method will be cached and ```generatePreview``` will not be called again until the user makes changes to their workspace.

**Arguments:**
* fs - A [memory-fs](https://www.npmjs.com/package/memory-fs) instance, direct output from ```generateCode```.
* publicPath - The path the browser will use to access the files. Ex. ```/projects/long-firefly-7Mfm-Q/workspaces/autumn-ookondoru-q94ftA/preview_files```

**Return values:** An array of Promises containing:
* entry - The main js file to be included on the preview page. See the "Preview html template" section for more info.
* outputPath - String. The directory in the memory-fs where the preview artifacts are stored. Ex. ```'/build/'```
* fs - A [memory-fs](https://www.npmjs.com/package/memory-fs) instance containing preview artifacts.

**Example:**
```js
static generatePreview(fs, publicPath) {
  const webpackFs = PluginUtils.webpackFs(fs);
  const outputPath = '/build/';
  const webpackConfig = Object.assign({}, PluginUtils.defaultWebpackConfig(publicPath, outputPath), { entry: { preview: '/src/code.jsx' } });
  return Promise.all([
    'preview.js',
    outputPath,
    PluginUtils.runCompiler(webpackFs, modifiedConfig),
  ]);
}
```

### Preview html template
This is the template used to render the preview. ```entry.js``` is the entry file returned by ```generatePreview```. In the future this template may be returned by the plugin.

```html
<html>
  <head>
    <title>workspace title</title>
  </head>
  <body>
   <div id="root"></div>
   <script src="/projects/projectId/workspaces/workspaceId/preview_files/entry.js">
   </script>
  </body>
</html>
```

### Understanding the Kaiju AST
More to come on this.

```json
{
  "id": "autumn-ookondoru-q94ftA",
  "name": "Workspace",
  "properties": {
    "children": {
      "id": "children",
      "type": "Array",
      "value": [
        {
          "id": "children::0",
          "type": "Component",
          "value": {
            "id": "080d9546-01e7-41cb-a4ee-77700a4052ec",
            "name": "DemographicsBanner",
            "code_name": "DemographicsBanner",
            "type": "terra-demographics-banner::DemographicsBanner",
            "import": "DemographicsBanner",
            "import_from": "terra-demographics-banner",
            "properties": {
              "personName": {
                "id": "personName",
                "type": "String",
                "value": "John Smith"
              },
              "age": {
                "id": "age",
                "type": "String",
                "value": "25 Years"
              },
              "dateOfBirth": {
                "id": "dateOfBirth",
                "type": "String",
                "value": "May 9, 1993"
              },
              "gender": {
                "id": "gender",
                "type": "String",
                "value": "Male"
              },
              "photo": {
                "id": "photo",
                "type": "Component",
                "value": {
                  "id": "fdbe5b2a-c9e5-4643-ad5a-c375f0675d53",
                  "name": "Image",
                  "code_name": "Image",
                  "type": "terra-image::Image",
                  "import": "Image",
                  "import_from": "terra-image",
                  "properties": {
                    "src": {
                      "id": "src",
                      "type": "String",
                      "value": "data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBkPSJNMjQgMGExMS4zIDExLjMgMCAxIDEtMTEuMyAxMS4zQTExLjM1IDExLjM1IDAgMCAxIDI0IDB6bTE5LjUgNDh2LTUuN2ExNi43NyAxNi43NyAwIDAgMC0xNi44LTE2LjhoLTUuNUExNi43NSAxNi43NSAwIDAgMCA0LjUgNDIuM1Y0OHoiLz48L3N2Zz4="
                    },
                    "alt": {
                      "id": "alt",
                      "type": "String",
                      "value": "patient-image"
                    },
                    "height": {
                      "id": "height",
                      "type": "String",
                      "value": "50px"
                    },
                    "width": {
                      "id": "width",
                      "type": "String",
                      "value": "50px"
                    }
                  }
                }
              }
            }
          }
        }
      ]
    }
  }
}
```
