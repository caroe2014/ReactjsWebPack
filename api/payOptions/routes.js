// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import config from 'app.config';
import path from 'path';
import { echo } from 'web/validation';
import Api from './api';

const logger = config.logger.child({component: path.basename(__filename)});
const dir = path.basename(__dirname, __filename);

// HapiJS 17 Routing.
// NOTE: the second argument in the handler method(s), "reply" is the HapiJS "Response Toolkit".
// Reference : https://hapijs.com/api#response-toolkit

export default [
  {
    method: 'POST',
    path: `getOptions/{tenantId}`,
    handler: async (request, reply) => {
      return await Api.getOptions(request);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Token from User service',
      notes: 'Returns a valid token.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  },
  {
    method: 'GET',
    path: `getIFrameCss/{language}/{domain}`,
    handler: async (request, reply) => {
      return reply.response(await Api.getIFrameCss(request, request.params.language, request.params.domain)).type('text/css');
    },
    config: {
      // SWAGGER DOCS
      auth: false,
      description: 'Get css for Pay iFrame',
      notes: 'Returns a translated Css.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  }
];
