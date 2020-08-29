// Copyright © 2018-2019 Agilysys NV, LLC.  All Rights Reserved.  Confidential Information of Agilysys NV, LLC.

import path from 'path';
import Api from './api';
import util from '../util';

const dir = path.basename(__dirname, __filename);

// HapiJS 17 Routing.
// NOTE: the second argument in the handler method(s), "reply" is the HapiJS "Response Toolkit".
// Reference : https://hapijs.com/api#response-toolkit

export default [
  {
    method: 'POST',
    path: `token/{tenantId}`,
    handler: async (request, reply) => {
      const credentials = await util.getPosApiCredentialsFromRequest(request);
      return await Api.getToken(credentials, request);
    },
    config: {
      // SWAGGER DOCS
      description: 'Get Token from User service',
      notes: 'Returns a valid token.',
      tags: ['api', dir, 'get']
      // END SWAGGER DOCS
    }
  }
];
