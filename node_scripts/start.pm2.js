// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

require('./register');
// get generator/async functions working for the web-server
require("babel-polyfill");
require('node_scripts/make.js');
require('web-server.js');
