
# System Dependencies

  1. node LTS (nvm install --lts) currently 8.11.1
  2. yarn (brew install yarn) currently 1.5.1
  3. pm2 (npm install -g pm2)
  4. Recommend VSCode, but any editor is fine.

### One-liner

```
nvm install --lts && npm install -g pm2 && brew install yarn
```

# Install

```
yarn install
```

OR

```
npm install
```

*note: npm install is used in the build pipeline for "reasons" but yarn should be fine on a dev-machine.*

# NPM Dependencies

  1. Chokidar - Filewatcher
  2. Hapi - HTTP server
  3. React - React :)
  4. H2o2 - Hapi Proxy plugin. Mostly for webpack dev server
  5. [Axios](https://www.npmjs.com/package/axios) - Fetch library
  6. Vision - Enabled rendering views in Hapi with custom engines (like react)
  7. Inert - Hapi static file plugin
  8. Babel - Transpiler. https://babeljs.io/docs/plugins/preset-env
  9. *-loader - Babel transform plugins for various file types.
  10. [Storybook](https://storybook.js.org/basics/introduction/) - Integrated UI component library documentation
  11. [Joi/Joi-full](https://www.npmjs.com/package/joi) - Object schema validation. Share validation rules on the client and server.
  12. [React-Router](https://reacttraining.com/react-router/core/guides/philosophy) - V4
  13. Hapi-Swagger - Integrated swagger docs
  14. styled-components - inline style generator/decorator library for react components.
  15. rebass - ui component primatives

# Debugging

## VSCode

  Add Debug config in .vscode/launch.json. [Click here for information about creating a launch.json and debugging with VSCode](https://code.visualstudio.com/docs/editor/debugging)
```
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "DEBUG API",
      "program": "${workspaceFolder}/service/application/node_scripts/debug-start.js",
      "env": {
        "NODE_ENV": "production",
        "HOST": "127.0.0.1",
        "PORT": "8080"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest All",
      "program": "${workspaceFolder}/service/application/node_modules/jest/bin/jest.js",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Current File",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      "args": ["${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}

```

# Running the app & Misc Commands

###### Dev ENV

Runs the app in dev-mode.

```
yarn start:dev
```

###### Production LOCAL

Runs the app like it's in production; no hot reloading, no edit & continue, etc

```
yarn start:local
```

###### Make

Produces configuration files for the environment.

*production - mode*
```
yarn make
```
*development - mode*
```
yarn make:dev
```

##### Build

Runs the webpack build. Drops everything in the configured build directory in app.config.js (public/static/build). Always runs in production mode.

```
yarn build
```

##### Clean - dev

Dev-only clean. Removes all files generated by yarn make, any bundles in the build directory, webpack-assets.json, and logs. Pretty much everything not in the repo except for node_modules.

```
yarn clean:dev
```

###### Unit Tests

Runs unit tests. Job will fail if any test in any given test suite fails.

```
yarn test
```

###### Unit Test Coverage

Runs unit tests as well as Istanbul Test coverage.(Currently set at 70% globally). Tests will fail with error code 1 if coverage for a file is not above the specified threshold, even if the tests do pass. Add tests to cover the following parameters for successful test completion:

1. Branches
2. Functions
3. Lines
4. Statements

```
yarn test:coverage
```

##### Swagger - dev only

Swagger is available at [http://0.0.0.0:8080/documentation](http://0.0.0.0:8080/documentation) when running with ```yarn start:dev```

##### Storybook - dev only

[Documentation](https://storybook.js.org/basics/introduction/)

The Storybook UI is available at [http://0.0.0.0:6006](http://0.0.0.0:6006) and is started with the command:

```
yarn storybook
```

If storybook won't start in the console, e.g. webpack fails when running the above command, delete ```node_modules``` and reinstall with ```yarn install``` then try again.

# Development Guidelines - UI

When adding new UI components to an existing bundle follow these basic guidelines:
  1. Develop the component as close to a "pure" component as possible.
  1. Create a storybook file for the component with stories that exercise the top-level props for the new component
      1. If the component is part of a library/folder with a single index.js, add the stories to the folder's storybook file.
      2. Create unit tests that reflect the stories created for storybook.
  1. Integrate the new component with the application workflow
      1. Create a combiner/connected component for redux integration separately from the pure component, is redux integration is required.
      2. Add unit tests for new redux actions/sagas/reducers
  1. If a new NPM dependency was required, make sure to run ```npm install``` before merging to the develop branch.
      1. The CI pipeline doesn't like to install with yarn so we need the package-lock.json to be up-to-date. We're still working on a fix so that this isn't necessary.
  1. Run ```yarn lint``` before merging to develop from a feature branch and resolve all warnings
      1. We will never fail a build because of lint problems, but keeping the warnings generated whenever webpack runs will help us be consistent and prevent noisy changes in pull requests.
      2. If you feel a linting rule needs to be changed or omitted, add a comment to the pull-request so we can discuss it  as part of the code review.

# Notes

  1. The project requires Node@8 to run, so it's been included as an explicit dependency so that the CICD doesn't choke trying to install with an older version of node.
  1. Because the version of node we need is packaged with the project, the CICD yarn install command won't work. It fails to install because yarn treats the "engines" field in package.json's of dependencies as gospel but only checks against the system-level node install rather than the project.
  1. In CICD, although "yarn install" will fail, all other yarn commands will run just file. For this reason we explicitly include "yarn.lock" in the .gitignore file for this project so that CICD will only run "npm install" instead. There isn't an easy way around that; yarn and npm simply work differently for installs.

# TODO

  1. update extract-text-plugin to 4.0 when it's released to clear the tappable plugin deprecation warning on build.
  2. Add integration tests once we have components better integrated with eachother.

### Apple Pay

In order to use apple pay you must be using https.
The simplest way to serve the project with https is using ngrok

Download ngrok and unzip `https://dashboard.ngrok.com/get-started`
Move ngrok to `/usr/local/bin` so it is in your path
Run `ngrok authtoken [yourkeyhere]`
Run ngrok 8008

Notes: The Agilysys network blocks ngrok.
You must use hit the ngrock proxy url from a device not on the Agilysys network.

### Locize.io

Helpful Links
https://docs.locize.com/
https://confluence.agilysys.local/display/buy/Working+With+Locize.io

Walkthrough/Intro Meeting Video
https://web.microsoftstream.com/video/69334d31-714d-4104-a5c7-06d0e359982d


### Switch between Dev/Int for development
Change line no. 8 of app.config.js to process.env['IS_DEV'] = '0' instead of process.env['IS_DEV'] = '1' for pointing to Int environment when running from local.
This way we can switch between dev and int easily since these are the 2 most used env's for development, fixing bugs.
