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
  }
];
