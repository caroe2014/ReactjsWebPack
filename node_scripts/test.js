// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';
require('./register');
require('./tools/test');
