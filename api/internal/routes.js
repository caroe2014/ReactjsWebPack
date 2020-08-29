// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import Joi from 'joi';
import Api from './api';

const logger = config.logger.child({component: path.basename(__filename)});
const dir = path.basename(__dirname, __filename);

export default [
  {
    method: 'GET',
    path: ``,
    handler: {
      view: 'healthcheck' // healthcheck.jsx in /server/views
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'Get internal summary',
      notes: 'Returns internal summary',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS}
    }
  },
  {
    method: 'GET',
    path: `index.html`,
    handler: {
      view: 'healthcheck' // healthcheck.jsx in /server/views
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'Get internal summary',
      notes: 'Returns internal summary',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS}
    }
  },
  {
    method: 'GET',
    path: `healthchecks`,
    handler: (request, reply) => {
      return Api.getSummary();
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'Get health check summary',
      notes: 'Returns summary of health checks.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `manifest`,
    handler (request, h) {
      let file = path.join(__dirname, '../../', 'manifest.json');
      return h.file(file);
    },
    config: {
      auth: false,
      // SWAGGER DOCS
      description: 'Get app manifest summary',
      notes: 'Returns app manifest.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  }
];
