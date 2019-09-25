<!-- Logo -->
<p align="center">
  <img src="https://github.com/cerner/kaiju/raw/master/kaiju_kaiju_logotype_white.png">
</p>

[![Cerener OSS](https://img.shields.io/badge/Cerner-OSS-blue.svg?style=flat)](http://engineering.cerner.com/2014/01/cerner-and-open-source/)
[![Build Status](https://travis-ci.org/cerner/kaiju.svg?branch=master)](https://travis-ci.org/cerner/kaiju)

Kaiju is a drag and drop web editor for building pages composed of predefined react components. Kaiju's default plug-in allow users to build pages composed of react components from [Terra UI](http://terra-ui.com/), generate react components and preview the generated pages in the browser.

Kaiju is great for rapid prototyping and facilitating collaboration between engineers and designers.

![kaiju demo](/kaiju-demo.gif)

## Local Installation

### Requirements

* [Docker](https://docs.docker.com/engine/installation/)

To run the app, spin up a couple of docker containers with compose and navigate to localhost.
```
docker-compose up
```

### Development Requirements
* Node
* Rails
* Local Redis database

To develop the app, install dependencies and spin rails and node server and navigate to localhost:3000. Running npm install in the root kaiju directory will install npm and rails dependencies.
```
npm install
npm install foreman -g

nf start
```

## Usage
If you haven't setup an IDP you'll be greeted with the mock identity provider. This looks shady, but it's just a pass through provided by omniauth. Any username/email is accepted. That said, please don't use this IDP in production.

After log-in the first step is to create a project. Each new project has a default workspace. The workspace is where you will be creating your new components. Drag a component from the left column to the workspace to drop the component. With this drag and drop system you can build out a tree of nested UI components with a layout as the root. The layers of the workspace will be displayed in the bottom left corner of the editor. The properties of the dropped components can be modified by editing the fields displayed in the right column.

Once you've created your page you can preview it by clicking on the "Eye" tool-bar button located at the bottom of the workspace. Or view the generated code by clicking the code tool-bar button.

Kaiju is an online editor and allows for sharing workspaces between collaborators. By default all workspaces and projects can be view by any logged in user but only the author of a workspace can edit. If the author of workspace or project chooses they can create a collaboration link. This link is active for 24 hours and will add anyone who accesses the link as a collaborator on the project/workspace, giving them privileges to edit.

The best way to give kaiju a try is by following our above docker instructions. You won't be able to leverage the sharing aspect since it's a local instance, but you'll be able to create projects and workspaces as well as generate the code and previews. A public instance will be coming out eventually.

## History

[Releases](https://github.com/cerner/kaiju/releases)

## License

Copyright 2018 Cerner Innovation, Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
