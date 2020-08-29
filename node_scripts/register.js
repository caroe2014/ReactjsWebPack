// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

// Make the .env file take precedence
require('dotenv').config();
// make require/import paths relative to the root of the project.
require('app-module-path').addPath(__dirname + '/../');
// Perform babel transforms defined in .babelrc (ES6, JSX, etc.) on server-side code
// Note: the options in .babelrc are also used for client-side code
// because we use a babel loader in webpack config
require('babel-register');
