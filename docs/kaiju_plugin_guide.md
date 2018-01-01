# Kaiju Plugin Guide

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



### Understanding the Kaiju AST
